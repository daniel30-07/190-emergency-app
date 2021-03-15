const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;

let policeSocket = null;
let userSocket = null;

io.on('connection', (socket) => {
  console.log('L', 'a user connected =D');

  socket.on('policeRequest', (routeResponse) => {
    console.log("Someone is looking for a police!",)
    userSocket = socket;
    if (policeSocket != null) {
      policeSocket.emit('policeRequest', routeResponse)
    }
  });

  socket.on('lookingForUsers', () => {
    console.log("Looking for users!",)
    policeSocket = socket;
  })

  socket.on('policeLocation', (policeLocation) => {
    userSocket.emit('policeLocation', policeLocation)
  });
});

server.listen(port, () => console.log('L', 'server running...'));
