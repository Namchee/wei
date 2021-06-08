import { spawn } from 'child_process';
import Phaser from 'phaser';

import { Player } from '../objects/player';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty, MAP } from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  private backgroundManager!: BackgroundManager;
  private player!: Player;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();
    this.initializeWorld();
    this.initializePlayer();
    this.initializeCamera();

    this.keys = this.input.keyboard.createCursorKeys();
  }

  public update() {
    // temporary tester code
    if (this.keys.up.isDown) {
      this.player.y -= 10;
    }

    if (this.keys.down.isDown) {
      this.player.y += 10;
    }

    if (this.keys.right.isDown) {
      this.player.x += 1.75;
      this.backgroundManager.scrollRight();
    } else if (this.keys.left.isDown) { 
      this.player.x -= 1.75;
      this.backgroundManager.scrollLeft();
    } else {
      this.backgroundManager.idle();
    }
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: MAP.WIDTH, height: MAP.HEIGHT },
    );
  }

  private initializePlayer(): void {
    const spawnPoint = {
      x: this.map.tileWidth * 3,
      y: this.map.heightInPixels - this.map.tileHeight,
    };

    this.player = Player.initialize(
      this,
      Difficulty.NORMAL,
      spawnPoint,
    )
  }

  private initializeCamera(): void {  
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(
      -this.player.displayWidth / 2,
    );
    this.cameras.main.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5,
    );

    this.cameras.main.setDeadzone(10, 50);
  }

  private initializeWorld() {
    this.map = this.make.tilemap({ key: 'world' });
    this.map.addTilesetImage('terrain', 'terrain');
    this.map.addTilesetImage('spikes', 'spikes');

    this.physics.world.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5 + MAP.HELLHOLE,
    );

    this.map.createLayer('Terrain', ['terrain', 'spikes']);
  }
}
