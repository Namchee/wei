import { Game, AUTO } from 'phaser';

import { PreloaderScene } from './scenes/preload';
import { GameScene } from './scenes/game';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 640,
  height: 384,
  antialias: true,
  antialiasGL: true,
  backgroundColor: 'transparent',
  physics: {
    default: 'arcade',
  },
  pixelArt: true,
  parent: '#game',
  scene: [PreloaderScene, GameScene],
};

new Game(config);
