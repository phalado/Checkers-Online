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
    this.boardImg = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'board',
    );

    this.redPieces = this.add.group();
    this.blackPieces = this.add.group();


    this.physics.add.collider(this.redPieces, this.blackPieces, (red, black) => {
      this.board[black.getData('boardY')][black.getData('boardX')] = 0;
      console.log(black.getData('boardY'));
      console.log(black.getData('boardX'));
      black.destroy();
      console.log(this.board);
    });

    this.color = true;
    this.boardXValues = [0.214, 0.295, 0.378, 0.46, 0.54, 0.623, 0.707, 0.788];
    this.boardYValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];

    this.board = this.createBoard(this.boardXValues, this.boardYValues);

    //Delete this in the future
    this.bPiece = new BlackPiece(
      this,
      this.game.config.width * this.boardXValues[3],
      this.game.config.height * this.boardYValues[4],
      'blackPiece',
    ).setScale(0.5);
    this.bPiece.updatePosition(3, 4);
    this.board[4][3] = this.bPiece;
    this.blackPieces.add(this.bPiece);

    console.log(this.board[1][4]);
    this.bPiece2 = this.board[1][4];
    this.board[1][4] = 0;
    this.bPiece2.destroy();

    this.bPiece3 = this.board[1][0];
    this.board[1][0] = 0;
    this.bPiece3.destroy();

    this.bPiece4 = new BlackPiece(
      this,
      this.game.config.width * this.boardXValues[6],
      this.game.config.height * this.boardYValues[3],
      'blackPiece',
    ).setScale(0.5);
    this.bPiece4.updatePosition(6, 3);
    this.board[3][6] = this.bPiece4;
    this.blackPieces.add(this.bPiece4);

    this.rPiece = this.board[5][6];
    this.board[5][6] = 0;
    this.rPiece.destroy();

    this.bPiece5 = new BlackPiece(
      this,
      this.game.config.width * this.boardXValues[6],
      this.game.config.height * this.boardYValues[5],
      'blackPiece',
    ).setScale(0.5);
    this.bPiece4.updatePosition(6, 5);
    this.board[5][6] = this.bPiece5;
    this.blackPieces.add(this.bPiece5);

    this.bPiece6 = this.board[2][7];
    this.board[2][7] = 0;
    this.bPiece6.destroy();

    this.bPiece7 = this.board[0][5];
    this.board[0][5] = 0;
    this.bPiece7.destroy();
    //Delete until here

    this.ghostPieces = [];
    console.log(this.board);
    this.setInteractiveness(this.boardXValues, this.boardYValues);
  }

  deleteInteractiveness() {
    this.redPieces.getChildren().forEach((piece) => {
      piece.disableInteractive();
    });
  }

  jump(piece, newPosition) {
    const x = piece.getData('boardX');
    const y = piece.getData('boardY');
    piece.updatePosition(...newPosition);
    this.scene.scene.board[newPosition[0]][newPosition[1]] = piece;
    this.scene.scene.board[x][y] = 0;
    this.deleteGhosts();
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

  doubleJump(piece, intPosition, lastPosition) {
    const x = piece.getData('boardX');
    const y = piece.getData('boardY');
    this.scene.scene.board[x][y] = 0;
    this.deleteGhosts();
    console.log(piece);
    console.log(intPosition);
    console.log(lastPosition);

    this.tweens.add({
      targets: piece,
      x: this.game.config.width * this.boardXValues[intPosition[1]],
      y: this.game.config.height * this.boardYValues[intPosition[0]],
      ease: 'Power1',
      duration: 1000,
      repeat: 0,
      onComplete: () => {
        this.tweens.add({
          targets: piece,
          x: this.game.config.width * this.boardXValues[lastPosition[1]],
          y: this.game.config.height * this.boardYValues[lastPosition[0]],
          ease: 'Power1',
          duration: 1000,
          repeat: 0,
        });
      },
    });

    this.scene.scene.board[lastPosition[0]][lastPosition[1]] = piece;
    piece.updatePosition(...lastPosition);
    this.deleteInteractiveness();
    this.setInteractiveness(this.boardXValues, this.boardYValues);
  }

  tripleJump(piece, intPosition, sparePosition, lastPosition) {
    const x = piece.getData('boardX');
    const y = piece.getData('boardY');
    this.scene.scene.board[x][y] = 0;
    this.deleteGhosts();

    this.tweens.add({
      targets: piece,
      x: this.game.config.width * this.boardXValues[intPosition[1]],
      y: this.game.config.height * this.boardYValues[intPosition[0]],
      ease: 'Power1',
      duration: 1000,
      repeat: 0,
      onComplete: () => {
        this.tweens.add({
          targets: piece,
          x: this.game.config.width * this.boardXValues[sparePosition[1]],
          y: this.game.config.height * this.boardYValues[sparePosition[0]],
          ease: 'Power1',
          duration: 1000,
          repeat: 0,
          onComplete: () => {
            this.tweens.add({
              targets: piece,
              x: this.game.config.width * this.boardXValues[lastPosition[1]],
              y: this.game.config.height * this.boardYValues[lastPosition[0]],
              ease: 'Power1',
              duration: 1000,
              repeat: 0,
            });
          },
        });
      },
    });

    this.scene.scene.board[lastPosition[0]][lastPosition[1]] = piece;
    piece.updatePosition(...lastPosition);
    this.deleteInteractiveness();
    this.setInteractiveness(this.boardXValues, this.boardYValues);
  }

  createBoard() {
    this.board = [];
    for (let i = 0; i < 8; i += 1) {
      this.board.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 0) {
        this.board[5][i] = this.createPiece(i, 5, this.color);
        this.board[1][i] = this.createPiece(i, 1, !this.color);
        this.board[7][i] = this.createPiece(i, 7, this.color);
      } else {
        this.board[6][i] = this.createPiece(i, 6, this.color);
        this.board[2][i] = this.createPiece(i, 2, !this.color);
        this.board[0][i] = this.createPiece(i, 0, !this.color);
      }
    }

    return this.board;
  }

  createPiece(x, y, color) {
    if (color) {
      this.piece = new RedPiece(
        this,
        this.game.config.width * this.boardXValues[x],
        this.game.config.height * this.boardYValues[y],
        'redPiece',
      );
    } else {
      this.piece = new BlackPiece(
        this,
        this.game.config.width * this.boardXValues[x],
        this.game.config.height * this.boardYValues[y],
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
    this.redPieces.getChildren().forEach((piece) => {
      if (piece.movePossibility().length !== 0) {
        piece.setInteractive();

        piece.on('pointerover', () => {
          piece.setScale(0.55);
        });

        piece.on('pointerout', () => {
          piece.setScale(0.5);
        });

        piece.on('pointerup', () => {
          const possMoves = piece.movePossibility();
          this.deleteGhosts();
          for (let i = 0; i < possMoves.length; i += 1) {
            if (typeof possMoves[i][0] === 'object') {
              for (let j = 0; j < possMoves[i].length; j += 1) {
                const ghost = this.add.image(
                  this.game.config.width * boardX[possMoves[i][j][possMoves[i][j].length - 1][1]],
                  this.game.config.height * boardY[possMoves[i][j][possMoves[i][j].length - 1][0]],
                  'redPiece',
                ).setScale(0.5).setAlpha(0.5);

                ghost.setInteractive();
                ghost.on('pointerup', () => {
                  console.log('Here');
                  console.log(possMoves[i][j]);
                  if (possMoves[i][j].length === 2) {
                    this.doubleJump(piece, possMoves[i][j][0], possMoves[i][j][1]);
                  } else {
                    this.tripleJump(piece,
                      possMoves[i][j][0],
                      possMoves[i][j][1],
                      possMoves[i][j][2]);
                  }
                });
                this.scene.scene.ghostPieces.push(ghost);
              }
            } else {
              const ghost = this.add.image(
                this.game.config.width * boardX[possMoves[i][1]],
                this.game.config.height * boardY[possMoves[i][0]],
                'redPiece',
              ).setScale(0.5).setAlpha(0.5);

              ghost.setInteractive();
              ghost.on('pointerup', () => {
                this.jump(piece, possMoves[i]);
              });

              this.scene.scene.ghostPieces.push(ghost);
            }
          }
        });
      }
    });
  }
}

export default SceneGame;
