import Phaser from 'phaser';

import { ANIMS, MAP, OBJECTS } from '../utils/theme';
export class Flyer extends Phaser.GameObjects.Sprite {
  private origX: number;
  private origY: number;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, '');

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    this.setSize(OBJECTS.FLYER.WIDTH, OBJECTS.FLYER.HEIGHT);
    this.initializeAnimations();

    this.anims.play('flying', true);

    this.origX = x;
    this.origY = y;

    (this.body as Phaser.Physics.Arcade.Body).setAccelerationY(-OBJECTS.FLYER.OSCILATE);
  }

  public static initialize(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ): Flyer {
    const flyer = new Flyer(scene, x, y);

    return flyer;
  }

  private initializeAnimations(): void {
    this.anims.create({
      key: 'flying',
      frames: this.anims.generateFrameNumbers('flyers', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });
  }

  public update(): void {
    super.update();

    this.oscilate();
  }

  private oscilate(): void {
    if (this.y - this.origY <= -OBJECTS.FLYER.LIM) {
      (this.body as Phaser.Physics.Arcade.Body).setAccelerationY(OBJECTS.FLYER.OSCILATE);
    } else if (this.y - this.origY >= OBJECTS.FLYER.LIM) {
      (this.body as Phaser.Physics.Arcade.Body).setAccelerationY(-OBJECTS.FLYER.OSCILATE);
    }
  }
}
