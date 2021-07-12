import Phaser from 'phaser';

import { ANIMS, MAP, OBJECTS } from '../utils/const';

export class Mushroom extends Phaser.Physics.Arcade.Sprite {
  private patrolTween!: Phaser.Tweens.Timeline;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'mushroom-idle', 0);
    this.setOrigin(0, 0.5);

    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    scene.add.existing(this);

    this.setImmovable(true);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.body.onWorldBounds = true;

    this.setSize(OBJECTS.MUSHROOMS.WIDTH, OBJECTS.MUSHROOMS.HEIGHT);
    this.setOffset(0, MAP.TILE_SIZE * 0.7);

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
    });
  }

  public setPatrolRoute({ x }: Phaser.Math.Vector2): void {
    const originalX = this.body.x;

    this.patrolTween = this.scene.tweens.timeline({
      targets: this,
      loop: -1,
      loopDelay: OBJECTS.MUSHROOMS.DELAY,
      tweens: [
        {
          x: x,
          duration: OBJECTS.MUSHROOMS.TWEEN,
          onComplete: () => {
            this.anims.play('mushroom-idle');
          },
          onUpdate: () => {
            this.setFlipX(false);
            this.anims.play('mushroom-run', true);
          },
        },
        {
          x: originalX,
          duration: OBJECTS.MUSHROOMS.TWEEN,
          delay: OBJECTS.MUSHROOMS.DELAY,
          onComplete: () => {
            this.anims.play('mushroom-idle');
          },
          onUpdate: () => {
            this.setFlipX(true);
            this.anims.play('mushroom-run', true);
          },
        }
      ],
    });
  }

  public startPatrol(): void {
    if (this.patrolTween.paused) {
      this.patrolTween.resume();
    }
  }

  public stopPatrol(): void {
    if (this.patrolTween.isPlaying()) {
      this.patrolTween.pause();
    }
  }

  public getHit(): void {
    this.anims.play('mushroom-hit', true);
    this.patrolTween.stop();
    this.setVelocityY(-OBJECTS.MUSHROOMS.DEATH);

    const randomizer = Math.random();

    this.scene.tweens.add({
      targets: this,
      angle: randomizer < 0.5 ?
        -OBJECTS.MUSHROOMS.ANGLE :
        OBJECTS.MUSHROOMS.ANGLE,
      duration: OBJECTS.MUSHROOMS.ANGLE_DURATION,
    });

    (this.body as Phaser.Physics.Arcade.Body)
      .setAllowGravity(true);
    (this.body as Phaser.Physics.Arcade.Body)
      .setGravityY(OBJECTS.MUSHROOMS.GRAVITY);
  }

  public remove(): void {
    this.setActive(false);
    this.disableBody(true);
  }
}
