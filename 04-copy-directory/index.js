const fs = require('fs').promises;
const path = require('path');

async function copyDirectory(sourceDir, targetDir) {
  try {
    await fs.access(targetDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(targetDir);
    } else {
      throw error;
    }
  }

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    const stats = await fs.stat(sourcePath);

    if (stats.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

copyDirectory(sourceDir, targetDir)
  .then(() => console.log('Directory copied successfully'))
  .catch((error) => console.error(error));
