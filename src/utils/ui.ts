import Phaser from 'phaser';

import { GameSettings } from '../state/setting';
import { TitleScene } from '../scenes/title';

import { MAP, SOUND } from './const';

export function injectUI(
  scene: Phaser.Scene,
): Phaser.GameObjects.Image[] {
  const { width, height } = scene.game.config;

  const bgmButton = scene.add.image(
    Number(width) * 0.925,
    Number(height) * 0.0625,
    'bgm-on',
  )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setInteractive({ cursor: 'pointer' });

  const sfxButton = scene.add.image(
    bgmButton.x + MAP.TILE_SIZE * 1.5,
    Number(height) * 0.0625,
    'sfx-on'
  )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setInteractive({ cursor: 'pointer' });

  const fullScreenButton = scene.add.image( 
    bgmButton.x - MAP.TILE_SIZE * 1.5,
    Number(height) * 0.0625,
    'fullscreen',
  )
    .setOrigin(0.5, 0.5)
    .setScrollFactor(0)
    .setInteractive({ cursor: 'pointer' });
  
  sfxButton.on('pointerdown', () => {
    sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}-pressed`);
  });

  sfxButton.on('pointerup', () => {
    GameSettings.getInstance().toggleSfx();
    sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}`);

    if (GameSettings.getInstance().sfx) {
      scene.sound.play('button', { volume: SOUND.SFX });
    }
  });

  bgmButton.on('pointerdown', () => {
    bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}-pressed`);
  });

  bgmButton.on('pointerup', () => {
    GameSettings.getInstance().toggleBgm();
    bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}`);

    const bgm = scene.sound.get(scene instanceof TitleScene ? 'title' : 'game');
    GameSettings.getInstance().bgm ? bgm.resume() : bgm.pause();

    if (GameSettings.getInstance().sfx) {
      scene.sound.play('button', { volume: SOUND.SFX });
    }
  });

  fullScreenButton.on('pointerdown', () => {
    fullScreenButton.setTexture('fullscreen-pressed');
  });

  fullScreenButton.on('pointerup', () => {
    fullScreenButton.setTexture('fullscreen');

    if (GameSettings.getInstance().sfx) {
      scene.sound.play('button', { volume: SOUND.SFX });
    }

    if (scene.game.scale.isFullscreen) {
      scene.game.scale.stopFullscreen();
    } else {
      scene.game.scale.startFullscreen();
    }
  });

  return [fullScreenButton, bgmButton, sfxButton];
}
