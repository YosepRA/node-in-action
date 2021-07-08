const socketio = require('socket.io');

/* ========== State/Model ========== */

let io;
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};

/* ========== Helpers ========== */

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  const name = `Guest${guestNumber}`;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name,
  });
  namesUsed.push(name);
  return guestNumber + 1;
}

function joinRoom(socket, room) {
  // Join the room.
  socket.join(room);
  // Associate id to room.
  currentRoom[socket.id] = room;
  socket.emit('joinResult', { room });
  // Broadcast the new user to other users in the room.
  socket.broadcast.to(room).emit('message', {
    text: `${nickNames[socket.id]} has joined ${room}`,
  });

  const usersInRoom = io.sockets.clients(room);
  // If there is more than one user.
  if (usersInRoom.length > 1) {
    // Build up the room members notification message.
    let usersInRoomSummary = `Users currently in ${room}:`;
    for (const index in usersInRoom) {
      if (Object.hasOwnProperty.call(usersInRoom, index)) {
        const userSocketId = usersInRoom[index].id;
        /* As long as it's not the currently associated user, then append the message with
        / other user's nicknames. */
        if (userSocketId !== socket.id) {
          if (index > 0) {
            usersInRoomSummary += ', ';
          }
          usersInRoomSummary += nickNames[userSocketId];
        }
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', { text: usersInRoomSummary });
  }
}

function handleMessageBroadcasting(socket, nickNames) {
  socket.on('message', ({ room, text }) => {
    socket.broadcast.to(room).emit('message', {
      text: `${nickNames[socket.id]}: ${text}`,
    });
  });
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
  socket.on('nameAttempt', (name) => {
    // New names cannot start with "Guest".
    if (name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest"',
      });
    } else {
      // If new name isn't already used by other user, then proceed to create.
      if (namesUsed.indexOf(name) === -1) {
        const previousName = nickNames[socket.id];
        const previousNameIndex = namesUsed.indexOf(previousName);
        // Delete previous name from state.
        delete namesUsed[previousNameIndex];
        // Add new name to state.
        nickNames[socket.id] = name;
        namesUsed.push(name);
        // Notify the results.
        socket.emit('nameResult', {
          success: true,
          name,
        });
        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: `${previousName} is now known as ${name}.`,
        });
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use',
        });
      }
    }
  });
}

function handleRoomJoining(socket) {
  socket.on('join', (room) => {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
  socket.on('disconnect', () => {
    const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
}

/* ========== Export ========== */

module.exports = {
  listen(server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', (socket) => {
      guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
      joinRoom(socket, 'Lobby');

      handleMessageBroadcasting(socket, nickNames);
      handleNameChangeAttempts(socket, nickNames, namesUsed);
      handleRoomJoining(socket);

      socket.on('rooms', () => {
        socket.emit('rooms', io.sockets.manager.rooms);
      });

      handleClientDisconnection(socket, nickNames, namesUsed);
    });
  },
};
