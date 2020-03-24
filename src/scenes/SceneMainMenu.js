import Phaser from 'phaser';
// import express from 'express';
import makeId from '../gameHelpers';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
  }

  create() {
    // const api = express();

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

      // api.use((req, res, next) => {
      //   console.log(id);
      //   next();
      // });

      // api.listen(3000, () => {
      //   console.log('API runnign');
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
}

export default SceneMainMenu;
