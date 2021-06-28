import Phaser from 'phaser';

import theme from '../utils/const';

const BASE_FRAME = { frameWidth: 32, frameHeight: 32 };
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

    progressBox.fillStyle(theme.COLORS.GRAY[600], 0.75);
    progressBox.fillRect(width / 4, height / 2.375, width / 2, height / 10);

    const loadingText = this.add.text(
      Number(width) / 2,
      Number(height) / 3,
      'Loading Game',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '36px',
      },
    );

    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(
      Number(width) / 2,
      Number(height) / 2.135,
      '0%',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '24px',
      },
    );

    percentText.setOrigin(0.5, 0.5);

    const assetText = this.add.text(
      Number(width) / 2,
      Number(height) / 1.8,
      '',
      {
        fontFamily: 'Monogram, Consolas, "Courier New"',
        fontSize: '18px',
      },
    );

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: string) => {
      percentText.setText(`${(Number(value) * 100).toFixed(2)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xF4F4F5, 0.25);
      progressBar.fillRect(
        width / 3.825,
        height / 2.275,
        Number(value) * width * 0.7 * 0.6875,
        height / 15,
      );
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText(`Loaded ${file.key}`);
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

          this.scene.start('TitleScene');
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
    this.load.spritesheet('char-idle', 'char/idle.png', BASE_FRAME);
    this.load.spritesheet('char-double-jump', 'char/double-jump.png', BASE_FRAME);
    this.load.spritesheet('char-hit', 'char/hit.png', BASE_FRAME);
    this.load.spritesheet('char-run', 'char/run.png', BASE_FRAME);
    this.load.spritesheet('char-jump', 'char/jump.png', BASE_FRAME);
    this.load.spritesheet('char-fall', 'char/fall.png', BASE_FRAME);

    // load terrain asset
    this.load.image('terrain', 'terrain/terrain.png');
    this.load.image('spikes', 'platforms/spikes.png');
    this.load.tilemapTiledJSON('world', 'tilemap/wei.json');

    // load collectibles
    this.load.spritesheet('cherry', 'collectibles/cherry.png', BASE_FRAME);
    this.load.spritesheet('collected', 'collectibles/collected.png', BASE_FRAME);

    // load flyers
    this.load.spritesheet('flyers', 'platforms/flyers.png', { frameWidth: 32, frameHeight: 10 });

    // load saw
    this.load.spritesheet('saw-off', 'enemies/saw/off.png', { frameWidth: 38, frameHeight: 38 });
    this.load.spritesheet('saw-on', 'enemies/saw/on.png', { frameWidth: 38, frameHeight: 38 });

    // load mushroom
    this.load.spritesheet('mushroom-idle', 'enemies/mushroom/idle.png', BASE_FRAME);
    this.load.spritesheet('mushroom-run', 'enemies/mushroom/run.png', BASE_FRAME);
    this.load.spritesheet('mushroom-hit', 'enemies/mushroom/hit.png', BASE_FRAME);

    // load trophy
    this.load.spritesheet('trophy-idle', 'checkpoint/idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('trophy-hit', 'checkpoint/hit.png', { frameWidth: 64, frameHeight: 64 });

    // load buttons
    this.load.image('play', 'buttons/play.png');
    this.load.image('play-pressed', 'buttons/play-pressed.png');
    this.load.image('help', 'buttons/help.png');
    this.load.image('help-pressed', 'buttons/help-pressed.png');
    this.load.image('back', 'buttons/back.png');
    this.load.image('back-pressed', 'buttons/back-pressed.png');
    this.load.image('sfx-on', 'buttons/sfx-on.png');
    this.load.image('sfx-on-pressed', 'buttons/sfx-on-pressed.png');
    this.load.image('sfx-off', 'buttons/sfx-off.png');
    this.load.image('sfx-off-pressed', 'buttons/sfx-off-pressed.png');
    this.load.image('bgm-on', 'buttons/bgm-on.png');
    this.load.image('bgm-on-pressed', 'buttons/bgm-on-pressed.png');
    this.load.image('bgm-off', 'buttons/bgm-off.png');
    this.load.image('bgm-off-pressed', 'buttons/bgm-off-pressed.png');
    this.load.image('close', 'buttons/close.png');
    this.load.image('close-pressed', 'buttons/close-pressed.png');
    this.load.image('home', 'buttons/home.png');
    this.load.image('home-pressed', 'buttons/home-pressed.png');
    this.load.image('retry', 'buttons/retry.png');
    this.load.image('retry-pressed', 'buttons/retry-pressed.png');
    this.load.image('twitter', 'buttons/twitter.png');

    // load bgm
    this.load.audio('title', 'bgm/title.mp3');
    this.load.audio('game', 'bgm/game.mp3');

    // load sfx
    this.load.audio('button', 'sfx/button.wav');
    this.load.audio('hit', 'sfx/hit.wav');
    this.load.audio('jump', 'sfx/jump.wav');
    this.load.audio('fruit', 'sfx/fruit.wav');
    this.load.audio('enemy', 'sfx/enemy.wav');
    this.load.audio('trophy', 'sfx/trophy.wav');
    this.load.audio('lose', 'sfx/lose.wav');
    this.load.audio('win', 'sfx/win.wav');

    // load fx
    this.load.image('dust', 'fx/dust.png');
  }
}
