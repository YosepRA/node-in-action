const fs = require('fs');
const assert = require('assert').strict;

const stream = fs.createReadStream('./text.txt');
// By default, chunk of stream is a Buffer object. Use "setEncoding" according to different ~
// ~ encoding needs.
stream.setEncoding('utf-8');
stream.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log(chunk);
});

stream.on('end', () => {
  console.log('Stream finished.');
});
