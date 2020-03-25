import Phaser from 'phaser';

class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData('type', type);
  }

  moveUp(pos, MP) {
    if (pos[0] > 0 && pos[1] > 0) {
      if (this.scene.board[pos[0] - 1][pos[1] - 1] === 0) {
        MP.push([pos[0] - 1, pos[1] - 1]);
      }
    }

    if (pos[0] > 0 && pos[1] < 7) {
      if (this.scene.board[pos[0] - 1][pos[1] + 1] === 0) {
        MP.push([pos[0] - 1, pos[1] + 1]);
      }
    }

    return MP;
  }

  moveDown(pos, MP) {
    if (pos[0] < 7 && pos[1] > 0) {
      if (this.scene.board[pos[0] + 1][pos[1] - 1] === 0) {
        MP.push([pos[0] + 1, pos[1] - 1]);
      }
    }

    if (pos[0] < 7 && pos[1] < 7) {
      if (this.scene.board[pos[0] + 1][pos[1] + 1] === 0) {
        MP.push([pos[0] + 1, pos[1] + 1]);
      }
    }

    return MP;
  }

  jumpUp(pos, MP, type) {
    if (pos[0] > 1 && pos[1] > 1) {
      if (this.scene.board[pos[0] - 1][pos[1] - 1] !== 0) {
        if (this.scene.board[pos[0] - 1][pos[1] - 1].data.list.type === type
            && this.scene.board[pos[0] - 2][pos[1] - 2] === 0) {
          MP.push([pos[0] - 2, pos[1] - 2]);
          MP.push(this.doubleJumpUp(pos[0] - 2, pos[1] - 2, type));
          MP[MP.length - 1] === '' ? MP.pop() : null;
        }
      }
    }

    if (pos[0] > 1 && pos[1] < 6) {
      if (this.scene.board[pos[0] - 1][pos[1] + 1] !== 0) {
        if (this.scene.board[pos[0] - 1][pos[1] + 1].data.list.type === type
          && this.scene.board[pos[0] - 2][pos[1] + 2] === 0) {
          MP.push([pos[0] - 2, pos[1] + 2]);
          MP.push(this.doubleJumpUp(pos[0] - 2, pos[1] + 2, type));
          MP[MP.length - 1] === '' ? MP.pop() : null;
        }
      }
    }

    return MP;
  }

  jumpDown(pos, MP, type) {
    if (pos[0] < 6 && pos[1] > 1) {
      if (this.scene.board[pos[0] + 1][pos[1] - 1] !== 0) {
        if (this.scene.board[pos[0] + 1][pos[1] - 1].data.list.type === type
            && this.scene.board[pos[0] + 2][pos[1] - 2] === 0) {
          MP.push([pos[0] + 2, pos[1] - 2]);
          MP.push(this.doubleJumpDown(pos[0] + 2, pos[1] - 2, type));
          MP[MP.length - 1] === '' ? MP.pop() : null;
        }
      }
    }

    if (pos[0] < 6 && pos[1] < 6) {
      if (this.scene.board[pos[0] + 1][pos[1] + 1] !== 0) {
        if (this.scene.board[pos[0] + 1][pos[1] + 1].data.list.type === type
          && this.scene.board[pos[0] + 2][pos[1] + 2] === 0) {
          MP.push([pos[0] + 2, pos[1] + 2]);
          MP.push(this.doubleJumpDown(pos[0] + 2, pos[1] + 2, type));
          MP[MP.length - 1] === '' ? MP.pop() : null;
        }
      }
    }

    return MP;
  }

  doubleJumpUp(v, h, type) {
    this.DJ = [];
    if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
      if (this.scene.board[v - 1][h - 1].data.list.type === type
          && this.scene.board[v - 2][h - 2] === 0) {
        this.DJ.push([[v, h], [v - 2, h - 2]]);
        this.DJ.push(this.tripleJumpUp(v - 2, h - 2, [[v, h], [v - 2, h - 2]], type));
        this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
      }
    }

    if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
      if (this.scene.board[v - 1][h + 1].data.list.type === type
          && this.scene.board[v - 2][h + 2] === 0) {
        this.DJ.push([[v, h], [v - 2, h + 2]]);
        this.DJ.push(this.tripleJumpUp(v - 2, h + 2, [[v, h], [v - 2, h + 2]], type));
        this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
      }
    }

    if (this.getData('king')) {
      if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
        if (this.scene.board[v + 1][h - 1].data.list.type === type
            && this.scene.board[v + 2][h - 2] === 0) {
          this.DJ.push([[v, h], [v + 2, h - 2]]);
          this.DJ.push(this.tripleJumpUp(v + 2, h - 2, [[v, h], [v + 2, h - 2]], type));
          this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
        }
      }

      if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
        if (this.scene.board[v + 1][h + 1].data.list.type === type
            && this.scene.board[v + 2][h + 2] === 0) {
          this.DJ.push([[v, h], [v + 2, h + 2]]);
          this.DJ.push(this.tripleJumpUp(v + 2, h + 2, [[v, h], [v + 2, h + 2]], type));
          this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
        }
      }
    }

    if (this.DJ !== []) {
      return this.DJ;
    }

    return '';
  }

  doubleJumpDown(v, h, type) {
    this.DJ = [];

    if (this.getData('king')) {
      if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
        if (this.scene.board[v - 1][h - 1].data.list.type === type
            && this.scene.board[v - 2][h - 2] === 0) {
          this.DJ.push([[v, h], [v - 2, h - 2]]);
          this.DJ.push(this.tripleJumpDown(v - 2, h - 2, [[v, h], [v - 2, h - 2]], type));
          this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
        }
      }

      if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
        if (this.scene.board[v - 1][h + 1].data.list.type === type
            && this.scene.board[v - 2][h + 2] === 0) {
          this.DJ.push([[v, h], [v - 2, h + 2]]);
          this.DJ.push(this.tripleJumpDown(v - 2, h + 2, [[v, h], [v - 2, h + 2]], type));
          this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
        }
      }
    }

    if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
      if (this.scene.board[v + 1][h - 1].data.list.type === type
          && this.scene.board[v + 2][h - 2] === 0) {
        this.DJ.push([[v, h], [v + 2, h - 2]]);
        this.DJ.push(this.tripleJumpDown(v + 2, h - 2, [[v, h], [v + 2, h - 2]], type));
        this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
      }
    }

    if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
      if (this.scene.board[v + 1][h + 1].data.list.type === type
          && this.scene.board[v + 2][h + 2] === 0) {
        this.DJ.push([[v, h], [v + 2, h + 2]]);
        this.DJ.push(this.tripleJumpDown(v + 2, h + 2, [[v, h], [v + 2, h + 2]], type));
        this.DJ[this.DJ.length - 1] === '' ? this.DJ.pop() : null;
      }
    }

    if (this.DJ !== []) {
      return this.DJ;
    }

    return '';
  }

  tripleJumpUp(v, h, array, type) {
    if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
      if (this.scene.board[v - 1][h - 1].data.list.type === type
          && this.scene.board[v - 2][h - 2] === 0) {
        array.push([v - 2, h - 2]);
      }
    }

    if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
      if (this.scene.board[v - 1][h + 1].data.list.type === type
          && this.scene.board[v - 2][h + 2] === 0) {
        array.push([v - 2, h + 2]);
      }
    }

    if (this.getData('king')) {
      if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
        if (this.scene.board[v + 1][h - 1].data.list.type === type
            && this.scene.board[v + 2][h - 2] === 0) {
          array.push([v + 2, h - 2]);
        }
      }

      if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
        if (this.scene.board[v + 1][h + 1].data.list.type === type
            && this.scene.board[v + 2][h + 2] === 0) {
          array.push([v + 2, h + 2]);
        }
      }
    }

    if (array.length > 2) {
      return array;
    }

    return '';
  }

  tripleJumpDown(v, h, array, type) {
    if (this.getData('king')) {
      if (v > 1 && h > 1 && this.scene.board[v - 1][h - 1] !== 0) {
        if (this.scene.board[v - 1][h - 1].data.list.type === type
            && this.scene.board[v - 2][h - 2] === 0) {
          array.push([v - 2, h - 2]);
        }
      }

      if (v > 1 && h < 6 && this.scene.board[v - 1][h + 1] !== 0) {
        if (this.scene.board[v - 1][h + 1].data.list.type === type
            && this.scene.board[v - 2][h + 2] === 0) {
          array.push([v - 2, h + 2]);
        }
      }
    }

    if (v < 6 && h > 1 && this.scene.board[v + 1][h - 1] !== 0) {
      if (this.scene.board[v + 1][h - 1].data.list.type === type
          && this.scene.board[v + 2][h - 2] === 0) {
        array.push([v + 2, h - 2]);
      }
    }

    if (v < 6 && h < 6 && this.scene.board[v + 1][h + 1] !== 0) {
      if (this.scene.board[v + 1][h + 1].data.list.type === type
          && this.scene.board[v + 2][h + 2] === 0) {
        array.push([v + 2, h + 2]);
      }
    }

    if (array.length > 2) {
      return array;
    }

    return '';
  }

  update() {
    this.x = this.scene.game.config.width * this.scene.boardHValues[this.getData('boardH')];
    this.y = this.scene.game.config.height * this.scene.boardVValues[this.getData('boardV')];
  }
}

export default Entity;
