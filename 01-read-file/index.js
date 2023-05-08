const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');


const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});

readStream.on('error', (error) => {
  console.log(error);
});

readStream.on('end', () => {
    console.log('File reading is complete.');
  });