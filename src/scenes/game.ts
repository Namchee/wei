import Phaser from 'phaser';
import { CloudManager } from '../utils/cloud';

import theme from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  private background!: Phaser.GameObjects.RenderTexture;
  private environment!: Phaser.GameObjects.Group;
  private playa!: Phaser.GameObjects.Sprite;
  private cloud!: Phaser.GameObjects.TileSprite;
  private cliff!: Phaser.GameObjects.TileSprite;

  // private bgManager!: CloudManager;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();

    this.keys = this.input.keyboard.createCursorKeys();
    this.playa = this.add.sprite(0, 0, 'char');

    this.cameras.main.startFollow(this.playa);
  }

  public update() {
    const cam = this.cameras.main;
    this.physics.world.bounds.setPosition(this.playa.x, this.playa.y);

    if (this.keys.right.isDown) {
      this.playa.x += 5;
      this.cloud.tilePositionX += 0.5;
      this.cliff.tilePositionX += 1;
    } else if (this.keys.left.isDown) { 
      this.playa.x -= 5;
      this.cloud.tilePositionX -= 0.5;
      this.cliff.tilePositionX -= 1;
      
    }
  }

  private initializeBackground(): void {
    const { width, height } = this.game.config;

    this.add.tileSprite(0, 0, Number(width) * 2, Number(height) * 2, 'sky')
      .setScrollFactor(0);
    this.cloud = this.add.tileSprite(0, Number(height) - 200, Number(width), 176, 'cloud')
      .setDisplayOrigin(0, 1)
      .setScrollFactor(0);
    this.cliff = this.add.tileSprite(0, 0, Number(width), 176, 'cliff')
      .setOrigin(0, -1.2)  
      .setScrollFactor(0);
    /*
    // background color
    this.background = this.add.renderTexture(0, 0, Number(width), Number(height))
      .setScrollFactor(0);
    this.background.setAlpha(1);
    this.background.fill(theme.COLORS.BLUE[400]);

    /*
    this.bgManager = CloudManager.initialize(this);

    /*
    // initialize the clouds
    this.environment = this.add.group();

    this.environment.addMultiple(
      [
        this.add.image(Number(width) * .3, Number(height) * .33, 'cloud1')
          .setScrollFactor(0.5),
        this.add.image(Number(width) * .85, Number(height) * .25, 'cloud2')
          .setScrollFactor(0.65),
        this.add.image(Number(width) * .7, Number(height) * .1, 'cloud3')
          .setScrollFactor(0.85),
      ],
    );
    */
  }
}
