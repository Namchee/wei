import Phaser from 'phaser';

import { ANIMS, MAP, OBJECTS } from '../utils/theme';
export class Flyer extends Phaser.Physics.Arcade.Sprite {
  private isTouched!: boolean;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, '');

    scene.add.existing(this);
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setSize(OBJECTS.FLYER.WIDTH, OBJECTS.FLYER.HEIGHT);

    this.initializeAnimations();
    this.isTouched = false;

    this.anims.play('flying', true);
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
}
