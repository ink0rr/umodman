// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs;

use anyhow::Result;
use std::{
    fs::{remove_file, File},
    path::Path,
};
use zip_extract::extract;

#[tauri::command]
fn copy_dir(from: &Path, to: &Path) -> Result<(), String> {
    fs::copy_dir(from, to).map_err(|e| e.to_string())
}

#[tauri::command]
fn extract_zip(zip_path: &Path, dest_path: &Path) -> Result<(), String> {
    let inner = || -> Result<()> {
        let file = File::open(zip_path)?;
        extract(file, dest_path, true)?;
        remove_file(zip_path)?;
        Ok(())
    };
    inner().map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_upload::init())
        .invoke_handler(tauri::generate_handler![extract_zip, copy_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
