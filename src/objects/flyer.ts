import Phaser from 'phaser';

export class Flyer extends Phaser.Physics.Arcade.Sprite {
  private constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, '');
  }

  public static initialize(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ): void {
    const flyer = new Flyer(scene, x, y);
  }
}
