import { Game, AUTO, Types } from 'phaser';

import { PHYSICS } from './utils/const';

import { PreloaderScene } from './scenes/preload';
import { GameScene } from './scenes/game';
import { TitleScene } from './scenes/title';

const config: Types.Core.GameConfig = {
  type: AUTO,
  width: 640,
  height: 384,
  antialias: true,
  antialiasGL: true,
  backgroundColor: 'transparent',
  physics: {
    default: 'arcade',
    arcade: {
      debug: import.meta.env.MODE !== 'development',
      gravity: {
        y: PHYSICS.GRAVITY,
      }
    },
  },
  pixelArt: true,
  parent: '#game',
  scene: [PreloaderScene, TitleScene, GameScene],
};

new Game(config);
