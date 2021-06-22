import Phaser from 'phaser';
import { ANIMS, OBJECTS } from '../utils/const';

export class Saw extends Phaser.Physics.Arcade.Sprite {
  private patrolTween!: Phaser.Tweens.Tween;

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
    });
  }

  public setPatrolRoute({ x, y }: Phaser.Math.Vector2): void {
    this.patrolTween = this.scene.add.tween({
      targets: this,
      x: x,
      y: y,
      yoyo: true,
      repeat: -1,
      repeatDelay: OBJECTS.SAW.DELAY,
      hold: OBJECTS.SAW.DELAY,
      duration: OBJECTS.SAW.TWEEN,
    });
  }

  public startPatrol(): void {
    this.patrolTween.resume();
  }

  public stopPatrol(): void {
    this.patrolTween.pause();
  }
}
