import Phaser from 'phaser';

import { ANIMS, MAP } from '../utils/theme';

export class Mushroom extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'mushroom-idle', 0);

    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    scene.add.existing(this);

    this.setOrigin(0.5, 1);

    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.setSize(MAP.TILE_SIZE * 2, MAP.TILE_SIZE * 2);

    this.initalizeAnimations();

    this.anims.play('mushroom-idle');
  }

  private initalizeAnimations(): void {
    this.anims.create({
      key: 'mushroom-idle',
      frames: this.anims.generateFrameNumbers('mushroom-idle', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'mushroom-run',
      frames: this.anims.generateFrameNumbers('mushroom-run', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'mushroom-hit',
      frames: this.anims.generateFrameNumbers('mushroom-hit', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });
  }

  public setPatrolRoute({ x, y }: Phaser.Math.Vector2): void {
    this.scene.add.tween({
      targets: this,
      x: x,
      y: y,
      yoyo: true,
      repeat: -1,
      repeatDelay: 2500,
      hold: 2500,
      duration: 5000,
    });
  }
}
