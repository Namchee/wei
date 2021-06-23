import Phaser, { HEADLESS } from 'phaser';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { MAP } from '../utils/const';

export class TitleScene extends Phaser.Scene {
  private sfx!: boolean;

  private backgroundManager!: BackgroundManager;

  private playButton!: Phaser.GameObjects.Image;
  private helpButton!: Phaser.GameObjects.Image;
  private sfxButton!: Phaser.GameObjects.Image;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.scene.bringToTop();
    this.sfx = true;

    const { width, height } = this.game.config;

    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: Number(width), height: Number(height) },
    );

    const titleText = this.add.text(
      Number(width) / 2,
      -Number(height) / 4,
      'Wei',
      {
        fontFamily: 'Matchup Pro',
        fontSize: '96px',
        stroke: 'black',
        strokeThickness: 3.5,
        shadow: {
          offsetX: 0,
          offsetY: 5,
          color: 'black',
          fill: true,
        },
      }
    ).setOrigin(0.5, 0.5);

    this.playButton = this.add.image(
      Number(width) / 2,
      Number(height) / 2,
      'play',
    )
      .setOrigin(0.5, 0.5)
      .setScale(2.125, 2.125)
      .setInteractive({ cursor: 'pointer' });

    this.helpButton = this.add.image(
      Number(width) * 0.9,
      Number(height) * 0.05,
      'help'
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.sfxButton = this.add.image(
      Number(width) * 0.9125 + MAP.TILE_SIZE,
      Number(height) * 0.05,
      'sfx-on'
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.add.text(
      Number(width) * 0.675,
      Number(height) * 0.925,
      'Made in 2021 by Namchee',
      {
        fontFamily: 'Monogram',
        fontSize: '20px',
      },
    )

    this.tweens.add({
      targets: titleText,
      y: Number(height) / 4,
      duration: 1250,
      ease: Phaser.Math.Easing.Cubic.Out,
    });

    this.listenInputs();
  }

  private listenInputs(): void {
    this.helpButton.on('pointerdown', () => {
      this.helpButton.setTexture('help-pressed');
    });

    this.helpButton.on('pointerup', () => {
      this.helpButton.setTexture('help');
    });

    this.playButton.on('pointerdown', () => {
      this.playButton.setTexture('play-pressed');
    });

    this.playButton.on('pointerup', () => {
      this.playButton.setTexture('play');
    });

    this.sfxButton.on('pointerdown', () => {
      this.sfxButton.setTexture(`sfx-${this.sfx ? 'on' : 'off'}-pressed`);
    });

    this.sfxButton.on('pointerup', () => {
      this.sfx = !this.sfx;
      this.sfxButton.setTexture(`sfx-${this.sfx ? 'on' : 'off'}`);
    });
  }

  private showHelp(): void {

  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
