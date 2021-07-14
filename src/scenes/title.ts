import Phaser from 'phaser';
import { GameSettings } from '../state/setting';
import { GameStorage } from '../state/storage';

import {
  BackgroundManager,
  createBackgroundManager,
} from '../utils/background';
import {
  COLORS,
  Difficulty,
  MAP,
  SCENES,
  SOUND,
  TEXT,
  TITLE,
} from '../utils/const';

import { injectUI } from '../utils/ui';

export class TitleScene extends Phaser.Scene {
  private backgroundManager!: BackgroundManager;

  private playButton!: Phaser.GameObjects.Image;
  private helpButton!: Phaser.GameObjects.Image;
  private uiButtons!: Phaser.GameObjects.Image[];

  private twitterButton!: Phaser.GameObjects.Image;

  private helpOverlay!: Phaser.GameObjects.Group;
  private difficultySelector!: Phaser.GameObjects.Group;

  private difficultyExplanation!: Phaser.GameObjects.Text;

  private readonly difficulties = [
    Difficulty.EASY,
    Difficulty.NORMAL,
    Difficulty.HARD,
  ];
  private selected: number;

  public constructor() {
    super('TitleScene');

    this.selected = 1;
  }

  public create(): void {
    this.initializeBackground();
    this.initializeUi();
    this.initializeBgm();
    this.initializeAbout();
    this.initializeShortcuts();
    this.initializeDifficulty();
    this.listenInputs();
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(this, 'Forest', {
      width: MAP.WIDTH,
      height: MAP.HEIGHT,
    });
  }

  private initializeUi(): void {
    const { width, height } = this.game.config;

    const titleText = this.add
      .text(Number(width) / 2, -Number(height) / 4, 'Wei', {
        fontFamily: 'Matchup Pro',
        fontSize: '128px',
        stroke: 'black',
        strokeThickness: 3.5,
        shadow: {
          offsetX: 0,
          offsetY: 5,
          color: 'black',
          fill: true,
        },
      })
      .setOrigin(0.5, 0.5);

    this.playButton = this.add
      .image(Number(width) / 2, Number(height) / 2, 'play')
      .setOrigin(0.5, 0.5)
      .setScale(2.125, 2.125)
      .setInteractive({ cursor: 'pointer' });

    if (GameStorage.getInstance().highScore) {
      this.add
        .text(
          Number(width) * 0.975,
          Number(height) * 0.95,
          `HIGH SCORE: ${GameStorage.getInstance().highScore}`,
          {
            fontFamily: 'Monogram',
            fontSize: '20px',
          }
        )
        .setOrigin(1, 0.5);
    }

    this.twitterButton = this.add
      .image(Number(width) * 0.05, Number(height) * 0.925, 'twitter')
      .setOrigin(0.5, 0.5)
      .setScale(2.5, 2.5)
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

    this.helpButton = this.add
      .image(
        this.uiButtons[0].x - MAP.TILE_SIZE * 1.5,
        Number(height) * 0.0625,
        'help'
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' });

    this.helpOverlay = this.add.group();
    const overlayBg = this.add.renderTexture(
      0,
      0,
      Number(width),
      Number(height)
    );
    overlayBg.fill(0x121212, 0.85);

    const aboutText = this.add
      .text(Number(width) / 2, Number(height) * 0.1, 'About this game', {
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
      })
      .setOrigin(0.5, 0.5);

    const helpText = this.add
      .text(Number(width) / 2, Number(height) / 2, TEXT.HELP, {
        fontFamily: 'Monogram',
        fontSize: '24px',
        wordWrap: { width: 400, useAdvancedWrap: true },
        lineSpacing: 1.25,
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    const closeButton = this.add
      .image(Number(width) * 0.95, Number(height) * 0.0625, 'close')
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
    this.uiButtons = injectUI(this);

    if (GameSettings.getInstance().bgm) {
      this.sound.play('title', { volume: SOUND.BGM });
    }
  }

  private initializeShortcuts(): void {
    const keys = this.input.keyboard.addKeys('SPACE, ENTER');
    const bg =
      this.helpOverlay.getChildren()[0] as Phaser.GameObjects.RenderTexture;

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
  }

  private initializeDifficulty(): void {
    const { width, height } = this.game.config;
    this.difficultySelector = this.add.group();

    const style = {
      fontSize: '36px',
      fontFamily: 'Monogram',
    };

    const easy = this.add
      .text(
        Number(width) / 2.15,
        Number(height) / 2.25 - MAP.TILE_SIZE / 2,
        'EASY',
        style,
      )
      .setOrigin(0, 0.5);

    const normal = this.add
      .text(
        Number(width) / 2.15,
        // for some reason, perfect spacing is skewed to top, so reduce it a bit
        Number(height) / 1.975,
        'NORMAL',
        style,
      )
      .setOrigin(0, 0.5);

    const hard = this.add
      .text(
        Number(width) / 2.15,
        Number(height) / 1.75 + MAP.TILE_SIZE / 2,
        'HARD',
        {
          ...style,
          color: COLORS.RED[500],
        }
      )
      .setOrigin(0, 0.5);

    this.difficultyExplanation = this.add.text(
      Number(width) / 2,
      Number(height) * 0.925,
      '',
      {
        fontFamily: 'Monogram',
        fontSize: '24px',
        wordWrap: { width: 300, useAdvancedWrap: true },
        align: 'center',
      },
    )
      .setOrigin(0.5, 0.5);

    this.difficultySelector.add(easy);
    this.difficultySelector.add(normal);
    this.difficultySelector.add(hard);
    this.difficultySelector.add(this.difficultyExplanation);

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

    this.twitterButton.on('pointerup', () => {
      window.open(`https://twitter.com/intent/tweet?text=${TEXT.SHARE}`);
    });
  }

  private showHelp(): void {
    this.helpOverlay
      .getChildren()
      .forEach(child => this.children.bringToTop(child));
    this.add.tween({
      targets: this.helpOverlay.getChildren(),
      alpha: 1,
      ease: Phaser.Math.Easing.Sine.Out,
      duration: SCENES.TRANSITION,
    });

    this.playButton.removeInteractive();
    this.helpButton.removeInteractive();
    this.uiButtons.forEach(button => button.removeInteractive());
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
    this.uiButtons.forEach((button: Phaser.GameObjects.Image) =>
      button.setInteractive({ cursor: 'pointer' })
    );
    this.twitterButton.setInteractive({ cursor: 'pointer' });
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

    const up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    const down = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );

    const difficulties = this.difficultySelector.getChildren().slice(
      0,
      this.difficultySelector.getLength() - 1,
    );

    const cursor = this.add
      .image(
        Number(width) / 2.275,
        (
          difficulties[this.selected] as Phaser.GameObjects.Image
        ).y + 5,
        'cursor',
        33
      )
      .setOrigin(0.5, 0.5);

    const resetCursor = () => {
      this.difficultyExplanation.setText(
        (TEXT.DIFFICULTY as Record<string, string>)[
          Difficulty[this.difficulties[this.selected]]
        ],
      );

      cursor.setY(
        (difficulties[this.selected] as Phaser.GameObjects.Image).y + 5
      );
    };

    resetCursor();

    up.on('down', () => {
      this.selected = (this.selected - 1) % this.difficulties.length;

      if (this.selected < 0) {
        this.selected = 0;
      }

      resetCursor();
      GameSettings.getInstance().setDifficulty(
        this.difficulties[this.selected]
      );
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
      GameSettings.getInstance().setDifficulty(
        this.difficulties[this.selected],
      );
      if (GameSettings.getInstance().sfx) {
        this.sound.play('difficulty', { volume: SOUND.SFX });
      }
    });

    this.difficultySelector.getChildren().forEach((obj, idx: number) => {
      obj.setInteractive({ cursor: 'pointer' });

      obj.on('pointerover', () => {
        this.selected = idx;

        resetCursor();
        if (GameSettings.getInstance().sfx) {
          this.sound.play('difficulty', { volume: SOUND.SFX });
        }
      });

      obj.on('pointerdown', () => {
        if (GameSettings.getInstance().sfx) {
          this.sound.play('button', { volume: SOUND.SFX });
        }

        GameSettings.getInstance().setDifficulty(
          this.difficulties[this.selected],
        );

        this.startGame();
      });
    });
  }

  private startGame(): void {
    this.cameras.main.fadeOut(SCENES.TRANSITION, 0, 0, 0);

    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.sound.get('title').stop();
        this.scene.start('SplashScene');
      }
    );
  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
