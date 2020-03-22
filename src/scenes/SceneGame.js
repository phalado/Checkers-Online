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

    this.load.spritesheet('sprExplosion', 'content/sprExplosion.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.audio('sndExplode0', 'content/sndExplode0.wav');
    this.load.audio('sndExplode1', 'content/sndExplode1.wav');
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

    this.redPieces = this.add.group();
    this.blackPieces = this.add.group();


    this.physics.add.collider(this.redPieces, this.blackPieces, (red, black) => {
      this.board[black.getData('boardY')][black.getData('boardX')] = 0;
      black.destroy();
    });

    this.boardXValues = [0.214, 0.295, 0.378, 0.46, 0.54, 0.623, 0.707, 0.788];
    this.boardYValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];

    this.board = this.createBoard(this.boardXValues, this.boardYValues);

    this.bPiece = new BlackPiece(
      this,
      this.game.config.width * this.boardXValues[3],
      this.game.config.height * this.boardYValues[4],
      'blackPiece',
    ).setScale(0.5);
    this.bPiece.updatePosition(3, 4);
    this.board[4][3] = this.bPiece;
    this.blackPieces.add(this.bPiece);

    this.ghostPieces = [];
    console.log(this.board);
    this.setInteractiveness(this.boardXValues, this.boardYValues);
  }

  deleteInteractiveness() {
    this.board.forEach((array) => {
      array.forEach((value) => {
        if (value !== 0) {
          if (value.data.list.type === 'RedPiece') {
            value.disableInteractive();
          }
        }
      });
    });
  }

  move(piece, newPosition) {
    const x = piece.getData('boardX');
    const y = piece.getData('boardY');
    piece.updatePosition(...newPosition);
    this.scene.scene.board[newPosition[0]][newPosition[1]] = piece;
    this.scene.scene.board[x][y] = 0;
    this.deleteGhosts();
    console.log(this.boardXValues);
    console.log(this.boardXValues[newPosition[1]]);
    this.movement = this.tweens.add({
      targets: piece,
      x: this.game.config.width * this.boardXValues[newPosition[1]],
      y: this.game.config.height * this.boardYValues[newPosition[0]],
      ease: 'Power1',
      duration: 1000,
      repeat: 0,
    });
    // piece.update();
    this.deleteInteractiveness();
    this.setInteractiveness(this.boardXValues, this.boardYValues);
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
    if (color) {
      this.scene.scene.redPieces.add(this.piece);
    } else {
      this.scene.scene.blackPieces.add(this.piece);
    }
    return this.piece;
  }

  deleteGhosts() {
    this.scene.scene.ghostPieces.forEach((value) => {
      value.destroy();
    });
    this.scene.scene.ghostPieces = [];
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
              const possMoves = value.movePossibility();
              this.deleteGhosts();
              for (let i = 0; i < possMoves.length; i += 1) {
                const ghost = this.add.image(
                  this.game.config.width * boardX[possMoves[i][1]],
                  this.game.config.height * boardY[possMoves[i][0]],
                  'redPiece',
                ).setScale(0.5).setAlpha(0.5);
                ghost.setInteractive();
                ghost.on('pointerup', () => {
                  this.move(value, possMoves[i]);
                });
                this.scene.scene.ghostPieces.push(ghost);
              }
            });
          }
        }
      });
    });
  }
}

export default SceneGame;
