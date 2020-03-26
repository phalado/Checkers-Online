// eslint-disable-next-line import/no-unresolved
const express = require('express');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io').listen(server);

const players = {};

app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 8082;

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(Object.size(players));
  const number = Object.size(players);
  players[number] = {
    playerId: socket.id,
    color: Object.size(players) === 0,
    boardId: '',
  };

  let conections = 0;

  socket.on('startGame', (bID) => {
    conections = Object.size(players);
    players[number].boardId = bID;
    if (conections <= 1) {
      socket.emit('startingGame', true, players);
    } else {
      setTimeout(() => {
        io.to(players[0].playerId).emit('startingGame', false, players);
        io.to(players[1].playerId).emit('startingGame', false, players);
      }, 2000);
    }
  });

  socket.on('change', (value, piece, positionArray) => {
    console.log(value);
    if (value === 0) {
      io.to(players[1].playerId).emit('changeTurn', 1, piece, positionArray);
    } else {
      io.to(players[0].playerId).emit('changeTurn', 0, piece, positionArray);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Listening on ${server.address().port}`);
});

Object.size = (obj) => {
  let size = 0;
  for (const key in obj) {
    obj.hasOwnProperty(key) ? size += 1 : null;
  }
  return size;
};
