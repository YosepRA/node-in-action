"use strict";

const fs = require('fs');

const path = require('path');

const args = process.argv.slice(2);
const command = args.shift();
const taskDescription = args.join(' ');
const file = path.join(process.cwd(), '/data/.tasks');
/* ========== Helpers ========== */

function loadOrInitializeTaskArray(file, cb) {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      cb([]);
      throw err;
    }

    const tasks = JSON.parse(data || '[]');
    cb(tasks);
  });
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, tasks => {
    tasks.forEach(task => console.log(task));
  });
}

function storeTasks(file, tasks) {
  const data = JSON.stringify(tasks);
  fs.writeFile(file, data, err => {
    if (err) throw err;
    console.log('Saved!');
  });
}

function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, tasks => {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}
/* ========== Implementation ========== */


switch (command) {
  case 'list':
    listTasks(file);
    break;

  case 'add':
    addTask(file, taskDescription);
    break;

  default:
    console.log(`Usage: node ${process.argv[1]} list|add [taskDescription]`);
    break;
}