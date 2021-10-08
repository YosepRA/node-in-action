"use strict";

const net = require('net');

const server = net.createServer(socket => {
  socket.once('data', data => {
    socket.write(data);
  });
});
server.listen({
  port: 8888,
  host: '127.0.0.1'
}, () => {
  console.log('Server is listening on port 8888...');
});