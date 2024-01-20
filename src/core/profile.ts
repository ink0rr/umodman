import { readDir, removeDir, writeTextFile } from "@tauri-apps/api/fs";
import { get, writable } from "svelte/store";
import { APP_DATA_DIR } from "~/constants";
import { readJson } from "~/utils/json";

// TODO: Handle multiple games and profiles
const modsJsonPath = `${APP_DATA_DIR}/lethal-company/profiles/Default/mods.json`;
const json = await readJson(modsJsonPath).catch(() => ({}));
const { subscribe, update } = writable(json as Record<string, string>);

export const profile = {
	subscribe,
	set(key: string, value: string) {
		update((profile) => {
			profile[key] = value;
			return profile;
		});
	},
	async uninstall(key: string) {
		const path = `${APP_DATA_DIR}/lethal-company/profiles/Default/BepInEx`;
		const promises = [];
		for (const { children } of await readDir(path, { recursive: true })) {
			for (const { path } of children ?? []) {
				if (path.includes(key)) {
					promises.push(removeDir(path, { recursive: true }));
				}
			}
		}
		await Promise.all(promises);
		update((profile) => {
			delete profile[key];
			return profile;
		});
		await this.save();
	},
	async save() {
		const json = JSON.stringify(get(profile), null, 2) + "\n";
		await writeTextFile(modsJsonPath, json);
	},
};
