// eslint-disable-next-line import/no-unresolved
const express = require('express');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io').listen(server);

const players = {};
const games = {};

app.use(express.static(`${__dirname}/dist`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const port = process.env.PORT || 8082;

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(Object.size(players));
  const number = Object.size(players);
  players[number] = {
    playerId: socket.id,
    boardId: '',
  };

  socket.on('startGame', (bID) => {
    players[number].boardId = bID;
    games[bID] = {
      play1: players[number],
      play2: '',
    };
    console.log(games);
    socket.emit('startingGame', true, players);
  });

  socket.on('joinGame', (bID) => {
    players[number].boardId = bID;
    if (games[bID].play2 === '') {
      games[bID].play2 = players[number];
      setTimeout(() => {
        io.to(games[bID].play1.playerId).emit('startingGame', false, bID);
        io.to(games[bID].play2.playerId).emit('gameBegin', true, bID);
      }, 2000);
    }
  });

  socket.on('change', (value, piece, positionArray, bID) => {
    if (value) {
      io.to(games[bID].play2.playerId).emit('changeTurn', !value, piece, positionArray, false);
    } else {
      io.to(games[bID].play1.playerId).emit('changeTurn', !value, piece, positionArray, false);
    }
  });

  socket.on('gameOver', (value, piece, positionArray, bID) => {
    if (value) {
      io.to(games[bID].play2.playerId).emit('changeTurn', !value, piece, positionArray, true);
    } else {
      io.to(games[bID].play1.playerId).emit('changeTurn', !value, piece, positionArray, true);
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
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      size += 1;
    }
  }
  return size;
};
