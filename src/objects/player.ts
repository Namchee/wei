import Phaser from 'phaser';
import { Difficulty, PHYSICS } from '../utils/theme';

export enum Movement {
  Left = -1,
  Right = 1
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  private lives: number;
  
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
  }

  public static initialize(
    scene: Phaser.Scene,
    difficulty: Difficulty,
    startingPoint: { x: number, y: number } = { x: 0, y: 0 },
  ): Player {
    const player = new Player(scene, 0, 0, 'char', difficulty);

    player.setCollideWorldBounds(true); 
    player.initializePosition(startingPoint);
    player.initializeAnims();
    player.anims.play('char-idle');

    return player;
  }

  private initializePosition(
    position: { x: number, y: number } = { x: 0, y: 0 },
  ): void {
    if (position.x) {
      this.setPosition(position.x - this.displayWidth);
    }

    if (position.y) {
      this.setPosition(this.x, position.y - this.displayHeight);
    }
  }

  private initializeAnims() {
    this.anims.create({
      key: 'char-idle',
      frames: this.anims.generateFrameNumbers('char-idle', {}),
      frameRate: 20,
      repeat: -1,
    });

    this.anims.create({
      key: 'char-double-jump',
      frames: this.anims.generateFrameNumbers('char-double-jump', {}),
      frameRate: 20,
    });

    this.anims.create({
      key: 'char-hit',
      frames: this.anims.generateFrameNumbers('char-hit', {}),
      frameRate: 20,
    });

    this.anims.create({
      key: 'char-run',
      frames: this.anims.generateFrameNumbers('char-run', {}),
      frameRate: 20,
    });
  }

  public move(dir: Movement): void {
    if (this.body.enable) {
      this.anims.play('char-run', true);

      if (dir === Movement.Left) {
        this.setFlipX(true);
        this.setVelocityX(-PHYSICS.MOVEMENT);
      } else {
        this.setFlipX(false);
        this.setVelocityX(PHYSICS.MOVEMENT);
      }
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
