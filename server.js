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

  // let conections = 0;

  socket.on('startGame', (bID) => {
    // conections = Object.size(players);
    players[number].boardId = bID;
    games[bID] = {
      play1: players[number],
      play2: '',
    };
    console.log(games);
    // if (conections <= 1) {
    socket.emit('startingGame', true, players);
    // } else {
    //   setTimeout(() => {
    //     io.to(players[0].playerId).emit('startingGame', false, players);
    //     io.to(players[1].playerId).emit('startingGame', false, players);
    //   }, 2000);
    // }
  });

  socket.on('joinGame', (bID) => {
    players[number].boardId = bID;
    if (games[bID].play2 === '') {
      games[bID].play2 = players[number];
      setTimeout(() => {
        io.to(games[bID].play1.playerId).emit('startingGame', false, bID);
        io.to(games[bID].play2.playerId).emit('gameBegin', true, bID);
      }, 2000);
    // games.forEach((game) => {
    //   console.log(game[0].boardId);
    //   if (game[0].boardId === bID) {
    //     console.log(game[0]);
    //     console.log(game[0].length);
    //     // if (game[0].length < 2) {
    //       game.push(players[number]);
    //       console.log(games);
          
        // }
      // }
    }
  });

  socket.on('change', (value, piece, positionArray, bID) => {
    if (value) {
      io.to(games[bID].play2.playerId).emit('changeTurn', !value, piece, positionArray);
    } else {
      io.to(games[bID].play1.playerId).emit('changeTurn', !value, piece, positionArray);
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
