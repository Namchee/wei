import Phaser from 'phaser';

import { COLORS, MAP, SCENES, SCORE } from '../utils/const';

export class PauseScene extends Phaser.Scene {
  private components!: Phaser.GameObjects.Group;

  private blinkingTween!: Phaser.Tweens.Tween;

  public constructor() {
    super('PauseScene');
  }

  public create(): void {
    const { width, height } = this.game.config;
    this.components = this.add.group();

    const texture = this.add.renderTexture(
      0,
      0,
      Number(width),
      Number(height),
    );
    texture.fill(COLORS.GRAY[900], 0.9);

    const titleText = this.add.text(
      Number(width) / 2,
      Number(height) / 3,
      'PAUSED',
      {
        fontFamily: 'Matchup Pro',
        fontSize: '36px',
        stroke: 'black',
        align: 'center',
        strokeThickness: 3.5,
        shadow: {
          offsetX: 0,
          offsetY: 5,
          color: 'black',
          fill: true,
        },
      },
    )
      .setOrigin(0.5, 0.5);

    const flashingText = this.add.text(
      Number(width) / 2,
      titleText.y + MAP.TILE_SIZE * 3,
      'Click anywhere to continue',
      {
        fontFamily: 'Monogram',
        fontSize: '24px',
        align: 'center',
      },
    );

    this.components.add(titleText);
    this.components.add(flashingText);

    this.components.setAlpha(0);

    this.blinkingTween = this.tweens.create({
      targets: flashingText,
      alpha: 0,
      yoyo: true,
      duration: SCORE.HIGH_SCORE_BLINK.DURATION,
      repeat: -1,
    });

    this.initializeHooks();
    this.listenInputs();
  }

  private initializeHooks(): void {
    this.events.on('pause', () => {
      this.blinkingTween.pause();
    
      this.tweens.add({
        targets: this.components.getChildren(),
        alpha: 0,
        duration: SCENES.RESULT,
      });

      this.scene.sendToBack('PauseScene');
    });

    this.events.on('resume', () => {
      this.scene.bringToTop('PauseScene');

      this.tweens.add({
        targets: this.components.getChildren(),
        alpha: 1,
        duration: SCENES.RESULT,
        onComplete: () => {
          this.blinkingTween.isPaused() ?
            this.blinkingTween.resume() :
            this.blinkingTween.play();
        }
      });
    });
  }

  private listenInputs(): void {
    this.input.on('pointerdown', () => {
      this.scene.pause();
      this.scene.resume('GameScene');
    });
  }
}
