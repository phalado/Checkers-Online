import Phaser from 'phaser';

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }

  init(data) {
    this.victor = data.victor;
  }

  create() {
    if (this.victor) {
      this.textWon = 'Game Over\n Player 1 wins!!!!';
    } else {
      this.textWon = 'Game Over\n Player 2 wins!!!!';
    }

    this.gameOverSceneScore = this.add.text(
      this.game.config.width * 0.3,
      this.game.config.height * 0.3,
      this.textWon, {
        color: '#d0c600',
        fontFamily: 'sans-serif',
        fontSize: '50px',
        lineHeight: 1.3,
        align: 'center',
      },
    );
  }
}

export default SceneGameOver;
