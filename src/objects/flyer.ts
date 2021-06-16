import Phaser from 'phaser';

import { ANIMS, MAP, OBJECTS } from '../utils/theme';
export class Flyer extends Phaser.Physics.Arcade.Sprite {
  private idleTween!: Phaser.Tweens.Tween;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, '');

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (this.body as Phaser.Physics.Arcade.Body).setAllowDrag(false);

    this.setBodySize(OBJECTS.FLYER.WIDTH, OBJECTS.FLYER.HEIGHT);
    this.setOffset(0, 10);

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
      y: '+=7.5',
      duration: 1500,
      repeat: -1,
      yoyo: true,
      ease: Phaser.Math.Easing.Quadratic.InOut,
    });
  }

  public getHit(): void {

  }
}
