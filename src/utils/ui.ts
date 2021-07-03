import Phaser from 'phaser';

import { GameSettings } from '../state/setting';
import { TitleScene } from '../scenes/title';

import { MAP, SOUND } from './const';

export function injectSoundController(
  scene: Phaser.Scene,
): Phaser.GameObjects.Image[] {
  const { width, height } = scene.game.config;

  const bgmButton = scene.add.image(
    Number(width) * 0.9,
    Number(height) * 0.075,
    'bgm-on',
  )
    .setOrigin(0.5, 0.5)
    .setInteractive({ cursor: 'pointer' });

  const sfxButton = scene.add.image(
    Number(width) * 0.9125 + MAP.TILE_SIZE,
    Number(height) * 0.075,
    'sfx-on'
  )
    .setOrigin(0.5, 0.5)
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

    if (GameSettings.getInstance().bgm) {
      bgm.resume();
    } else {
      bgm.pause();
    }

    if (GameSettings.getInstance().sfx) {
      scene.sound.play('button', { volume: SOUND.SFX });
    }
  });

  return [bgmButton, sfxButton];
}
