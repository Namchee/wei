import Phaser from 'phaser';
import { loadAssets } from '../utils/assets';

import theme from '../utils/const';
export class PreloaderScene extends Phaser.Scene {
  public constructor() {
    super('PreloaderScene');
  }

  public preload(): void {
    this.initPreloader();
    this.loadAssets();
  }

  private initPreloader() {
    const { width, height } = this.cameras.main;

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(theme.COLORS.GRAY[600], 0.75);
    progressBox.fillRect(width / 4, height / 2.375, width / 2, height / 10);

    const loadingText = this.add.text(
      Number(width) / 2,
      Number(height) / 3,
      'Loading Game',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '36px',
      }
    );

    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(
      Number(width) / 2,
      Number(height) / 2.135,
      '0%',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '24px',
      }
    );

    percentText.setOrigin(0.5, 0.5);

    const assetText = this.add.text(
      Number(width) / 2,
      Number(height) / 1.8,
      '',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '18px',
      }
    );

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: string) => {
      percentText.setText(`${(Number(value) * 100).toFixed(2)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xf4f4f5, 0.25);
      progressBar.fillRect(
        width / 3.825,
        height / 2.275,
        Number(value) * width * 0.4775,
        height / 15
      );
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText(`Loaded ${file.key}`);
    });

    this.load.on('complete', () => {
      this.tweens.add({
        targets: [
          progressBar,
          progressBox,
          loadingText,
          percentText,
          assetText,
        ],
        alpha: 0,
        duration: 250,
        onComplete: () => {
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
          percentText.destroy();
          assetText.destroy();

          this.scene.start('TitleScene');
        },
      });
    });
  }

  private loadAssets(): void {
    loadAssets(this);
  }
}
