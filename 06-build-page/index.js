const fsPromises = require("fs").promises;
const path = require("path");

const TEMPLATE_FILE = path.join(__dirname,"template.html");
const INDEX_FILE = "index.html";
const STYLES_DIR = path.join(__dirname,"styles");
const STYLE_FILE = "style.css";
const ASSETS_DIR = path.join(__dirname,"assets");
const PROJECT_DIST_DIR = path.join(__dirname,"project-dist");

// Функция для замены шаблонных тегов в шаблонном файле
async function replaceTemplateTags(templateContent, components) {
  const templateTags = templateContent.match(/{{\w+}}/g) || [];
  let newContent = templateContent;
  for (const tag of templateTags) {
    const componentName = tag.slice(2, -2);
    if (components[componentName]) {
      newContent = newContent.replace(tag, components[componentName]);
    }
  }
  return newContent;
}

// Функция для сбора стилей из папки styles
async function collectStyles(stylesDir) {
  const files = await fsPromises.readdir(stylesDir);
  const cssFiles = files.filter((file) => path.extname(file) === ".css");
  const styleContents = await Promise.all(
    cssFiles.map((file) => fsPromises.readFile(path.join(stylesDir, file)))
  );
  return styleContents.join("\n");
}

// Функция для копирования папки assets
async function copyAssets(sourceDir, targetDir) {
  const files = await fsPromises.readdir(sourceDir);
  await fsPromises.mkdir(targetDir, { recursive: true });
  await Promise.all(
    files.map(async (file) => {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      const stat = await fsPromises.stat(sourcePath);
      if (stat.isFile()) {
        await fsPromises.copyFile(sourcePath, targetPath);
      } else if (stat.isDirectory()) {
        await copyAssets(sourcePath, targetPath);
      }
    })
  );
}

// Функция для сборки страницы
async function buildPage() {
  try {
    // Читаем исходный файл шаблона
    const templateContent = await fsPromises.readFile(TEMPLATE_FILE, "utf-8");

    // Собираем компоненты
    const components = {};
    const files = await fsPromises.readdir(".");
    const htmlFiles = files.filter((file) => path.extname(file) === ".html");
    for (const file of htmlFiles) {
      if (file !== TEMPLATE_FILE) {
        const componentName = path.basename(file, ".html");
        const componentContent = await fsPromises.readFile(file, "utf-8");
        components[componentName] = componentContent;
      }
    }

    // Заменяем теги в шаблоне на компоненты
    const indexContent = await replaceTemplateTags(templateContent, components);

    // Собираем стили из папки styles
    const styleContent = await collectStyles(STYLES_DIR);

    // Копируем папку assets
    await copyAssets(ASSETS_DIR, PROJECT_DIST_DIR);

    // Записываем результат в папку project-dist
    await fsPromises.mkdir(PROJECT_DIST_DIR, { recursive: true });
    await fsPromises.writeFile(path.join(PROJECT_DIST_DIR, INDEX_FILE), indexContent);
    await fsPromises.writeFile(path.join(PROJECT_DIST_DIR, STYLE_FILE), styleContent);
    console.log("Build completed successfully!");
    } catch (error) {
        console.error(Error(`Occurred during build: ${error}`));
    }
    }
    
    // Вызываем функцию сборки страницы
    buildPage();
