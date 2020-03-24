import Entity from './Entity';

class BlackPiece extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, 'BlackPiece');
    this.setData('boardV', 0);
    this.setData('boardH', 0);
    this.setData('king', false);
  }

  updatePosition(v, h) {
    this.setData('boardV', v);
    this.setData('boardH', h);

    if (v === 0 && !this.scene.color) {
      this.setData('king', true);
      this.setTexture('blackChecker');
    }

    if (v === 7 && this.scene.color) {
      this.setData('king', true);
      this.setTexture('blackChecker');
    }
  }
}

export default BlackPiece;
