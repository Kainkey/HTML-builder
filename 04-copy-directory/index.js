const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function copyDirectoryRecursive(source, target) {
  // Создаем директорию если она не существует
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  // Читаем содержимое исходной директории
  fs.readdirSync(source).forEach(name => {
    const sourcePath = path.join(source, name);
    const targetPath = path.join(target, name);

    // Если элемент является директорией, рекурсивно копируем её содержимое
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else { // Если элемент является файлом, копируем его
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

copyDirectoryRecursive(sourceDir, targetDir);
console.log('Копирование завершено.');

