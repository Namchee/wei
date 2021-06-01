import Phaser from 'phaser';

import { BackgroundManager, createBackgroundManager } from '../utils/background';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  private backgroundManager!: BackgroundManager;
  private player!: Phaser.Physics.Arcade.Sprite;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();

    this.keys = this.input.keyboard.createCursorKeys();
    this.player = this.physics.add.sprite(0, Number(this.scene.scene.game.config.height) - 48, 'char');
    this.player.setOrigin(0, 0);
    this.player.setCollideWorldBounds(true);
    
    this.initializeCamera();
  }

  public update() {
    if (this.keys.right.isDown) {
      this.player.x += 3.5;
      this.backgroundManager.scrollLeft();
    } else if (this.keys.left.isDown) { 
      this.player.x -= 3.5;
      this.backgroundManager.scrollRight();
    } else {
      this.backgroundManager.idle();
    }
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(this, 'Forest');
  }

  private initializeCamera(): void {
    const { width, height } = this.game.config;
  
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(
      0,
      Number(height) / 2 - this.player.displayHeight * 1.1,
    );
    this.cameras.main.setBounds(0, 0, Number(width) * 1.5, Number(height));
  }
}
