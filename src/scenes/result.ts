import Phaser from 'phaser';
import { MAP, SCENES, TEXT } from '../utils/const';

export class ResultScene extends Phaser.Scene {
  private isAlive!: boolean;
  private allCherry!: boolean;

  private homeButton!: Phaser.GameObjects.Image;
  private retryButton!: Phaser.GameObjects.Image;

  public constructor() {
    super('ResultScene');
  }

  public init(data: any): void {
    this.isAlive = data.isAlive as boolean;
    this.allCherry = data.allCherry as boolean;
  }

  public create(): void {
    this.scene.bringToTop();
  
    const { width, height } = this.game.config;

    const group = this.add.group();

    const background = this.add.renderTexture(0, 0, Number(width), Number(height));
    background.fill(0x121212, 0.85);

    const titleText = this.add.text(
      Number(width) / 2,
      Number(height) / (this.isAlive ? 4 : 3),
      this.isAlive ? TEXT.WIN.TITLE : TEXT.LOSE.TITLE,
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
    )
      .setOrigin(0.5, 0.5);

    console.log(this.allCherry);

    const description = !this.isAlive ?
      TEXT.LOSE.DESC :
      this.allCherry ?
        TEXT.WIN.FULL :
        TEXT.WIN.PARTIAL;

    const descText = this.add.text(
      Number(width) / 2,
      Number(height) / 2,
      description,
      {
        fontFamily: 'Monogram',
        fontSize: '24px',
        wordWrap: { width: 400, useAdvancedWrap: true },
      }
    ).setOrigin(0.5, 0.5);

    this.homeButton = this.add.image(
      Number(width) / 2 - MAP.TILE_SIZE * 1.5,
      Number(height) / (this.isAlive ? 1.25 : 1.55),
      'home'
    )
      .setOrigin(0.5, 0.5)
      .setScale(1.5, 1.5)
      .setInteractive({ cursor: 'pointer' });

    this.retryButton = this.add.image(
      Number(width) / 2 + MAP.TILE_SIZE * 1.5,
      Number(height) / (this.isAlive ? 1.25 : 1.55),
      'retry'
    )
      .setOrigin(0.5, 0.5)
      .setScale(1.5, 1.5)
      .setInteractive({ cursor: 'pointer' });

    this.listenInputs();

    group.add(titleText);
    group.add(descText);
    group.add(background);
    group.add(this.homeButton);
    group.add(this.retryButton);

    group.setAlpha(0);

    this.tweens.add({
      targets: group.getChildren(),
      alpha: 1,
      duration: SCENES.TRANSITION,
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
}
