import Phaser from 'phaser';

import { MAP } from '../utils/const';

export class Spike extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'spikes');

    scene.add.existing(this);
    scene.physics.world.enable(this, Phaser.Physics.Arcade.STATIC_BODY);

    this.setSize(MAP.TILE_SIZE, MAP.TILE_SIZE / 2);
    this.setOffset(0, MAP.TILE_SIZE / 2);
  }
}
