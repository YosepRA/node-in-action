const fs = require('fs');

// Read the content of txt file.
const readable = fs.createReadStream('./text.txt');
readable.setEncoding('utf-8');
// Create a writable stream to other txt file.
const writable = fs.createWriteStream('./destination.txt');
// Pipe the read result to destination txt file.
readable.pipe(writable);
