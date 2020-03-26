import Phaser from 'phaser';
import makeId from '../gameHelpers';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  create() {
    // eslint-disable-next-line no-undef
    this.socket = io();
    this.color = false;

    this.socket.on('newplayer', (sckt) => {
      console.log(sckt);
    });

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

      this.socket.emit('startGame', id);

      this.socket.on('startingGame', (message, players) => {
        this.color = false;
        if (message) {
          this.startGame.text = 'Waiting for the other player!';
          this.color = true;
        } else {
          this.scene.start('SceneGame', { socket: this.socket, color: this.color, players });
        }
      });
    });

    // this.enterPlay1 = this.add.text(
    //   this.game.config.width * 0.2,
    //   this.game.config.height * 0.3,
    //   'Enter as player 1', {
    //     color: '#d0c600',
    //     fontFamily: 'sans-serif',
    //     fontSize: '30px',
    //     lineHeight: 1.3,
    //     align: 'center',
    //   },
    // );

    // this.enterPlay1.setInteractive();
    // this.enterGame.on('pointerup', () => {
    //   this.scene.start('SceneGame', { socket: this.socket, color: true });
    // });

    // this.enterPlay2 = this.add.text(
    //   this.game.config.width * 0.2,
    //   this.game.config.height * 0.4,
    //   'Enter as player 2', {
    //     color: '#d0c600',
    //     fontFamily: 'sans-serif',
    //     fontSize: '30px',
    //     lineHeight: 1.3,
    //     align: 'center',
    //   },
    // );

    // this.enterPlay2.setInteractive();
    // this.enterPlay2.on('pointerup', () => {
    //   this.scene.start('SceneGame', { socket: this.socket, color: false });
    // });
  }

  // update() {
  //   this.time.addEvent({
  //     delay: 1000,
  //     callback() {
  //       this.socket.on('startingGame', (message) => {
  //         if (message) {
  //           console.log('Waiting for the other player!');
  //           this.color = message;
  //           console.log(this.color);
  //         } else {
  //           console.log('Starting game!');
  //           this.scene.start('SceneGame', { socket: this.socket, color: this.color });
  //         }
  //       });
  //     },
  //     callbackScope: this,
  //     loop: false,
  //   });
  // }
}

export default SceneMainMenu;
