import Phaser from 'phaser';
import { ANIMS, Difficulty, PHYSICS } from '../utils/theme';

export enum Movement {
  Left = -1,
  Right = 1
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lives: number;
  private jumpCount: number;
  
  private constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string,
    initialLives: number,
  ) {
    super(scene, x, y, key);
    this.setOrigin(0, 0);

    scene.add.existing(this);
    scene.physics.world.enableBody(this);

    this.lives = initialLives;
    this.jumpCount = 0;

    this.setPosition(x - this.displayWidth, y - this.displayHeight);
  }

  public static initialize(
    scene: Phaser.Scene,
    difficulty: Difficulty,
    startingPoint: { x: number, y: number } = { x: 0, y: 0 },
  ): Player {
    const player = new Player(
      scene,
      startingPoint.x,
      startingPoint.y,
      'char-idle',
      difficulty,
    );

    player.initializeAnims();
    player.anims.play('char-idle');

    return player;
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
      frameRate: ANIMS.FPS,
      repeat: 0,
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
  }

  public update(): void {
    if (this.body.velocity.y > 0) {
      if (this.texture.key !== 'char-fall') {
        this.setTexture('char-fall');
      }
    } else if (this.body.velocity.y < 0) {
      if (this.texture.key !== 'char-jump') {
        this.setTexture('char-jump');
      }
    } else {
      this.jumpCount = 0;

      if (this.body.velocity.x) {
        this.anims.play('char-run', true);
      } else {
        this.anims.play('char-idle', true);
      }
    }
  }

  public move(dir: Movement): void {
    if (this.body.enable) {
      if (this.body.velocity.y !== 0) {
        this.anims.play('char-run', true);
      }

      if (dir === Movement.Left) {
        this.setFlipX(true);
        this.setVelocityX(-PHYSICS.MOVEMENT);
      } else {
        this.setFlipX(false);
        this.setVelocityX(PHYSICS.MOVEMENT);
      }
    }
  }

  public jump(): void {
    if (this.jumpCount >= 2) {
      return;
    }

    this.jumpCount++;
    
    if (this.jumpCount > 1) {
      this.anims.play('char-double-jump');
      this.setVelocityY(-PHYSICS.JUMP * .9);

      console.log('this');
    } else {
      this.setVelocityY(-PHYSICS.JUMP);
    }
  }

  public idle(): void {
    this.setVelocityX(0);
    this.anims.play('char-idle', true);
  }

  public decrementLives(): void {
    this.lives--;
  }

  public isAlive(): boolean {
    return this.lives > 0;
  }

  public getLives(): number {
    return this.lives;
  }
}
