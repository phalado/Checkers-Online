import Phaser from 'phaser';
import SceneGame from './scenes/SceneGame';
import SceneGameOver from './scenes/SceneGameOver';
import SceneMainMenu from './scenes/SceneMainMenu';

const config = {
  type: Phaser.WEBGL,
  parent: 'divld',
  width: 800,
  height: 600,
  backgroundColor: 'blue',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [
    SceneMainMenu,
    SceneGame,
    SceneGameOver,
  ],
  pixelArt: true,
  roundPixels: true,
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
