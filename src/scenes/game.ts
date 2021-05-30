import Phaser from 'phaser';

import { BackgroundManager, createBackgroundManager } from '../utils/background';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  private backgroundManager!: BackgroundManager;
  private player!: Phaser.GameObjects.Sprite;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();

    this.keys = this.input.keyboard.createCursorKeys();
    this.player = this.add.sprite(0, Number(this.scene.scene.game.config.height) - 48, 'char');
    this.player.setOrigin(0, 0);
    this.cameras.main.setFollowOffset(0, 300)
  }

  public update() {
    this.physics.world.bounds.setPosition(this.player.x, this.player.y);

    if (this.keys.right.isDown) {
      this.player.x += 2.5;
      this.backgroundManager.scrollLeft();
    } else if (this.keys.left.isDown) { 
      this.player.x -= 2.5;
      this.backgroundManager.scrollRight();
    } else {
      this.backgroundManager.idle();
    }
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(this, 'Forest');
  }
}
