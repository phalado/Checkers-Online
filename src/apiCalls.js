async function waitSecondPlayer(socket) {
  // function responseHandler(message) {
  //   // resolve promise with the value we got
  //   resolve(message);
  //   clearTimeout(timer);
  // }

  socket.on('startingGame', (message) => {
    let color = false;
    console.log(message);
    while (message) {
      console.log('Waiting for the other player!');
      color = true;
    }

    if (!message) {
      console.log(color);
      return color;
    } else {
      waitSecondPlayer(socket);
    }
  });
}

export default waitSecondPlayer;