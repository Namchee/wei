import Phaser, { HEADLESS } from 'phaser';

import { BackgroundManager, createBackgroundManager } from '../utils/background';

export class TitleScene extends Phaser.Scene {
  private sfx!: boolean;

  private backgroundManager!: BackgroundManager;

  private titleText!: Phaser.GameObjects.Text;

  public constructor() {
    super('TitleScene');
  }

  public create(): void {
    this.scene.bringToTop();
    this.sfx = true;

    const { width, height } = this.game.config;

    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: Number(width), height: Number(height) },
    );

    this.titleText = this.add.text(
      Number(width) / 2,
      Number(height) / 5,
      'Wei',
      {
        fontFamily: 'Matchup Pro',
        fontSize: '72px',
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
  }

  public update(): void {
    this.backgroundManager.idle();
  }
}
