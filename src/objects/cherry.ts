import Phaser from 'phaser';

import { MAP } from '../utils/theme';

export class Cherry extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'cherry');

    scene.add.existing(this);
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);
    
    this.setSize(MAP.TILE_SIZE, MAP.TILE_SIZE);
  
    this.initializeAnimations();
    this.anims.play('cherry-idle');
  }

  private initializeAnimations(): void {
    this.anims.create({
      key: 'cherry-idle',
      frames: this.anims.generateFrameNumbers('cherry', {}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'collected',
      frames: this.anims.generateFrameNumbers('collected', {}),
      frameRate: 20,
    });
  }

  public collect() {
    this.anims.play('collected');
    this.body.destroy();

    this.once('animationcomplete', () => {
      this.setAlpha(0);
      this.setActive(false);
    });
  }
}
