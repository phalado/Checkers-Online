import Phaser from 'phaser';
import RedPiece from '../entities/redEntity';
import BlackPiece from '../entities/blackEntity';

class SceneGame extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGame' });
  }

  init(data) {
    this.socket = data.socket;
    this.boardID = data.boardID;
    this.color = data.color;
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
      300,
      this.game.config.height * 0.5,
      'board',
    );

    this.redPieces = this.add.group();
    this.blackPieces = this.add.group();
    this.turn = this.color;

    this.physics.add.collider(this.redPieces, this.blackPieces, (red, black) => {
      if ((this.turn && this.color) || (!this.turn && !this.color)) {
        this.board[black.getData('boardV')][black.getData('boardH')] = 0;
        black.destroy();
      } else {
        this.board[red.getData('boardV')][red.getData('boardH')] = 0;
        red.destroy();
      }
    });

    this.playerNumber = this.color ? 0 : 1;
    this.boardVertValues = [0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88];
    this.boardHorzValues = [0.09, 0.171, 0.253, 0.335, 0.415, 0.498, 0.582, 0.663];

    this.board = this.createBoard();

    this.textConfig = {
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '25px',
      lineHeight: 1.3,
      align: 'center',
    };

    this.textGameNumber = this.add.text(
      610,
      this.game.config.height * 0.03,
      `Game number:\n ${this.boardID}`,
      this.textConfig,
    );

    this.textPlay1 = this.add.text(
      610,
      this.game.config.height * 0.2,
      'Player 1 - Red',
      this.textConfig,
    );
    this.textPlay1.setColor('white');

    this.textPlay1Turn = this.add.text(
      610,
      this.game.config.height * 0.30,
      'YOUR TURN',
      this.textConfig,
    );
    this.textPlay1Turn.setColor('Yellow');

    this.textPlay2 = this.add.text(
      610,
      this.game.config.height * 0.6,
      'Player 2 - Black',
      this.textConfig,
    );
    this.textPlay2.setColor('white');

    this.textPlay2Turn = this.add.text(
      610,
      this.game.config.height * 0.70,
      'YOUR TURN',
      this.textConfig,
    );
    this.textPlay2Turn.setColor('Yellow');

    if (this.color) {
      this.textPlay2Turn.text = "OPPONENT'S\n TURN";
    } else {
      this.textPlay1Turn.text = "OPPONENT'S\n TURN";
    }

    this.changeTurn();

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
        this.socket.on('changeTurn', (value, opPiece, positionArray, gameOver) => {
          if (gameOver) {
            this.time.addEvent({
              delay: 3000,
              callback() {
                this.scene.start('SceneGameOver', { victor: value });
              },
              callbackScope: this,
              loop: true,
            });
          }
          if (value === this.color) {
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

  oponentMovement(piece, positionArray) {
    const v = piece.getData('boardV');
    const h = piece.getData('boardH');
    const lenf = positionArray.length;
    this.board[v][h] = 0;

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 1000);
    }

    setTimeout(() => {
      this.board[positionArray[lenf - 1][0]][positionArray[lenf - 1][1]] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.checkEndGame();
      this.turn = true;
      this.changeTurn();
      this.setInteractiveness(this.boardVertValues, this.boardHorzValues);
    }, 1000 * lenf);
  }

  deleteInteractiveness() {
    const group = this.color ? this.redPieces : this.blackPieces;
    group.getChildren().forEach((piece) => {
      piece.disableInteractive();
    });
  }

  multiJump(piece, positionArray) {
    const v = piece.getData('boardV');
    const h = piece.getData('boardH');
    const lenf = positionArray.length;
    this.board[v][h] = 0;
    this.deleteGhosts();

    for (let i = 0; i < lenf; i += 1) {
      this.moveAnim(piece, positionArray[i], i * 1000);
    }

    setTimeout(() => {
      this.board[positionArray[lenf - 1][0]][positionArray[lenf - 1][1]] = piece;
      piece.updatePosition(...positionArray[lenf - 1]);
      this.deleteInteractiveness();
      this.checkEndGame([v, h], positionArray, this.boardID);
      this.turn = false;
      this.changeTurn();
      this.socket.emit('change', this.color, [v, h], positionArray, this.boardID);
      this.wait();
    }, 1000 * lenf);
  }

  checkEndGame(piece, positionArray, bID) {
    this.group = this.color ? this.blackPieces : this.redPieces;
    if (this.group.children.size === 0
        || this.checkMovePossibility(this.group)) {
      this.socket.emit('gameOver', this.color, piece, positionArray, bID);
      this.time.addEvent({
        delay: 3000,
        callback() {
          this.scene.start('SceneGameOver', { victor: this.color });
        },
        callbackScope: this,
        loop: true,
      });
    }
  }

  checkMovePossibility(group) {
    // eslint-disable-next-line consistent-return
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

  changeTurn() {
    if ((this.turn && this.color) || (!this.turn && !this.color)) {
      this.textPlay1Turn.setColor('red');
      this.textPlay2Turn.setColor('gray');
    } else {
      this.textPlay1Turn.setColor('gray');
      this.textPlay2Turn.setColor('red');
    }
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
