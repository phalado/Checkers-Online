import Entity from './Entity';

class RedPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'RedPiece');
    this.setData('boardV', 0);
    this.setData('boardH', 0);
    this.setData('king', false);
  }

  movePossibility(color) {
    this.MP = [];
    this.pos = [this.getData('boardV'), this.getData('boardH')];
    const type = color ? 'BlackPiece' : 'RedPiece';

    this.MP = this.moveUp(this.pos, this.MP);
    this.MP = this.jumpUp(this.pos, this.MP, type);

    if (this.getData('king')) {
      this.MP = this.moveDown(this.pos, this.MP);
      this.MP = this.jumpDown(this.pos, this.MP, type);
    }

    return this.MP;
  }

  updatePosition(v, h) {
    this.setData('boardV', v);
    this.setData('boardH', h);

    if (v === 0) {
      this.setData('king', true);
      this.setTexture('redChecker');
    }

    // if (v === 7 && !this.scene.color) {
    //   this.setData('king', true);
    //   this.setTexture('redChecker');
    // }
  }

  // update() {
  //   this.x = this.scene.game.config.width * this.scene.boardHValues[this.getData('boardH')];
  //   this.y = this.scene.game.config.height * this.scene.boardVValues[this.getData('boardV')];
  // }
}

export default RedPiece;
