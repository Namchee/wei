import Phaser, { HEADLESS } from 'phaser';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { HELP_TEXT, MAP } from '../utils/const';

export class TitleScene extends Phaser.Scene {
  private sfx!: boolean;
  private bgm!: boolean;

  private backgroundManager!: BackgroundManager;

  private playButton!: Phaser.GameObjects.Image;
  private helpButton!: Phaser.GameObjects.Image;
  private bgmButton!: Phaser.GameObjects.Image;
  private sfxButton!: Phaser.GameObjects.Image;

  private helpOverlay!: Phaser.GameObjects.Group;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.sfx = true;
    this.bgm = true;

    this.initializeBackground();
    this.initializeUi();
    this.initializeAbout();

    this.listenInputs();
  }

  private initializeBackground(): void {
    const { width, height } = this.game.config;

    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: Number(width), height: Number(height) },
    );
  }

  private initializeUi(): void {
    const { width, height } = this.game.config;

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
      Number(width) * 0.8875 - MAP.TILE_SIZE,
      Number(height) * 0.05,
      'help'
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.bgmButton = this.add.image(
      Number(width) * 0.9,
      Number(height) * 0.05,
      'bgm-on',
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
    );

    this.tweens.add({
      targets: titleText,
      y: Number(height) / 4,
      duration: 1250,
      ease: Phaser.Math.Easing.Cubic.Out,
    });

  }

  private initializeAbout(): void {
    const { width, height } = this.game.config;

    this.helpOverlay = this.add.group();
    const overlayBg = this.add.renderTexture(
      0,
      0,
      Number(width),
      Number(height),
    );
    overlayBg.fill(0x121212, 0.9);

    const aboutText = this.add.text(
      Number(width) / 2,
      Number(height) * 0.1,
      'About this game',
      {
        fontFamily: 'Matchup Pro',
        fontSize: '36px',
        stroke: 'black',
        strokeThickness: 3.5,
        shadow: {
          offsetX: 0,
          offsetY: 5,
          color: 'black',
          fill: true,
        },
      },
    ).setOrigin(0.5, 0.5);

    const helpText = this.add.text(
      Number(width) / 2,
      Number(height) / 2,
      HELP_TEXT,
      {
        fontFamily: 'Monogram',
        fontSize: '22px',
        wordWrap: { width: 400, useAdvancedWrap: true },
      }
    ).setOrigin(0.5, 0.5);

    const closeButton = this.add.image(
      Number(width) * 0.95,
      Number(height) * 0.05,
      'close',
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    closeButton.on('pointerdown', () => {
      closeButton.setTexture('close-pressed');
    });

    closeButton.on('pointerup', () => {
      closeButton.setTexture('close');
      this.hideHelp();
    });

    this.helpOverlay.add(overlayBg);
    this.helpOverlay.add(aboutText);
    this.helpOverlay.add(helpText);
    this.helpOverlay.add(closeButton);

    this.helpOverlay.setAlpha(0);
  }

  private listenInputs(): void {
    this.helpButton.on('pointerdown', () => {
      this.helpButton.setTexture('help-pressed');
    });

    this.helpButton.on('pointerup', () => {
      this.helpButton.setTexture('help');
      this.showHelp();
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

    this.bgmButton.on('pointerdown', () => {
      this.bgmButton.setTexture(`bgm-${this.bgm ? 'on' : 'off'}-pressed`);
    });

    this.sfxButton.on('pointerup', () => {
      this.bgm = !this.bgm;
      this.bgmButton.setTexture(`bgm-${this.bgm ? 'on' : 'off'}`);
    });
  }

  private showHelp(): void {
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 1,
      duration: 250,
      ease: Phaser.Math.Easing.Sine.Out,
    });

    this.playButton.removeInteractive();
    this.helpButton.removeInteractive();
    this.sfxButton.removeInteractive();
  }

  private hideHelp(): void {
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 0,
      duration: 250,
      ease: Phaser.Math.Easing.Sine.Out,
    });

    this.playButton.setInteractive({ cursor: 'pointer' });
    this.helpButton.setInteractive({ cursor: 'pointer' });
    this.sfxButton.setInteractive({ cursor: 'pointer' });
  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
