const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(`Error reading directory: ${err}`);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting file stats: ${err}`);
        return;
      }

      if (stats.isFile()) {
        const fileSizeInBytes = stats.size;
        const fileSizeInKb = fileSizeInBytes / 1024.0;
        const fileExtension = path.extname(file).slice(1);
        const fileName = path.basename(file, `.${fileExtension}`);
        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKb.toFixed(3)}kb`);
      }
    });
  });
});
