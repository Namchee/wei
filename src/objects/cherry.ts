import Phaser from 'phaser';

import { ANIMS, MAP } from '../utils/const';

export class Cherry extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'cherry');

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);
    
    this.setSize(MAP.TILE_SIZE, MAP.TILE_SIZE);
  
    this.initializeAnimations();
    this.anims.play('cherry-idle');
  }

  private initializeAnimations(): void {
    this.anims.create({
      key: 'cherry-idle',
      frames: this.anims.generateFrameNumbers('cherry', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'collected',
      frames: this.anims.generateFrameNumbers('collected', {}),
      frameRate: ANIMS.FPS,
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
