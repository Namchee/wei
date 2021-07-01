import Phaser from 'phaser';

import { Difficulty, MAP, SCENES } from '../utils/const';

export class SplashScene extends Phaser.Scene {
  private difficulty!: Difficulty;

  public constructor() {
    super('SplashScene');
  }

  public init(data: any): void {
    this.difficulty = data.difficulty as Difficulty;
  }

  public create(): void {  
    const { width, height } = this.game.config;
  
    const texture = this.add.renderTexture(0, 0, Number(width), Number(height));
    texture.fill(0x121212, 1);

    this.add.text(
      Number(width) / 2,
      Number(height) / 3.5,
      'World 1 - 1',
      {
        fontFamily: 'Monogram',
        fontSize: '36px',
      }
    )
      .setOrigin(0.5, 0.5);

    this.add.image(
      Number(width) / 2 - MAP.TILE_SIZE * 2,
      Number(height) / 2.125,
      'char-idle',
      0,
    )
      .setScale(1.275, 1.275)
      .setOrigin(0.5, 0.5);

    this.add.text(
      Number(width) / 2 + MAP.TILE_SIZE,
      Number(height) / 2.125,
      `x ${this.difficulty}`,
      {
        fontFamily: 'Monogram',
        fontSize: '32px',
      },
    )
      .setOrigin(0.5, 0.5);

    this.setTimer();
  }

  public setTimer(): void {
    this.time.delayedCall(SCENES.SPLASH, () => {
      this.scene.start('GameScene');
    });
  }
}
