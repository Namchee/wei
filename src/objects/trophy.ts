import Phaser from 'phaser';

import { ANIMS, OBJECTS } from '../utils/const';

export class Trophy extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number
  ) {
    super(scene, x, y, 'trophy-idle', 0);

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setImmovable(true);

    this.initializeAnimations();
    this.anims.play('trophy-idle', true);
  }

  private initializeAnimations(): void {
    this.anims.create({
      key: 'trophy-idle',
      frames: this.anims.generateFrameNumbers('trophy-idle', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'trophy-hit',
      frames: this.anims.generateFrameNumbers('trophy-hit', {}),
      frameRate: ANIMS.FPS,
    });
  }

  public collect(): void {
    this.anims.play('trophy-hit', true);

    this.scene.add.tween({
      targets: this,
      alpha: 0,
      duration: OBJECTS.TROPHY.DURATION,
    });
  }
}
