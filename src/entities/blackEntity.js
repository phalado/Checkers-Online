import Entity from './Entity';

class BlackPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'BlackPiece');
    this.setData('boardV', 0);
    this.setData('boardH', 0);
    this.setData('checker', false);
  }

  updatePosition(v, h) {
    this.setData('boardV', v);
    this.setData('boardH', h);
  }

  movePossibility() {
    this.MP = [];
    this.pos = [this.getData('boardV'), this.getData('boardH')];

    if (this.pos[0] > 0 && this.pos[1] > 0) {
      if (this.scene.board[this.pos[0] - 1][this.pos[1] - 1] === 0) {
        this.MP.push([this.pos[0] - 1, this.pos[1] - 1]);
      } else if (this.pos[0] > 1 && this.pos[1] > 1) {
        if (this.scene.board[this.pos[0] - 1][this.pos[1] - 1].data.list.type === 'RedPiece'
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
        if (this.scene.board[this.pos[0] - 1][this.pos[1] + 1].data.list.type === 'RedPiece'
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

  checkDoubleJump(v, h) {
    this.DJ = [];
    if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
      if (this.scene.board[v - 1][h - 1].data.list.type === 'RedPiece'
          && this.scene.board[v - 2][h - 2] === 0) {
        this.DJ.push([[v, h], [v - 2, h - 2]]);
        this.DJ.push(this.checkTripleJump(v - 2, h - 2, [[v, h], [v - 2, h - 2]]));
        if (this.DJ[this.DJ.length - 1] === '') {
          this.DJ.pop();
        }
      }
    }

    if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
      if (this.scene.board[v - 1][h + 1].data.list.type === 'RedPiece'
          && this.scene.board[v - 2][h + 2] === 0) {
        this.DJ.push([[v, h], [v - 2, h + 2]]);
        this.DJ.push(this.checkTripleJump(v - 2, h + 2, [[v, h], [v - 2, h + 2]]));
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

  update() {
    this.x = this.scene.game.config.width * this.scene.boardHValues[this.getData('boardH')];
    this.y = this.scene.game.config.height * this.scene.boardVValues[this.getData('boardV')];
  }
}

export default BlackPiece;
