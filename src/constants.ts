import { appLocalDataDir } from "@tauri-apps/api/path";

export const APP_DATA_DIR = await appLocalDataDir();
