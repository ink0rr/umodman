use anyhow::{Context, Result};
use rayon::prelude::*;
use std::{fs, path::Path};

fn copy_dir_impl(from: &Path, to: &Path) -> Result<()> {
    fs::create_dir_all(to)?;
    fs::read_dir(from)?
        .par_bridge()
        .map(|entry| -> Result<()> {
            let entry = entry?;
            let path = entry.path();
            let to = to.join(entry.file_name());
            if path.is_dir() {
                copy_dir_impl(&path, &to)?;
            } else {
                fs::copy(path, to)?;
            }
            Ok(())
        })
        .collect()
}

pub fn copy_dir(from: impl AsRef<Path>, to: impl AsRef<Path>) -> Result<()> {
    let from = from.as_ref();
    let to = to.as_ref();
    copy_dir_impl(from, to).context(format!(
        "Failed to copy directory\n\
          From: {}\n\
          To: {}",
        from.display(),
        to.display(),
    ))
}
