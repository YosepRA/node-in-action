const fs = require('fs');

let completedTasks = 0;
const tasks = [];
const wordCounts = {};
const textDir = './data/text-count';

function checkIfComplete() {
  completedTasks = completedTasks + 1;

  if (completedTasks === tasks.length) {
    Object.keys(wordCounts).forEach((word) => {
      console.log(`${word}: ${wordCounts[word]}`);
    });
  }
}

function countWordsInText(textBuffer) {
  const words = textBuffer.toString().toLowerCase().split(/\W+/).sort();

  words.forEach((word) => {
    if (word) {
      wordCounts[word] = wordCounts[word] ? wordCounts[word] + 1 : 1;
    }
  });
}

fs.readdir(textDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const task = (function (filename) {
      return function () {
        fs.readFile(filename, (err, textBuffer) => {
          if (err) throw err;

          countWordsInText(textBuffer);
          checkIfComplete();
        });
      };
    })(`${textDir}/${file}`);

    tasks.push(task);
  });

  tasks.forEach((task) => task());
});
