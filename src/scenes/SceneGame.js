import Phaser from 'phaser';
import RedPiece from '../entities/redEntity';
import BlackPiece from '../entities/blackEntity';

class SceneGame extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGame' });
  }

  init(data) {
    this.socket = data.socket;
    this.players = data.players;
    Object.keys(this.players).forEach((id) => {
      if (this.players[id].playerId === this.socket.id) {
        this.color = this.players[id].color;
      }
    });
  }

  preload() {
    this.load.image('board', 'content/board.png');
    this.load.image('redPiece', 'content/redPiece.png');
    this.load.image('redChecker', 'content/redChecker.png');
    this.load.image('blackPiece', 'content/blackPiece.png');
    this.load.image('blackChecker', 'content/blackChecker.png');
  }

  create() {
    this.boardImg = this.add.image(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'board',
    );

    // eslint-disable-next-line no-undef
    this.redPieces = this.add.group();
    this.blackPieces = this.add.group();
    this.turn = this.color;

    this.physics.add.collider(this.redPieces, this.blackPieces, (red, black) => {
      // console.log('Physics');
      // console.log(this.turn);
      // console.log(this.color);
      // console.log(black);
      // console.log(red);
      console.log('Here 5');
      console.log(this.turn);
      if ((this.turn && this.color) || (!this.turn && !this.color)) {
        this.board[black.getData('boardV')][black.getData('boardH')] = 0;
        black.destroy();
      } else {
        this.board[red.getData('boardV')][red.getData('boardH')] = 0;
        red.destroy();
      }
      // console.log(black);
      // console.log(red);
      console.log(this.board);
    });

    this.playerNumber = this.color ? 0 : 1;
    this.boardVertValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];
    this.boardHorzValues = [0.214, 0.295, 0.378, 0.46, 0.54, 0.623, 0.707, 0.788];

    this.board = this.createBoard();

    // Delete this in the future
    // this.bPiece = new BlackPiece(
    //   this,
    //   this.game.config.width * this.boardHorzValues[3],
    //   this.game.config.height * this.boardVertValues[4],
    //   'blackPiece',
    // ).setScale(0.5);
    // this.bPiece.updatePosition(4, 3);
    // this.board[4][3] = this.bPiece;
    // this.blackPieces.add(this.bPiece);

    // this.bPiece2 = this.board[1][4];
    // this.board[1][4] = 0;
    // this.bPiece2.destroy();

    // this.bPiece3 = this.board[1][0];
    // this.board[1][0] = 0;
    // this.bPiece3.destroy();

    // this.bPiece4 = new BlackPiece(
    //   this,
    //   this.game.config.width * this.boardHorzValues[6],
    //   this.game.config.height * this.boardVertValues[3],
    //   'blackPiece',
    // ).setScale(0.5);
    // this.bPiece4.updatePosition(3, 6);
    // this.board[3][6] = this.bPiece4;
    // this.blackPieces.add(this.bPiece4);

    // this.rPiece = this.board[5][6];
    // this.board[5][6] = 0;
    // this.rPiece.destroy();

    // this.bPiece5 = new BlackPiece(
    //   this,
    //   this.game.config.width * this.boardHorzValues[6],
    //   this.game.config.height * this.boardVertValues[5],
    //   'blackPiece',
    // ).setScale(0.5);
    // this.bPiece5.updatePosition(5, 6);
    // this.board[5][6] = this.bPiece5;
    // this.blackPieces.add(this.bPiece5);

    // this.bPiece6 = this.board[2][7];
    // this.board[2][7] = 0;
    // this.bPiece6.destroy();

    // this.bPiece7 = this.board[0][5];
    // this.board[0][5] = 0;
    // this.bPiece7.destroy();
    // Delete until here

    this.ghostPieces = [];
    console.log(this.board);
    this.startGame();
  }

  startGame() {
    if (this.turn) {
      this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
    } else {
      console.log('Others turn');
      this.wait();
    }
  }

  wait() {
    this.time.addEvent({
      delay: 0,
      callback() {
        this.socket.on('changeTurn', (value, opPiece, positionArray) => {
          if (value === this.playerNumber) {
            let pisc = '';
            const group = this.color ? this.blackPieces : this.redPieces;
            group.getChildren().forEach((piece) => {
              if (piece.getData('boardV') === opPiece[0]
                  && piece.getData('boardH') === opPiece[1]) {
                pisc = piece;
              }
            });
            this.oponentMovement(pisc, positionArray);
          }
        });
      },
      callbackScope: this,
      loop: false,
    });
  }

  // getPiece(opPiece) {
  //   const group = this.color ? this.blackPieces : this.redPieces;
  //   group.getChildren().forEach((piece) => {
  //     // console.log(piece.getData('boardV'));
  //     // console.log(piece.getData('boardH'));
  //     let pisc = '';
  //     if (piece.getData('boardV') === opPiece[0]
  //         && piece.getData('boardH') === opPiece[1]) {
  //       pisc = piece;
  //     }
  //     console.log(pisc);
  //     return pisc;
  //     // console.log(group);
  //     // console.log(opPiece);
  //   });
  // }

  oponentMovement(piece, positionArray) {
    const v = piece.getData('boardV');
    const h = piece.getData('boardH');
    const lenf = positionArray.length;
    this.board[v][h] = 0;

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 1000);
    }

    console.log('Here 1');
    console.log(this.turn);
    setTimeout(() => {
      // console.log('HEREEEEEEEEEEEEEEEEEE');
      console.log('Here 2');
      console.log(this.turn);
      this.board[positionArray[lenf - 1][0]][positionArray[lenf - 1][1]] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.turn = true;
      this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
      console.log('Here 3');
      console.log(this.turn);
    }, 1000 * lenf);
    console.log('Here 4');
    console.log(this.turn);
  }

  deleteInteractiveness() {
    const group = this.color ? this.redPieces : this.blackPieces;
    group.getChildren().forEach((piece) => {
      piece.disableInteractive();
    });
  }

  // jump(piece, newPosition) {
  //   const v = piece.getData('boardV');
  //   const h = piece.getData('boardH');
  //   this.board[v][h] = 0;

  //   this.moveAnim(piece, newPosition);
  //   piece.updatePosition(...newPosition);
  //   this.board[newPosition[0]][newPosition[1]] = piece;
  //   this.deleteInteractiveness();
  //   this.checkEndGame();
  //   this.changeTurn(piece, newPosition);
  //   this.socket.emit('change', this.playerNumber, true, piece, newPosition);
  //   this.wait();
  //   // this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
  // }

  multiJump(piece, positionArray) {
    const v = piece.getData('boardV');
    const h = piece.getData('boardH');
    const lenf = positionArray.length;
    this.board[v][h] = 0;
    this.deleteGhosts();

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 10);
    }

    console.log('Here 1');
    console.log(this.turn);
    setTimeout(() => {
      console.log('Here 2');
      console.log(this.turn);
      this.board[positionArray[lenf - 1][0]][positionArray[lenf - 1][1]] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.deleteInteractiveness();
      // this.checkEndGame();
      this.turn = false;
      this.socket.emit('change', this.playerNumber, [v, h], positionArray);
      this.wait();
      console.log('Here 3');
      console.log(this.turn);
    }, 1000 * lenf);
    console.log('Here 4');
    console.log(this.turn);

    // this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
  }

  checkEndGame() {
    this.group = this.color ? this.blackPieces : this.redPieces;
    if (this.group.children.size === 0
        || this.checkMovePossibility(this.group)) {
      this.time.addEvent({
        delay: 3000,
        callback() {
          this.scene.start('SceneGameOver');
        },
        callbackScope: this,
        loop: true,
      });
    }
  }

  checkMovePossibility(group) {
    group.getChildren().forEach((piece) => {
      if (piece.movePossibility(!this.color).length !== 0) {
        return true;
      }
    });

    return false;
  }

  moveAnim(piece, newPosition, delay = 0) {
    this.movement = this.tweens.add({
      targets: piece,
      x: this.game.config.width * this.boardHorzValues[newPosition[1]],
      y: this.game.config.height * this.boardVertValues[newPosition[0]],
      ease: 'Power1',
      delay,
      duration: 1000,
      repeat: 0,
    });
    return this.movement;
  }

  createBoard() {
    this.board = [];
    for (let i = 0; i < 8; i += 1) {
      this.board.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    for (let i = 0; i < 8; i += 1) {
      if (i % 2 === 0) {
        this.board[5][i] = this.createPiece(5, i, true);
        this.board[1][i] = this.createPiece(1, i, false);
        this.board[7][i] = this.createPiece(7, i, true);
      } else {
        this.board[6][i] = this.createPiece(6, i, true);
        this.board[2][i] = this.createPiece(2, i, false);
        this.board[0][i] = this.createPiece(0, i, false);
      }
    }

    return this.board;
  }

  createPiece(v, h, color) {
    if (color) {
      this.piece = new RedPiece(
        this,
        this.game.config.width * this.boardHorzValues[h],
        this.game.config.height * this.boardVertValues[v],
        'redPiece',
      );
    } else {
      this.piece = new BlackPiece(
        this,
        this.game.config.width * this.boardHorzValues[h],
        this.game.config.height * this.boardVertValues[v],
        'blackPiece',
      );
    }
    this.piece.setScale(0.5);
    this.piece.updatePosition(v, h);
    color ? this.redPieces.add(this.piece) : this.blackPieces.add(this.piece);
    return this.piece;
  }

  deleteGhosts() {
    this.ghostPieces.forEach((value) => {
      value.destroy();
    });
    this.ghostPieces = [];
  }

  setInteractiveness(boardV, boardH) {
    this.group = this.color ? this.redPieces : this.blackPieces;
    this.ghostColor = this.color ? 'redPiece' : 'blackPiece';
    this.group.getChildren().forEach((piece) => {
      if (piece.movePossibility(this.color).length !== 0) {
        piece.setInteractive();

        piece.on('pointerover', () => {
          piece.setScale(0.55);
        });

        piece.on('pointerout', () => {
          piece.setScale(0.5);
        });

        piece.on('pointerup', () => {
          const possMoves = piece.movePossibility(this.color);
          this.deleteGhosts();
          for (let i = 0; i < possMoves.length; i += 1) {
            if (typeof possMoves[i][0] === 'object') {
              for (let j = 0; j < possMoves[i].length; j += 1) {
                const ghost = this.add.image(
                  this.game.config.width * boardH[possMoves[i][j][possMoves[i][j].length - 1][1]],
                  this.game.config.height * boardV[possMoves[i][j][possMoves[i][j].length - 1][0]],
                  this.ghostColor,
                ).setScale(0.5).setAlpha(0.5);

                ghost.setInteractive();
                ghost.on('pointerup', () => {
                  this.multiJump(piece, possMoves[i][j]);
                });
                this.ghostPieces.push(ghost);
              }
            } else {
              const ghost = this.add.image(
                this.game.config.width * boardH[possMoves[i][1]],
                this.game.config.height * boardV[possMoves[i][0]],
                this.ghostColor,
              ).setScale(0.5).setAlpha(0.5);

              ghost.setInteractive();
              ghost.on('pointerup', () => {
                this.multiJump(piece, [possMoves[i]]);
              });
              this.ghostPieces.push(ghost);
            }
          }
        });
      }
    });
  }
}

export default SceneGame;
