import Entity from './Entity';

class BlackPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'BlackPiece');
    this.setData('boardX', 0);
    this.setData('boardY', 0);
    this.setData('checker', false);
  }

  updatePosition(y, x) {
    this.setData('boardX', x);
    this.setData('boardY', y);
  }

  movePossibility() {
    this.MP = [];
    this.pos = [this.getData('boardX'), this.getData('boardY')];

    if (this.pos[0] > 0 && this.pos[1] > 0) {
      if (this.scene.board[this.pos[0] - 1][this.pos[1] - 1] === 0) {
        this.MP.push([this.pos[0] - 1, this.pos[1] - 1]);
      } else if (this.pos[0] > 1
                && this.pos[1] > 1
                && this.scene.board[this.pos[0] - 1][this.pos[1] - 1].data.list.type === 'RedPiece'
                && this.scene.board[this.pos[0] - 2][this.pos[1] - 2] === 0) {
        this.MP.push([this.pos[0] - 2, this.pos[1] - 2]);
      }
    }

    if (this.pos[0] > 0 && this.pos[1] < 7) {
      if (this.scene.board[this.pos[0] - 1][this.pos[1] + 1] === 0) {
        this.MP.push([this.pos[0] - 1, this.pos[1] + 1]);
      } else if (this.pos[0] > 1
                && this.pos[1] < 6
                && this.scene.board[this.pos[0] - 1][this.pos[1] + 1].data.list.type === 'RedPiece'
                && this.scene.board[this.pos[0] - 2][this.pos[1] + 2] === 0) {
        this.MP.push([this.pos[0] - 2, this.pos[1] + 2]);
      }
    }

    return this.MP;
  }

  update() {
    this.x = this.game.config.width * this.scene.boardXValue[this.getData('boardX')];
    this.y = this.game.config.height * this.scene.boardYValue[this.getData('boardY')];
  }
}

export default BlackPiece;
