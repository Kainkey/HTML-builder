const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

function askQuestion() {
  rl.question('Введите текст для записи в файл: ', (answer) => {
    if (answer.toLowerCase() === 'exit') {
      console.log('Прощай!');
      writeStream.end();
      return rl.close();
    }
    writeStream.write(answer + '\n');
    askQuestion();
  });
}

console.log('Введите текст для записи в файл (напишите "exit" для выхода):');
askQuestion();

writeStream.on('finish', () => {
  console.log('Запись в файл завершена.');
});

writeStream.on('error', (error) => {
  console.log(error);
});

process.on('SIGINT', () => {
  console.log('Прощай!');
  writeStream.end();
  rl.close();
  process.exit();
});
