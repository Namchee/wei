import Phaser from 'phaser';

import { GameResult } from '../state/result';
import { GameSettings } from '../state/setting';
import { GameStorage } from '../state/storage';
import { COLORS, MAP, SCENES, SCORE, SOUND, TEXT } from '../utils/const';

export class ResultScene extends Phaser.Scene {
  private result!: GameResult;

  private homeButton!: Phaser.GameObjects.Image;
  private retryButton!: Phaser.GameObjects.Image;

  private scoreNotification!: Phaser.GameObjects.Text;

  public constructor() {
    super('ResultScene');
  }

  public init(data: any): void {
    this.result = data.result as GameResult;
  }

  public create(): void {
    this.scene.bringToTop();
  
    const { width, height } = this.game.config;

    const group = this.add.group();

    const background = this.add.renderTexture(0, 0, Number(width), Number(height));
    background.fill(COLORS.GRAY[900], 0.9);

    const titleText = this.add.text(
      Number(width) / 2,
      Number(height) / 4,
      this.result.lives ? TEXT.WIN.TITLE : TEXT.LOSE.TITLE,
      {
        fontFamily: 'Matchup Pro',
        fontSize: '48px',
        stroke: 'black',
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

    const score = this.calculateScore();

    const scoreText = this.add.text(
      Number(width) / 2,
      titleText.y + MAP.TILE_SIZE * 5,
      this.result.lives ? ['SCORE', `${score}`] : TEXT.LOSE.DESC,
      {
        fontFamily: 'Monogram',
        fontSize: this.result.lives ? '36px': '24px',
        wordWrap: { width: 400, useAdvancedWrap: true },
        align: 'center',
      }
    )
      .setOrigin(0.5, 0.5);

    if (this.result.lives && GameStorage.getInstance().highScore < score) {
      this.scoreNotification = this.add.text(
        Number(width) / 2,
        scoreText.y + MAP.TILE_SIZE * 4,
        'HIGH SCORE!',
        {
          fontFamily: 'Monogram',
          fontSize: '24px',
          wordWrap: { width: 300, useAdvancedWrap: true },
          align: 'center',
        },
      )
        .setOrigin(0.5, 0.5);

      this.blinkHighScore();
      GameStorage.getInstance().setHighScore(score);
    }

    this.homeButton = this.add.image(
      Number(width) / 2 - MAP.TILE_SIZE * 1.5,
      (this.scoreNotification ? this.scoreNotification.y : scoreText.y) + MAP.TILE_SIZE * 5,
      'home',
    )
      .setOrigin(0.5, 0.5)
      .setScale(1.5, 1.5)
      .setInteractive({ cursor: 'pointer' });

    this.retryButton = this.add.image(
      Number(width) / 2 + MAP.TILE_SIZE * 1.5,
      (this.scoreNotification ? this.scoreNotification.y : scoreText.y) + MAP.TILE_SIZE * 5,
      'retry',
    )
      .setOrigin(0.5, 0.5)
      .setScale(1.5, 1.5)
      .setInteractive({ cursor: 'pointer' });

    this.listenInputs();

    group.add(titleText);
    group.add(scoreText);
    group.add(background);
    group.add(this.homeButton);
    group.add(this.retryButton);

    group.setAlpha(0);

    this.tweens.add({
      targets: group.getChildren(),
      alpha: 1,
      duration: SCENES.RESULT,
      onComplete: () => {
        if (GameSettings.getInstance().sfx) {
          this.sound.play(this.result.lives ? 'win' : 'lose', { volume: SOUND.SFX });
        }    
      },
    });
  }

  private listenInputs(): void {
    this.homeButton.on('pointerdown', () => {
      this.homeButton.setTexture('home-pressed');
    });

    this.homeButton.on('pointerup', () => {
      this.homeButton.setTexture('home');
      this.scene.start('TitleScene');
      this.scene.stop('GameScene');
    });

    this.retryButton.on('pointerdown', () => {
      this.retryButton.setTexture('retry-pressed');
    });

    this.retryButton.on('pointerup', () => {
      this.retryButton.setTexture('retry');
      this.scene.start('SplashScene');
      this.scene.stop('GameScene');
    });
  }

  private calculateScore(): number {
    let baseScore = (SCORE.LIVES * this.result.lives +
      SCORE.CHERRY * this.result.cherries +
      Math.floor(SCORE.TIME * this.result.time));

    Object.entries(SCORE.DIFFICULTY).forEach((val) => {
      if (Number(val[0]) === this.result.difficulty) {
        baseScore *= Number(val[1]);
      }
    });

    return Math.ceil(baseScore);
  }

  private blinkHighScore(): void {
    this.tweens.add({
      targets: this.scoreNotification,
      alpha: 0,
      yoyo: true,
      duration: SCORE.HIGH_SCORE_BLINK.DURATION,
      repeat: -1,
    });
  }
}
