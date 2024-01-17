import { writeTextFile } from "@tauri-apps/api/fs";
import { writable } from "svelte/store";
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
	async save() {
		const json = JSON.stringify(profile, null, 2) + "\n";
		await writeTextFile(modsJsonPath, json);
	},
};
