import Phaser from 'phaser';

import { GameSettings } from '../state/setting';
import { ANIMS, MAP, PHYSICS, SOUND } from '../utils/const';

export enum Movement {
  Left = -1,
  Right = 1
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private _lives: number;
  private jumpCount: number;
  private invicible: boolean;

  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialLives: number,
  ) {
    super(scene, x, y, '', 0);

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;

    this._lives = initialLives;
    this.jumpCount = 0;
    this.invicible = false;

    this.initializeAnims();
    this.initializeParticles();
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

  private initializeParticles(): void {
    const dustParticle = this.scene.add.particles('dust');

    this.dustEmitter = dustParticle.createEmitter({
      quantity: 1,
      lifespan: 1,
      delay: 5,
      scale: { start: 0.5, end: 0 },
      gravityY: -5,
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
    return this._lives > 0;
  }

  public get lives(): number {
    return this._lives;
  }

  public decrementLives(): void {
    this._lives--;
  }

  public die(): void {
    this._lives = 0;

    this.setActive(false);
    this.disableBody(true);
  }

  public move(dir: Movement): void {
    if (this.body.enable) {
      const { x, y } = this.body.velocity;

      if (x && !y) {
        this.anims.play('char-run', true);
        this.dustEmitter.emitParticleAt(
          this.flipX ? this.body.x + this.body.width : this.body.x + MAP.TILE_SIZE / 3,
          this.body.y + this.body.height
        );
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
    
    if (GameSettings.getInstance().sfx) {
      this.scene.sound.play('jump', { volume: SOUND.SFX });
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

  public ragdoll(): void {
    this.anims.play('char-hit', true);
    this.setVelocityY(-PHYSICS.DIE.GRAVITY);

    this.scene.tweens.add({
      targets: this,
      angle: this.flipX ? -PHYSICS.DIE.ANGLE : PHYSICS.DIE.ANGLE,
      duration: PHYSICS.DIE.DURATION,
    });
  }

  public get isBounded(): boolean {
    return this.body.blocked.left || this.body.blocked.right;
  }
}
