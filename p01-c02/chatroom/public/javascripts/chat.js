function Chat(socket) {
  this.socket = socket;
}

Chat.prototype.sendMessage = function (room, text) {
  const message = {
    room,
    text,
  };

  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function (room) {
  this.socket.emit('join', { newRoom: room });
};

Chat.prototype.processCommand = function (commandString) {
  const words = commandString.split(' ');
  const command = words[0].substring(1, words[0].length).toLowerCase();
  let message = false;

  switch (command) {
    case 'join':
      words.shift();
      this.changeRoom(words[0]);
      break;

    case 'nick':
      words.shift();
      this.socket.emit('nameAttempt', words[0]);
      break;

    default:
      message = 'Unrecognized command.';
      break;
  }

  return message;
};
