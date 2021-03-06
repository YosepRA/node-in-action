const Readable = require('stream').Readable;

const rs = new Readable();
let c = 97 - 1;

rs._read = function () {
  if (c >= 'z'.charCodeAt(0)) return rs.push(null);

  setTimeout(() => {
    rs.push(String.fromCharCode(++c));
  }, 100);
  return undefined;
};

rs.pipe(process.stdout);

process.on('exit', () => {
  console.log(`\n_read called ${c - 97} times.`);
});

process.stdout.on('error', process.exit);
