import Phaser from 'phaser';

import { Player } from '../objects/player';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty } from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  private backgroundManager!: BackgroundManager;
  private player!: Player;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeWorld();
    this.initializeBackground();
    
    const { height } = this.game.config;

    this.keys = this.input.keyboard.createCursorKeys();
    this.player = Player.initialize(
      this,
      Difficulty.NORMAL,
      { x: this.map.tileWidth * 3, y: Number(height) - this.map.tileHeight },
    );
    
    this.initializeCamera();
  }

  public update() {
    if (this.keys.up.isDown) {
      this.player.y -= 1;
    }

    if (this.keys.right.isDown) {
      this.player.x += 3.5;
      this.backgroundManager.scrollLeft();
    } else if (this.keys.left.isDown) { 
      this.player.x -= 3.5;
      this.backgroundManager.scrollRight();
    } else {
      this.backgroundManager.idle();
    }
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: this.map.widthInPixels, height: this.map.heightInPixels },
    );
  }

  private initializeCamera(): void {
    const { width, height } = this.game.config;
  
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setFollowOffset(
      0,
      Number(height) / 2 - this.player.displayHeight * 1.1,
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      Number(height),
    );
  }

  private initializeWorld() {
    this.map = this.make.tilemap({ key: 'world' });
    this.map.addTilesetImage('terrain', 'terrain');
    this.map.addTilesetImage('spikes', 'spikes');

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels,
    );

    this.map.createLayer('Terrain', 'terrain', 0, 0);
  }
}
