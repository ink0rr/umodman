import { createDir, exists, readDir } from "@tauri-apps/api/fs";
import { gt } from "semver";
import { toast } from "svelte-sonner";
import { writable } from "svelte/store";
import { download } from "tauri-plugin-upload-api";
import { APP_DATA_DIR } from "~/constants";
import { copyDir, extractZip } from "~/utils/commands";
import { type ModVersion, type Mods } from "./mods";
import { profile } from "./profile";

const { subscribe, update } = writable<Map<ModVersion, number>>(new Map());

export const downloader = {
	subscribe,
	async add(modList: Mods[], mod: ModVersion) {
		toast.info(`Downloading ${mod.full_name}`);
		// TODO: Handle multiple games and profiles
		const profileDir = `${APP_DATA_DIR}/lethal-company/profiles/Default`;
		await createDir(profileDir, { recursive: true });

		// weird tauri-plugin-upload-api bug
		await download("https://empty.deno.dev", `${APP_DATA_DIR}/.ignore`);

		const mods = [mod].concat(resolveDependencies(modList, mod));
		await Promise.allSettled(mods.map((dep) => installMod(profileDir, dep)));

		// TODO: Handle this somewhere else
		for (const mod of mods) {
			const [owner, name] = mod.full_name.split("-");
			profile.set(`${owner}-${name}`, mod.version_number);
		}
		profile.save();
		toast.success(`Downloaded ${mod.full_name}`);
	},
	remove(mod: ModVersion) {
		update((downloads) => {
			downloads.delete(mod);
			return downloads;
		});
	},
	clearDownloaded() {
		update((downloads) => {
			for (const [mod, progress] of downloads) {
				if (progress === 100) {
					downloads.delete(mod);
				}
			}
			return downloads;
		});
	},
};

function resolveDependencies(modList: Mods[], mod: ModVersion) {
	const deps = new Map<string, ModVersion>();
	const resolve = (current: ModVersion) => {
		for (const identifier of current.dependencies) {
			const [owner, name, version_number] = identifier.split("-");
			const mod = modList
				.find((m) => m.owner === owner && m.name === name)
				?.versions.find((v) => v.version_number === version_number);
			if (!mod) {
				toast.error(`Failed to resolve ${identifier}`);
				continue;
			}
			const prev = deps.get(`${owner}-${name}`);
			if (!prev || gt(version_number, prev.version_number)) {
				deps.set(`${owner}-${name}`, mod);
			}
			resolve(mod);
		}
	};
	resolve(mod);
	return Array.from(deps.values());
}

async function downloadZip(mod: ModVersion, destPath: string) {
	update((downloads) => downloads.set(mod, 0));
	await createDir(destPath, { recursive: true });

	const zipPath = `${destPath}/mod.zip`;

	let sum = 0;
	await download(mod.download_url, zipPath, (current, total) => {
		sum += current;
		const progress = Math.round((sum / total) * 100);
		update((downloads) => downloads.set(mod, progress));
	});
	await extractZip(zipPath, destPath);
}

type InstallStrategy = {
	type: string;
	useSubdir?: boolean;
	fileType?: string;
};

const installStrategies: InstallStrategy[] = [
	{
		type: "config",
	},
	{
		type: "core",
	},
	{
		type: "monomod",
		useSubdir: true,
		fileType: ".mm.dll",
	},
	{
		type: "patchers",
		useSubdir: true,
	},
	{
		type: "plugins",
		useSubdir: true,
		fileType: ".dll",
	},
];

async function installMod(profileDir: string, mod: ModVersion) {
	const [owner, name, version_number] = mod.full_name.split("-");

	let cacheDir = `${APP_DATA_DIR}/cache/${owner}-${name}/${version_number}`;
	const hasCache = await exists(cacheDir);
	if (!hasCache) {
		await downloadZip(mod, cacheDir);
	}
	// Handle BepInExPack install
	if (await exists(`${cacheDir}/BepInExPack`)) {
		return copyDir(`${cacheDir}/BepInExPack`, profileDir);
	}

	profileDir = `${profileDir}/BepInEx`;
	if (await exists(`${cacheDir}/BepInEx`)) {
		cacheDir = `${cacheDir}/BepInEx`;
	}

	const ls = (await readDir(cacheDir)).map((entry) => entry.path);
	for (const { type, useSubdir, fileType } of installStrategies) {
		if (fileType && ls.find((path) => path.endsWith(fileType))) {
			await copyDir(cacheDir, `${profileDir}/${type}/${owner}-${name}`);
		}
		const path = ls.find((path) => path.match(new RegExp(type, "i")));
		if (path) {
			let target = `${profileDir}/${type}`;
			if (useSubdir) {
				target = `${target}/${owner}-${name}`;
			}
			await copyDir(path, target);
		}
	}
}
