import { Game, AUTO, Types } from 'phaser';

import { PHYSICS } from './utils/const';

import { PreloaderScene } from './scenes/preload';
import { GameScene } from './scenes/game';
import { PauseScene } from './scenes/pause';
import { SplashScene } from './scenes/splash';
import { TitleScene } from './scenes/title';
import { ResultScene } from './scenes/result';

import './assets/styles/style.css';

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
      debug: import.meta.env.MODE === 'development',
      gravity: {
        y: PHYSICS.GRAVITY,
      }
    },
  },
  pixelArt: true,
  parent: '#game',
  scene: [PreloaderScene, TitleScene, SplashScene,  GameScene, PauseScene, ResultScene],
};

new Game(config);
