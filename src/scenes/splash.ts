import Phaser from 'phaser';
import { GameSettings } from '../state/setting';

import { Difficulty, MAP, SCENES, TEXT } from '../utils/const';

export class SplashScene extends Phaser.Scene {
  public constructor() {
    super('SplashScene');
  }

  public create(): void {
    const { width, height } = this.game.config;

    const texture = this.add.renderTexture(0, 0, Number(width), Number(height));
    texture.fill(0x121212, 1);

    const title = this.add.text(
      Number(width) / 2,
      Number(height) / 3.5,
      'OBJECTIVE',
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

    const objective = this.add.text(
      Number(width) / 2,
      title.y + MAP.TILE_SIZE * 6,
      TEXT.OBJECTIVE,
      {
        fontFamily: 'Monogram',
        fontSize: '32px',
        wordWrap: { width: 400, useAdvancedWrap: true },
        lineSpacing: 1.125,
        align: 'center',
      },
    )
      .setOrigin(0.5, 0.5);

    const helperTextStyle = {
      fontFamily: 'Monogram',
      fontSize: '24px',
      wordWrap: { width: 400, useAdvancedWrap: true },
      lineSpacing: 1.125,
      align: 'center',
    };

    this.add.text(
      Number(width) / 2 - MAP.TILE_SIZE * 5,
      objective.y + MAP.TILE_SIZE * 8,
      ['HEALTH', `${GameSettings.getInstance().difficulty}`],
      helperTextStyle,
    )
      .setOrigin(0.5, 0.5);

    this.add.text(
      Number(width) / 2 + MAP.TILE_SIZE * 5,
      objective.y + MAP.TILE_SIZE * 8,
      ['DIFFICULTY', `${Difficulty[GameSettings.getInstance().difficulty]}`],
      helperTextStyle,
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
