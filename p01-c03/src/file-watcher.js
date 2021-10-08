const events = require('events');
const fs = require('fs');
const util = require('util');

const watchDir = './data/file-watcher-watch';
const processedDir = './data/file-watcher-processed';

function Watcher(watchDir, processedDir) {
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}

util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function () {
  const watcher = this;

  fs.readdir(this.watchDir, (err, files) => {
    if (err) throw err;

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      watcher.emit('process', file);
    }
  });
};

Watcher.prototype.start = function () {
  const watcher = this;
  fs.watchFile(this.watchDir, () => {
    watcher.watch();
  });
};

const watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function (file) {
  const watchFile = `${this.watchDir}/${file}`;
  const processFile = `${this.processedDir}/${file.toLowerCase()}`;

  fs.rename(watchFile, processFile, (err) => {
    if (err) throw err;
  });
});

watcher.start();
