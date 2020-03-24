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

const port = process.env.PORT || 8081;

io.on('connection', (socket) => {
  console.log('a user connected');
  players[socket.id] = {
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'black',
  };
  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);
  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Listening on ${server.address().port}`);
});