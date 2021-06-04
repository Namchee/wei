import Phaser from 'phaser';

import theme from '../utils/theme';

export class PreloaderScene extends Phaser.Scene {
  public constructor() {
    super('PreloaderScene');
  }

  public preload() {
    this.initPreloader();
    this.loadAssets();
  }

  private initPreloader() {
    const { width, height } = this.cameras.main;

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(theme.COLORS.GRAY[600], 0.8);
    progressBox.fillRect(width / 7, 220, width * 0.75, 40);

    const loadingText = this.add.text(
      Number(width) / 2,
      Number(height) / 2 - 50,
      'Loading...',
      {
        fontFamily: 'Consolas, "Courier New"',
        fontSize: '24px',
      },
    );

    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(
      Number(width) / 2,
      Number(height) / 2,
      '0%',
      {
        fontFamily: 'Consolas, "Courier New"',
        fontSize: '18px',
      },
    );

    percentText.setOrigin(0.5, 0.5);

    const assetText = this.add.text(
      Number(width) / 2,
      Number(height) / 2 + 40,
      '',
      {
        fontFamily: 'Consolas, "Courier New"',
        fontSize: '16px',
      },
    );

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: string) => {
      percentText.setText(`${(Number(value) * 100).toFixed(2)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xF4F4F5, 0.25);
      progressBar.fillRect(width / 6, 227.5, Number(value) * width * 0.7, 25);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      this.tweens.add({
        targets: [progressBar, progressBox, loadingText, percentText, assetText],
        alpha: 0,
        duration: 250,
        onComplete: () => {
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
          percentText.destroy();
          assetText.destroy();

          this.scene.sendToBack();

          this.scene.start('GameScene');
        },
      });
    });
  }

  private loadAssets() {
    // load background assets
    this.load.image('cloud', 'background/cloud.png');
    this.load.image('cliff', 'background/cliff.png');
    this.load.image('ground', 'background/ground.png');

    // load main character assets
    this.load.spritesheet(
      'char-idle',
      'char/idle.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'char-double-jump',
      'char/double-jump.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'char-hit',
      'char/hit.png',
      { frameWidth: 32, frameHeight: 32 },
    );
    this.load.spritesheet(
      'char-run',
      'char/run.png',
      { frameWidth: 32, frameHeight: 32 },
    )
    this.load.image('char-jump', 'char/jump.png');
    this.load.image('char-fall', 'char/fall.png');
  }
}
