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
      const id = makeId(4);
      this.startGame.text = id;
      this.startGame.disableInteractive();

      this.socket.emit('startGame', id);

      this.socket.on('startingGame', (message, boardID) => {
        this.color = true;
        if (message) {
          this.startGame.text = `Waiting for the other player!\n Your id is ${id}`;
        } else {
          this.scene.start('SceneGame', { socket: this.socket, color: this.color, boardID });
        }
      });
    });

    this.joinGame = this.add.text(
      this.game.config.width * 0.2,
      this.game.config.height * 0.4,
      'Join a game', {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );

    this.joinGame.setInteractive();
    this.joinGame.on('pointerup', () => {
      this.gameID = '';

      const div = document.createElement('div');
      div.innerHTML = `
        <input type="text" id="gameID" placeholder="Enter the game's ID" style="font-size: 1.2rem; width: 200px"><br>
        <input type="button" name="submitButton" value="Enter game" style="font-size: 1.5rem">
      `;

      const element = this.add.dom(800, 280, div);
      element.addListener('click');

      element.on('click', (event) => {
        if (event.target.name === 'submitButton') {
          const inputText = document.getElementById('gameID');
          if (inputText.value !== '') {
            element.removeListener('click');
            element.setVisible(false);
            this.gameID = inputText.value;

            this.socket.emit('joinGame', this.gameID);

            this.socket.on('gameBegin', (message, boardID) => {
              this.color = false;
              if (message) {
                this.scene.start('SceneGame', { socket: this.socket, color: this.color, boardID });
              }
            });
          }
        }
      });
    });
  }
}

export default SceneMainMenu;
