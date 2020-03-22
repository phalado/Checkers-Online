import Phaser from 'phaser';
import RedPiece from '../entities/redEntity';
import BlackPiece from '../entities/blackEntity';

class SceneGame extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGame' });
  }

  preload() {
    this.load.image('board', 'content/board.png');
    this.load.image('redPiece', 'content/redPiece.png');
    this.load.image('redChecker', 'content/redChecker.png');
    this.load.image('blackPiece', 'content/blackPiece.png');
    this.load.image('blackChecker', 'content/blackChecker.png');
  }

  create() {
    // this.anims.create({
    //   key: 'redPiece',
    //   frames: this.anims.generateFrameNumbers('redPiece'),
    //   frameRate: 20,
    //   repeat: -1,
    // });

    // this.anims.create({
    //   key: 'blackPiece',
    //   frames: this.anims.generateFrameNumbers('blackPiece').setScale(0.5),
    //   frameRate: 20,
    //   repeat: 0,
    // });

    this.boardImg = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'board',
    );

    this.boardXValues = [0.214, 0.295, 0.378, 0.46, 0.54, 0.623, 0.707, 0.788];
    this.boardYValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];

    this.board = this.createBoard(this.boardXValues, this.boardYValues);
    console.log(this.board);
    this.setInteractiveness(this.boardXValues, this.boardYValues);
  }

  update() {
  }

  createBoard(boardX, boardY) {
    this.board = [];
    for (let i = 0; i < 8; i += 1) {
      this.board.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 0) {
        this.board[7][i] = this.createPiece(i, 7, boardX, boardY, true);
        this.board[5][i] = this.createPiece(i, 5, boardX, boardY, true);
        this.board[1][i] = this.createPiece(i, 1, boardX, boardY, false);
      } else {
        this.board[6][i] = this.createPiece(i, 6, boardX, boardY, true);
        this.board[2][i] = this.createPiece(i, 2, boardX, boardY, false);
        this.board[0][i] = this.createPiece(i, 0, boardX, boardY, false);
      }
    }

    return this.board;
  }

  createPiece(x, y, boardX, boardY, color) {
    if (color) {
      this.piece = new RedPiece(
        this,
        this.game.config.width * boardX[x],
        this.game.config.height * boardY[y],
        'redPiece',
      );
    } else {
      this.piece = new BlackPiece(
        this,
        this.game.config.width * boardX[x],
        this.game.config.height * boardY[y],
        'blackPiece',
      );
    }
    this.piece.setScale(0.5);
    this.piece.updatePosition(y, x);
    return this.piece;
  }

  setInteractiveness(boardX, boardY) {
    this.board.forEach((array) => {
      array.forEach((value) => {
        if (value !== 0) {
          if (value.data.list.type === 'RedPiece'
          && value.movePossibility().length !== 0) {
            value.setInteractive();
            value.on('pointerover', () => {
              value.setScale(0.55);
            });
            value.on('pointerout', () => {
              value.setScale(0.5);
            });
            value.on('pointerup', () => {
              const newArray = value.movePossibility();
              console.log(newArray);
            });
          }
        }
      });
    });
  }
}

export default SceneGame;
