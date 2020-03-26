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
  }
}

export default SceneMainMenu;
