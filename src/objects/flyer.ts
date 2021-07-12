import Phaser from 'phaser';

import { ANIMS, OBJECTS } from '../utils/const';
export class Flyer extends Phaser.Physics.Arcade.Sprite {
  private idleTween!: Phaser.Tweens.Tween;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, '');

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.body.onWorldBounds = true;

    this.setBodySize(OBJECTS.FLYER.WIDTH, OBJECTS.FLYER.HEIGHT);
    this.setOffset(0, 0);

    this.initializeAnimations();
    this.initializeTween();

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

  private initializeTween(): void {
    this.idleTween = this.scene.add.tween({
      targets: this,
      y: `+=${OBJECTS.FLYER.OSCILATE}`,
      duration: OBJECTS.FLYER.TIMER,
      repeat: -1,
      yoyo: true,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    });
  }

  public getHit(): Promise<void> {
    // stop the default idle tween
    return new Promise((resolve) => {
      const dropEvent = this.scene.time.addEvent({
        delay: 500,
        repeat: 0,
        callback: () => {
          this.idleTween.stop();
          (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(true);
          this.setGravityY(OBJECTS.FLYER.GRAVITY);
          resolve();
          this.scene.time.removeEvent(dropEvent);
        },
      })
    });
  }

  public remove(): void {
    this.setActive(false);
    this.disableBody(true);
  }
}
