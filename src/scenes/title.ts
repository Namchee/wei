import Phaser, { Game } from 'phaser';
import { GameSettings } from '../state/setting';
import { GameStorage } from '../state/storage';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty, MAP, SCENES, SOUND, TEXT, TITLE } from '../utils/const';

export class TitleScene extends Phaser.Scene {
  private backgroundManager!: BackgroundManager;

  private playButton!: Phaser.GameObjects.Image;
  private helpButton!: Phaser.GameObjects.Image;
  private bgmButton!: Phaser.GameObjects.Image;
  private sfxButton!: Phaser.GameObjects.Image;

  private twitterButton!: Phaser.GameObjects.Image;

  private titleBgm!: Phaser.Sound.BaseSound;

  private helpOverlay!: Phaser.GameObjects.Group;
  private difficultySelector!: Phaser.GameObjects.Group;

  private readonly difficulties = [Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD];
  private selected: number;

  public constructor() {
    super('TitleScene');
    
    this.selected = 1;
  }

  public create(): void {
    this.initializeBackground();
    this.initializeUi();
    this.initializeAbout();
    this.initializeBgm();
    this.initializeShortcuts();
    this.initializeDifficulty();

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
      Number(height) * 0.075,
      'help'
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.bgmButton = this.add.image(
      Number(width) * 0.9,
      Number(height) * 0.075,
      'bgm-on',
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.sfxButton = this.add.image(
      Number(width) * 0.9125 + MAP.TILE_SIZE,
      Number(height) * 0.075,
      'sfx-on'
    )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    if (GameStorage.getInstance().highScore) {
      this.add.text(
        Number(width) * 0.95,
        Number(height) * 0.95,
        `HIGH SCORE: ${GameStorage.getInstance().highScore}`,
        {
          fontFamily: 'Monogram',
          fontSize: '20px',
        },
      )
      .setOrigin(1, 0.5);
    }

    this.twitterButton = this.add.image(
      Number(width) * 0.05,
      Number(height) * 0.925,
      'twitter',
    )
      .setOrigin(0.5, 0.5)
      .setScale(0.065, 0.065)
      .setInteractive({ cursor: 'pointer' });

    this.tweens.add({
      targets: titleText,
      y: Number(height) / 4.25,
      duration: TITLE.DURATION,
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
    overlayBg.fill(0x121212, 0.85);

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
      TEXT.HELP,
      {
        fontFamily: 'Monogram',
        fontSize: '22px',
        wordWrap: { width: 400, useAdvancedWrap: true },
        lineHeight: 1.25,
        align: 'center',
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
      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }

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
      this.titleBgm.play({ loop: true });
    }
  }

  private initializeShortcuts(): void {
    const keys = this.input.keyboard.addKeys('SPACE, ENTER');
    const helpShortcut = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.H,
    );
    const bg = this.helpOverlay.getChildren()[0] as Phaser.GameObjects.RenderTexture;

    Object.values(keys).forEach((key: Phaser.Input.Keyboard.Key) => {
      key.on('down', () => {
        if (bg.alpha) {
          return;
        }

        if (this.playButton.alpha) {
          this.playButton.setTexture('play-pressed');
        }
      });

      const listener = key.on('up', () => {
        if (bg.alpha) {
          return;
        }

        if (GameSettings.getInstance().sfx) {
          this.sound.play('button', { volume: SOUND.SFX });
        }

        if (this.playButton.alpha) {
          this.playButton.setTexture('play');
          this.playButton.removeInteractive();
          this.showDifficultyScreen();
        } else {
          this.startGame();
          listener.removeListener('up');
        }
      });
    });

    helpShortcut.on('down', () => {
      this.helpButton.setTexture('help-pressed');
    });

    helpShortcut.on('up', () => {
      this.helpButton.setTexture('help');
    
      bg.alpha ?
        this.hideHelp() :
        this.showHelp();

      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }
    });
  }

  private initializeDifficulty(): void {
    const { width, height } = this.game.config;
    this.difficultySelector = this.add.group();
  
    const easy = this.add.text(
      Number(width) / 2.15,
      Number(height) / 2.25 - MAP.TILE_SIZE / 2,
      'EASY',
      {
        fontSize: '32px',
        fontFamily: 'Monogram',
      },
    )
      .setOrigin(0, 0.5);

    const normal = this.add.text(
      Number(width) / 2.15,
      // for some reason, perfect spacing is skewed to top, so reduced it a bit
      Number(height) / 1.975,
      'NORMAL',
      {
        fontSize: '32px',
        fontFamily: 'Monogram',
      },
    )
      .setOrigin(0, 0.5);

    const hard = this.add.text(
      Number(width) / 2.15,
      Number(height) / 1.75 + MAP.TILE_SIZE / 2,
      'HARD',
      {
        fontSize: '32px',
        fontFamily: 'Monogram',
      },
    )
      .setOrigin(0, 0.5);

    this.difficultySelector.add(easy);
    this.difficultySelector.add(normal);
    this.difficultySelector.add(hard);

    this.difficultySelector.setAlpha(0);
  }

  private listenInputs(): void {
    this.helpButton.on('pointerdown', () => {
      this.helpButton.setTexture('help-pressed');
    });

    this.helpButton.on('pointerup', () => {
      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }

      this.helpButton.setTexture('help');
      this.showHelp();
    });

    this.playButton.on('pointerdown', () => {
      this.playButton.setTexture('play-pressed');
    });

    this.playButton.on('pointerup', () => {
      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }

      this.playButton.setTexture('play');
      this.showDifficultyScreen();
    });

    this.sfxButton.on('pointerdown', () => {
      this.sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}-pressed`);
    });

    this.sfxButton.on('pointerup', () => {
      GameSettings.getInstance().toggleSfx();
      this.sfxButton.setTexture(`sfx-${GameSettings.getInstance().sfx ? 'on' : 'off'}`);

      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }
    });

    this.bgmButton.on('pointerdown', () => {
      this.bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}-pressed`);
    });

    this.bgmButton.on('pointerup', () => {
      this.toggleBgm();
      this.bgmButton.setTexture(`bgm-${GameSettings.getInstance().bgm ? 'on' : 'off'}`);

      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }
    });

    this.twitterButton.on('pointerup', () => {
      window.open(`https://twitter.com/intent/tweet?text=${TEXT.SHARE}`);
    });
  }

  private showHelp(): void {
    this.helpOverlay.getChildren().forEach((child) => this.children.bringToTop(child));
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 1,
      ease: Phaser.Math.Easing.Sine.Out,
      duration: SCENES.TRANSITION,
    });

    this.playButton.removeInteractive();
    this.helpButton.removeInteractive();
    this.bgmButton.removeInteractive();
    this.sfxButton.removeInteractive();
    this.twitterButton.removeInteractive();
  }

  private hideHelp(): void {
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 0,
      ease: Phaser.Math.Easing.Sine.Out,
      duration: SCENES.TRANSITION,
    });

    this.playButton.setInteractive({ cursor: 'pointer' });
    this.helpButton.setInteractive({ cursor: 'pointer' });
    this.bgmButton.setInteractive({ cursor: 'pointer' });
    this.sfxButton.setInteractive({ cursor: 'pointer' });
    this.twitterButton.setInteractive({ cursor: 'pointer' });
  }

  private toggleBgm(): void {
    GameSettings.getInstance().toggleBgm();

    GameSettings.getInstance().bgm ?
      this.titleBgm.play({ loop: true }) :
      this.titleBgm.pause();
  }

  private showDifficultyScreen(): void {
    const menuTimeline = this.tweens.timeline({
      tweens: [
        {
          targets: this.playButton,
          alpha: 0,
          duration: SCENES.TRANSITION,
          ease: Phaser.Math.Easing.Quadratic.Out,
        },
        {
          targets: this.difficultySelector.getChildren(),
          alpha: 1,
          duration: SCENES.TRANSITION,
          ease: Phaser.Math.Easing.Quadratic.Out,
        },
      ],
    });

    menuTimeline.on(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
      this.enableDifficultySelection();
    });
  }

  private enableDifficultySelection(): void {
    const { width } = this.game.config;

    const up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP,
    );

    const down = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN,
    );

    const cursor = this.add.image(
      Number(width) / 2.275,
      (this.difficultySelector.getChildren()[this.selected] as Phaser.GameObjects.Image).y + 5,
      'cursor',
      33,
    )
      .setOrigin(0.5, 0.5);

    const buttons = this.difficultySelector.getChildren();

    const resetCursor = () => {
      cursor.setY(
        (buttons[this.selected] as Phaser.GameObjects.Image).y + 5,
      );
    };

    up.on('down', () => {
      this.selected = (this.selected - 1) % this.difficulties.length;

      if (this.selected < 0) {
        this.selected = 0;
      }

      resetCursor();
      GameSettings.getInstance().setDifficulty(this.difficulties[this.selected]);
      if (GameSettings.getInstance().sfx) {
        this.sound.play('difficulty', { volume: SOUND.SFX });
      }
    });

    down.on('down', () => {
      this.selected++;

      if (this.selected >= this.difficulties.length) {
        this.selected = this.difficulties.length - 1;
      }

      resetCursor();
      GameSettings.getInstance().setDifficulty(this.difficulties[this.selected]);
      if (GameSettings.getInstance().sfx) {
        this.sound.play('difficulty', { volume: SOUND.SFX });
      }
    });

    this.difficultySelector.getChildren().forEach((obj, idx: number) => {
      obj.setInteractive({ cursor: 'pointer' });

      obj.on('pointerover', () => {
        this.selected = idx;
    
        resetCursor();
        GameSettings.getInstance().setDifficulty(this.difficulties[this.selected]);
        if (GameSettings.getInstance().sfx) {
          this.sound.play('difficulty', { volume: SOUND.SFX });
        }
      });

      obj.on('pointerdown', () => {
        if (GameSettings.getInstance().sfx) {
          this.sound.play('button', { volume: SOUND.SFX });
        }

        this.startGame();
      })
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(SCENES.TRANSITION, 0, 0, 0);

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.titleBgm.pause();
      this.scene.start('SplashScene');
    });
  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
