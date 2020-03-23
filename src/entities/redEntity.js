import Entity from './Entity';

class RedPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'RedPiece');
    this.setData('boardX', 0);
    this.setData('boardY', 0);
    this.setData('checker', false);
  }

  updatePosition(x, y) {
    this.setData('boardX', x);
    this.setData('boardY', y);
  }

  movePossibility() {
    this.MP = [];
    this.pos = [this.getData('boardX'), this.getData('boardY')];

    if (this.pos[0] > 0 && this.pos[1] > 0) {
      if (this.scene.board[this.pos[0] - 1][this.pos[1] - 1] === 0) {
        this.MP.push([this.pos[0] - 1, this.pos[1] - 1]);
      } else if (this.pos[0] > 1 && this.pos[1] > 1) {
        if (this.scene.board[this.pos[0] - 1][this.pos[1] - 1].data.list.type === 'BlackPiece'
            && this.scene.board[this.pos[0] - 2][this.pos[1] - 2] === 0) {
          this.MP.push([this.pos[0] - 2, this.pos[1] - 2]);
          this.MP.push(this.checkDoubleJump(this.pos[0] - 2, this.pos[1] - 2));
          if (this.MP[this.MP.length - 1] === '') {
            this.MP.pop();
          }
        }
      }
    }

    if (this.pos[0] > 0 && this.pos[1] < 7) {
      if (this.scene.board[this.pos[0] - 1][this.pos[1] + 1] === 0) {
        this.MP.push([this.pos[0] - 1, this.pos[1] + 1]);
      } else if (this.pos[0] > 1 && this.pos[1] < 6) {
        if (this.scene.board[this.pos[0] - 1][this.pos[1] + 1].data.list.type === 'BlackPiece'
          && this.scene.board[this.pos[0] - 2][this.pos[1] + 2] === 0) {
          this.MP.push([this.pos[0] - 2, this.pos[1] + 2]);
          this.MP.push(this.checkDoubleJump(this.pos[0] - 2, this.pos[1] + 2));
          if (this.MP[this.MP.length - 1] === '') {
            this.MP.pop();
          }
        }
      }
    }

    return this.MP;
  }

  checkDoubleJump(y, x) {
    this.DJ = [];
    if (y > 1 && x > 1 && this.scene.board[y - 1][x - 1] !== 0) {
      if (this.scene.board[y - 1][x - 1].data.list.type === 'BlackPiece'
          && this.scene.board[y - 2][x - 2] === 0) {
        this.DJ.push([[y, x], [y - 2, x - 2]]);
        this.DJ.push(this.checkTripleJump(x - 2, y - 2, [[x, y], [x - 2, y - 2]]));
        if (this.DJ[this.DJ.length - 1] === '') {
          this.DJ.pop();
        }
      }
    }

    if (y > 1 && x < 6 && this.scene.board[y - 1][x + 1] !== 0) {
      if (this.scene.board[y - 1][x + 1].data.list.type === 'BlackPiece'
          && this.scene.board[y - 2][x + 2] === 0) {
        this.DJ.push([[y, x], [y - 2, x + 2]]);
        this.DJ.push(this.checkTripleJump(x - 2, y + 2, [[x, y], [x - 2, y + 2]]));
        if (this.DJ[this.DJ.length - 1] === '') {
          this.DJ.pop();
        }
      }
    }

    if (this.DJ !== []) {
      return this.DJ;
    }

    return '';
  }

  checkTripleJump(y, x, array) {
    console.log(x);
    console.log(y);
    console.log(array);
    if (y > 1 && x > 1 && this.scene.board[y - 1][x - 1] !== 0) {
      if (this.scene.board[y - 1][x - 1].data.list.type === 'BlackPiece'
          && this.scene.board[y - 2][x - 2] === 0) {
        array.push([[y, x], [y - 2, x - 2]]);
      }
    }

    if (y > 1 && x < 6 && this.scene.board[y - 1][x + 1] !== 0) {
      if (this.scene.board[y - 1][x + 1].data.list.type === 'BlackPiece'
          && this.scene.board[y - 2][x + 2] === 0) {
        array.push([y - 2, x + 2]);
      }
    }

    if (array.length > 2) {
      return array;
    }

    return '';
  }

  update() {
    this.x = this.scene.game.config.width * this.scene.boardXValues[this.getData('boardY')];
    this.y = this.scene.game.config.height * this.scene.boardYValues[this.getData('boardX')];
  }
}

export default RedPiece;
