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
  private titleText!: Phaser.GameObjects.Text;
  private contentText!: Phaser.GameObjects.Group;

  private contentTransition!: Phaser.Tweens.Timeline;

  public constructor() {
    super('ResultScene');
  }

  public init(data: Record<string, any>): void {
    this.result = data.result as GameResult;
  }

  public create(): void {
    this.scene.bringToTop();

    const { width, height } = this.game.config;

    const group = this.add.group();

    const background = this.add.renderTexture(
      0,
      0,
      Number(width),
      Number(height)
    );
    background.fill(COLORS.GRAY[900], 0.9);

    this.titleText = this.add
      .text(
        Number(width) / 2,
        Number(height) / 6,
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
        }
      )
      .setOrigin(0.5, 0.5);

    this.contentText = this.add.group();

    if (this.result.lives) {
      this.showWinResult();
    } else {
      this.showLoseResult();
    }

    this.contentText.setAlpha(0);

    const contentChildren = this.contentText.getChildren();
    const lastItem = contentChildren[
      contentChildren.length - 1
    ] as Phaser.GameObjects.Text;

    this.homeButton = this.add
      .image(
        Number(width) / 2 - MAP.TILE_SIZE * 1.5,
        lastItem.y + MAP.TILE_SIZE * (this.result.lives ? 2.5 : 6),
        'home'
      )
      .setOrigin(0.5, 0.5)
      .setScale(1.25, 1.25)
      .setInteractive({ cursor: 'pointer' });

    this.retryButton = this.add
      .image(
        Number(width) / 2 + MAP.TILE_SIZE * 1.5,
        lastItem.y + MAP.TILE_SIZE * (this.result.lives ? 2.5 : 6),
        'retry'
      )
      .setOrigin(0.5, 0.5)
      .setScale(1.25, 1.25)
      .setInteractive({ cursor: 'pointer' });

    this.listenInputs();

    group.add(background);
    group.add(this.titleText);
    group.add(this.homeButton);
    group.add(this.retryButton);

    group.setAlpha(0);

    this.tweens.add({
      targets: group.getChildren(),
      alpha: 1,
      duration: SCENES.RESULT,
      onComplete: () => {
        if (GameSettings.getInstance().sfx) {
          this.sound.play(this.result.lives ? 'win' : 'lose', {
            volume: SOUND.SFX,
          });
        }

        this.tweens.add({
          targets: this.contentText.getChildren(),
          alpha: 1,
          duration: SCENES.TRANSITION,
          ease: Phaser.Math.Easing.Quadratic.Out,
          onComplete: () => {
            this.blinkHighScore();
          },
        });
      },
    });
  }

  private showWinResult(): void {
    const { width } = this.game.config;

    const scoreTitleText = this.add
      .text(
        Number(width) / 2,
        this.titleText.y + MAP.TILE_SIZE * 3.5,
        'YOUR SCORE',
        {
          fontFamily: 'Matchup Pro',
          fontSize: '24px',
          stroke: 'black',
          strokeThickness: 3.5,
          shadow: {
            offsetX: 0,
            offsetY: 5,
            color: 'black',
            fill: true,
          },
        }
      )
      .setOrigin(0.5, 0.5);

    const style = {
      fontFamily: 'Monogram',
      fontSize: '24px',
      wordWrap: { width: 400, useAdvancedWrap: true },
      align: 'center',
    };

    const cherryText = this.add
      .text(
        Number(width) / 3,
        scoreTitleText.y + MAP.TILE_SIZE * 2,
        'CHERRY SCORE',
        style
      )
      .setOrigin(0, 0.5);

    const cherryScore = this.add
      .text(
        (Number(width) * 2) / 3,
        cherryText.y,
        `${this.result.cherries * SCORE.CHERRY}`,
        style
      )
      .setOrigin(1, 0.5);

    const livesText = this.add
      .text(
        Number(width) / 3,
        cherryText.y + MAP.TILE_SIZE * 1.5,
        'LIVES BONUS',
        style
      )
      .setOrigin(0, 0.5);

    const livesScore = this.add
      .text(
        (Number(width) * 2) / 3,
        livesText.y,
        `${this.result.lives * SCORE.LIVES}`,
        style
      )
      .setOrigin(1, 0.5);

    const timeText = this.add
      .text(
        Number(width) / 3,
        livesText.y + MAP.TILE_SIZE * 1.5,
        `TIME BONUS`,
        style
      )
      .setOrigin(0, 0.5);

    const timeScore = this.add
      .text(
        (Number(width) * 2) / 3,
        timeText.y,
        `${this.result.time * SCORE.TIME}`,
        style
      )
      .setOrigin(1, 0.5);

    const difficultyText = this.add
      .text(
        Number(width) / 3,
        timeText.y + MAP.TILE_SIZE * 1.5,
        `DIFFICULTY BONUS`,
        style
      )
      .setOrigin(0, 0.5);

    const difficultyScore = this.add
      .text(
        (Number(width) * 2) / 3,
        difficultyText.y,
        `x ${this.result.difficulty}`,
        style
      )
      .setOrigin(1, 0.5);

    const score = this.calculateScore();

    const scoreText = this.add
      .text(
        Number(width) / 2,
        difficultyScore.y + MAP.TILE_SIZE * 2.5,
        `${score}`,
        {
          fontFamily: 'Monogram',
          fontSize: '48px',
          align: 'center',
        }
      )
      .setOrigin(0.5, 0.5);

    this.contentText.add(scoreTitleText);
    this.contentText.add(cherryText);
    this.contentText.add(cherryScore);
    this.contentText.add(livesText);
    this.contentText.add(livesScore);
    this.contentText.add(timeText);
    this.contentText.add(timeScore);
    this.contentText.add(difficultyText);
    this.contentText.add(difficultyScore);
    this.contentText.add(scoreText);

    if (GameStorage.getInstance().highScore < score || score > 0) {
      this.scoreNotification = this.add
        .text(
          Number(width) / 2,
          scoreText.y + MAP.TILE_SIZE * 2,
          'HIGH SCORE!',
          style
        )
        .setOrigin(0.5, 0.5);

      GameStorage.getInstance().setHighScore(score);
      this.contentText.add(this.scoreNotification);
    }
  }

  private showLoseResult(): void {
    const { width } = this.game.config;

    const loseText = this.add
      .text(
        Number(width) / 2,
        this.titleText.y + MAP.TILE_SIZE * 7,
        TEXT.LOSE.DESC,
        {
          fontFamily: 'Monogram',
          fontSize: '32px',
          align: 'center',
          wordWrap: { width: 400, useAdvancedWrap: true },
        }
      )
      .setOrigin(0.5, 0.5);

    this.contentText.add(loseText);
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
    let baseScore =
      SCORE.LIVES * this.result.lives +
      SCORE.CHERRY * this.result.cherries +
      Math.floor(SCORE.TIME * this.result.time);

    Object.entries(SCORE.DIFFICULTY).forEach((val) => {
      if (Number(val[0]) === this.result.difficulty) {
        baseScore *= Number(val[1]);
      }
    });

    return Math.ceil(baseScore);
  }

  private blinkHighScore(): void {
    if (this.scoreNotification) {
      this.tweens.add({
        targets: this.scoreNotification,
        alpha: 0,
        yoyo: true,
        duration: SCORE.HIGH_SCORE_BLINK.DURATION,
        repeat: -1,
      });
    }
  }
}
