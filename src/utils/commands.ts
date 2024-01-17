import { invoke } from "@tauri-apps/api/tauri";

export function copyDir(from: string, to: string): Promise<void> {
	return invoke("copy_dir", { from, to });
}

export function extractZip(zipPath: string, destPath: string): Promise<void> {
	return invoke("extract_zip", { zipPath, destPath });
}
