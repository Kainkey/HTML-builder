const fs = require('fs').promises;
const path = require('path');

const STYLES_DIR = path.join(__dirname, 'styles');
const OUTPUT_FILE = 'bundle.css';
const DIST_DIR = path.join(__dirname, 'project-dist');

async function mergeStyles() {
  try {
    // Читаем содержимое директории со стилями
    const stylesDir = await fs.readdir(STYLES_DIR);

    // Фильтруем только файлы с расширением .css
    const cssFiles = stylesDir.filter((filename) =>
      path.extname(filename).toLowerCase() === '.css'
    );

    // Объединяем содержимое всех css-файлов в одну строку
    const contents = await Promise.all(
      cssFiles.map((filename) => fs.readFile(path.join(STYLES_DIR, filename), 'utf-8'))
    );
    const bundleContent = contents.join('');

    // Создаем папку dist, если её нет
    await fs.mkdir(DIST_DIR, { recursive: true });

    // Записываем содержимое в файл bundle.css
    await fs.writeFile(path.join(DIST_DIR, OUTPUT_FILE), bundleContent, 'utf-8');

    console.log(`Styles have been successfully merged into ${OUTPUT_FILE}`);
  } catch (err) {
    console.error(err);
  }
}

mergeStyles();
