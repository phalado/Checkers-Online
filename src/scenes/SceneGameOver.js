import Phaser from 'phaser';

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }

  create() {
    this.gameOverSceneScore = this.add.text(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'Someone won!!!!', {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '30px',
        lineHeight: 1.3,
        align: 'center',
      },
    );
  }
}

export default SceneGameOver;
