import { readTextFile } from "@tauri-apps/api/fs";

export async function readJson<T>(path: string) {
	const text = await readTextFile(path);
	return JSON.parse(text) as T;
}
