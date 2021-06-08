import Phaser from 'phaser';

export class Spike extends Phaser.GameObjects.GameObject {
  public constructor(
    scene: Phaser.Scene,
  ) {
    super(scene, 'sprite');
  }
}
