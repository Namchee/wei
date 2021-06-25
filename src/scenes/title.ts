import Phaser from 'phaser';
import { GameSettings } from '../state/settings';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { HELP_TEXT, MAP, SOUND } from '../utils/const';

export class TitleScene extends Phaser.Scene {
  private backgroundManager!: BackgroundManager;

  private playButton!: Phaser.GameObjects.Image;
  private helpButton!: Phaser.GameObjects.Image;
  private bgmButton!: Phaser.GameObjects.Image;
  private sfxButton!: Phaser.GameObjects.Image;

  private titleBgm!: Phaser.Sound.BaseSound;

  private helpOverlay!: Phaser.GameObjects.Group;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.initializeBackground();
    this.initializeUi();
    this.initializeAbout();
    this.initializeBgm();
    this.initializeShortcuts();

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

  private initializeBgm(): void {
    this.titleBgm = this.sound.add('title', { volume: SOUND.BGM });

    if (GameSettings.getInstance().bgm) {
      this.titleBgm.play();
    }
  }

  private initializeShortcuts(): void {
    const keys = this.input.keyboard.addKeys('SPACE, ENTER');

    Object.values(keys).forEach((key: Phaser.Input.Keyboard.Key) => {
      key.on('down', () => {
        if (this.helpOverlay.getChildren()[0].alpha) {
          return;
        }

        this.playButton.setTexture('play-pressed');
      });

      key.on('up', () => {
        if (this.helpOverlay.getChildren()[0].alpha) {
          return;
        }
  
        this.playButton.setTexture('play');
        this.startGame();
      });
    });
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
      this.sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}-pressed`);
    });

    this.sfxButton.on('pointerup', () => {
      GameSettings.getInstance().toggleSfx();
      this.sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}`);
    });

    this.bgmButton.on('pointerdown', () => {
      this.bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}-pressed`);
    });

    this.bgmButton.on('pointerup', () => {
      this.toggleBgm();
      this.bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}`);
    });
  }

  private showHelp(): void {
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 1,
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
      ease: Phaser.Math.Easing.Sine.Out,
    });

    this.playButton.setInteractive({ cursor: 'pointer' });
    this.helpButton.setInteractive({ cursor: 'pointer' });
    this.sfxButton.setInteractive({ cursor: 'pointer' });
  }

  private toggleBgm(): void {
    GameSettings.getInstance().toggleBgm();

    GameSettings.getInstance().bgm ?
      this.titleBgm.play() :
      this.titleBgm.pause();
  }

  private startGame(): void {
    // TODO: isi
  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
