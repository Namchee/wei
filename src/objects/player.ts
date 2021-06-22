import Phaser from 'phaser';
import { ANIMS, PHYSICS } from '../utils/const';

export enum Movement {
  Left = -1,
  Right = 1
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lives: number;
  private jumpCount: number;
  private invicible: boolean;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialLives: number,
  ) {
    super(scene, x, y, '', 0);

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);

    this.lives = initialLives;
    this.jumpCount = 0;
    this.invicible = false;

    this.initializeAnims();
    this.anims.play('char-idle', true);
  }

  private initializeAnims() {
    this.anims.create({
      key: 'char-idle',
      frames: this.anims.generateFrameNumbers('char-idle', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'char-double-jump',
      frames: this.anims.generateFrameNumbers('char-double-jump', {}),
      frameRate: 24,
    });

    this.anims.create({
      key: 'char-hit',
      frames: this.anims.generateFrameNumbers('char-hit', {}),
      frameRate: ANIMS.FPS,
    });

    this.anims.create({
      key: 'char-run',
      frames: this.anims.generateFrameNumbers('char-run', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'char-jump',
      frames: this.anims.generateFrameNumbers('char-jump', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.anims.create({
      key: 'char-fall',
      frames: this.anims.generateFrameNumbers('char-fall', {}),
      frameRate: ANIMS.FPS,
      repeat: -1,
    });

    this.on('animationcomplete', (animation: Phaser.Animations.Animation) => {
      if (animation.key === 'char-double-jump') {
        this.anims.play('char-fall', true);
      }
    });
  }

  public update(): void {
    super.update();

    const { y } = this.body.velocity;

    if (y > 0) {
      this.anims.play('char-fall', true);
      return;
    }

    if (!this.body.velocity.y) {
      this.jumpCount = 0;
    }
  }

  public get isInvicible(): boolean {
    return this.invicible;
  }

  public get isAlive(): boolean {
    return this.lives > 0;
  }

  public get getLives(): number {
    return this.lives;
  }

  public decrementLives(): void {
    this.lives--;
  }

  public move(dir: Movement): void {
    if (this.body.enable) {
      const { x, y } = this.body.velocity;

      if (x && !y) {
        this.anims.play('char-run', true);
      }

      const flip = dir === Movement.Left;
      const mult = dir === Movement.Left ? -1 : 1;

      this.setFlipX(flip);
      this.setVelocityX(mult * PHYSICS.MOVEMENT);
    }
  }

  public jump(): void {
    if (this.jumpCount >= 2) {
      return;
    }

    this.jumpCount++;

    const multiplier = this.jumpCount === 2 ? .9 : 1;
    const animKey = this.jumpCount === 2 ? 'char-double-jump' : 'char-jump';

    this.setVelocityY(-PHYSICS.JUMP * multiplier);
    this.anims.play(animKey, true);
  }

  public idle(): void {
    this.setVelocityX(0);

    if (!this.body.velocity.y) {
      this.anims.play('char-idle', true);
    }
  }

  public hitMushroom(): void {
    this.setVelocityY(-PHYSICS.MUSHROOM);
  }

  public getHit(): Promise<void> {
    return new Promise((resolve) => {
      this.anims.play('char-hit', true);
      this.setVelocityY(-PHYSICS.HIT_BACK.Y);

      this.invicible = true;

      this.scene.add.tween({
        targets: this,
        duration: PHYSICS.HIT_BACK.DURATION,
        x: `${this.flipX ? '+' : '-'}=${PHYSICS.HIT_BACK.X}`,
      });

      this.scene.add.tween({
        targets: this,
        duration: PHYSICS.INVICIBILITY.DURATION,
        alpha: 0,
        yoyo: true,
        repeat: PHYSICS.INVICIBILITY.PERIOD,
        onComplete: () => {
          this.invicible = false;
          return resolve();
        },
      });
    });
  }
}
