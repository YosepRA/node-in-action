/* global $,io,Chat */

const socket = io.connect();

/* ========== Helpers ========== */

function divEscapedContentElement(message) {
  return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div></div>').html(`<i>${message}</i>`);
}

function processUserInput(chatApp, socket) {
  const message = $('#send-message').val();
  const room = $('#room').text();
  let systemMessage = '';

  if (message.charAt(0) === '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage(room, message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}

/* ========== Initialization ========== */

$(document).ready(function () {
  const chatApp = new Chat(socket);

  socket.on('nameResult', (result) => {
    let message = '';

    if (result.success) {
      message = `You are known as ${result.name}`;
    } else {
      message = result.message;
    }

    $('#messages').append(divEscapedContentElement(message));
  });

  socket.on('joinResult', (result) => {
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', (message) => {
    $('#messages').append(divEscapedContentElement(message.text));
  });

  socket.on('rooms', (rooms) => {
    $('#room-list').empty();

    for (let room in rooms) {
      room = room.substring(1, room.length);
      if (room !== '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function () {
      chatApp.processCommand(`/join ${$(this).text()}`);
      $('#send-message').focus();
    });
  });

  setInterval(() => {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();
  $('#send-form').submit(() => {
    processUserInput(chatApp, socket);
    return false;
  });
});
