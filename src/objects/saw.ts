import Phaser from 'phaser';
import { ANIMS, OBJECTS } from '../utils/theme';

export class Saw extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'saw-on', 0);

    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    scene.add.existing(this);

    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.setSize(OBJECTS.SAW.WIDTH, OBJECTS.SAW.HEIGHT);

    this.initializeAnimations();

    this.anims.play('buzzing', true);
  }

  private initializeAnimations(): void {
    this.anims.create({
      key: 'buzzing',
      frames: this.anims.generateFrameNumbers('saw-on', {}),
      frameRate: ANIMS.FPS * 2,
      repeat: -1,
    })
  }
}
