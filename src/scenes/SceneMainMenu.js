import Phaser from 'phaser';
// import express from 'express';
import makeId from '../gameHelpers';
import waitSecondPlayer from '../apiCalls';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  create() {
    // const api = express();
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.color = false;

    this.startGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.2,
      'Start a new game', {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );

    this.startGame.setInteractive();
    this.startGame.on('pointerup', () => {
      const id = makeId(6);
      this.startGame.text = id;
      this.startGame.disableInteractive();

      this.socket.emit('startGame', 1);

      // this.socket.on('startingGame', (message) => {
      //   this.color = false;
      //   console.log(message);
      //   while (message) {
      //     console.log('Waiting for the other player!');
      //     this.color = true;
      //   }
      //   console.log(message);
      //   console.log(this.color);
      //   console.log('Starting game!');
      //   this.scene.start('SceneGame', { socket: this.socket, color: this.color });
      // });
    });

    this.enterGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.3,
      'Enter a game', {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );

    this.enterGame.setInteractive();
    this.enterGame.on('pointerup', () => {
      this.scene.start('SceneGame');
    });
  }

  update() {
    this.time.addEvent({
      delay: 1000,
      callback() {
        this.socket.on('startingGame', (message) => {
          if (message) {
            console.log('Waiting for the other player!');
            this.color = message;
            console.log(this.color);
          } else {
            console.log('Starting game!');
            this.scene.start('SceneGame', { socket: this.socket, color: this.color });
          }
        });
      },
      callbackScope: this,
      loop: false,
    });
  }
}

export default SceneMainMenu;
