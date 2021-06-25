import Phaser from 'phaser';
import { SCENES, TEXT } from '../utils/const';

export class ResultScene extends Phaser.Scene {
  private playerLives!: number;
  private allCherry!: boolean;

  public constructor() {
    super('ResultScene');
  }

  public init(data: any): void {
    this.playerLives = data.lives as number;
    this.allCherry = data.allCherry as boolean;
  }

  public create(): void {
    const { width, height } = this.game.config;

    const group = this.add.group();

    const background = this.add.renderTexture(0, 0, Number(width), Number(height));
    background.fill(0x121212, 0.85);

    const titleText = this.add.text(
      Number(width) / 2,
      Number(height) / 3,
      this.playerLives ? TEXT.WIN.TITLE : TEXT.LOSE.TITLE,
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

    const description = !this.playerLives ?
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
        fontSize: '22px',
        wordWrap: { width: 400, useAdvancedWrap: true },
      }
    ).setOrigin(0.5, 0.5);

    group.add(titleText);
    group.add(descText);
    group.add(background);

    group.setAlpha(0);

    this.tweens.add({
      targets: group.getChildren(),
      alpha: 1,
      duration: SCENES.TRANSITION,
    });
  }
}
