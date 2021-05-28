import Phaser from 'phaser';

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

    progressBox.fillStyle(0x313131, 0.8);
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

          // start your scene here
        },
      });
    });
  }

  private loadAssets() {
    // load your assets here
  }
}
