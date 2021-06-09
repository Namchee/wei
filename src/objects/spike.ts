import Phaser from 'phaser';

import { MAP } from '../utils/theme';

export class Spike extends Phaser.Physics.Arcade.Sprite {
  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'spikes');
    
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    
    this.setImmovable(true);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setSize(MAP.TILE_SIZE, MAP.TILE_SIZE / 2);
    this.setOffset(0, MAP.TILE_SIZE / 2);
  }
}
