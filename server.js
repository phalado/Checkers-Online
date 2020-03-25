// eslint-disable-next-line import/no-unresolved
const express = require('express');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io').listen(server);

const players = {};

app.use(express.static(__dirname + '/dist'));

app.get('/app', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 8082;

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(Object.size(players));
  players[socket.id] = {
    playerId: socket.id,
    color: Object.size(players) === 0,
  };

  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });

  let conections = 0;

  socket.on('startGame', () => {
    console.log(players);
    conections = Object.size(players);
    console.log(conections);
    if (conections === 1) {
      socket.broadcast.emit('startingGame', true);
    } else {
      socket.broadcast.emit('startingGame', false);
    }
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
