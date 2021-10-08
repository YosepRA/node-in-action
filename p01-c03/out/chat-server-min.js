"use strict";

const events = require('events');

const net = require('net');

const channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.on('join', function (id, client) {
  const welcomeMessage = `Welcome! Guest online: ${this.listeners('broadcast').length}.`;
  client.write(`${welcomeMessage}\n`);
  this.clients[id] = client;

  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  };

  this.on('broadcast', this.subscriptions[id]);
});
channel.on('leave', function (id) {
  this.removeListener('broadcast', this.subscriptions[id]);
  this.emit('broadcast', id, `${id} has left the channel.`);
});
channel.on('shutdown', function () {
  this.emit('broadcast', '', 'Chat has shut down.\n');
  this.removeAllListeners('broadcast');
});
channel.on('error', err => {
  console.error('ERROR:', err.message);
});
const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`; // Socket 'connect' event does not fire here. I don't know why...
  // client.on('connect', () => {
  //   console.log('socket connect');
  // });

  channel.emit('join', id, client);
  client.on('close', () => {
    channel.emit('leave', id);
  });
  client.on('data', data => {
    const message = data.toString();

    if (message === 'shutdown\r\n') {
      channel.emit('shutdown');
    }

    channel.emit('broadcast', id, message);
  });
});
server.listen({
  port: 8888,
  host: 'localhost'
}, () => console.log('Server is listening on port 8888'));