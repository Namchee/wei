import Phaser from 'phaser';

import { Player } from '../objects/player';
import { Spike } from '../objects/spike';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty, MAP } from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  private spikes!: Phaser.Physics.Arcade.StaticGroup;

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

    this.initializeCollisions();

    this.keys = this.input.keyboard.createCursorKeys();
  }

  public update() {
    // temporary tester code
    if (this.keys.up.isDown) {
      this.player.setVelocityY(-100);
    }

    if (this.keys.down.isDown) {
      this.player.setVelocityY(100);
    }

    if (this.keys.right.isDown) {
      this.player.setVelocityX(200);
      this.backgroundManager.scrollRight();
    } else if (this.keys.left.isDown) {
      this.player.setVelocityX(-200);
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
    );
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

    this.initializeTerrain();
    this.initializeSpikes();
  }

  private initializeTerrain() {
    const terrain = this.map.createLayer('Terrain', ['terrain']);
    terrain.setCollisionByProperty({ collides: true, collidesTop: true });

    terrain.tilemap.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.collidesTop) {
        tile.collideDown = true;
        tile.collideLeft = false;
        tile.collideRight = false;

        tile.faceTop = true;
        tile.faceBottom = false;
      }
    });

    const edgeTerrain = this.map.createLayer('Edge Terrain', ['terrain']);
    edgeTerrain.setCollisionByProperty({
      collidesTop: true,
      collidesLeft: true,
      collidesRight: true,
    });

    edgeTerrain.tilemap.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      tile.collideUp = false;
      tile.collideDown = false;
      tile.collideLeft = false;
      tile.collideRight = false;

      if (tile.properties.collidesTop) {
        tile.collideUp = true;
      }

      if (tile.properties.collidesLeft) {
        tile.collideLeft = true;
      }

      if (tile.properties.collidesRight) {
        tile.collideLeft = true;
      }
    });
  }

  private initializeSpikes() {
    const spikes = this.map.createLayer('Spikes', ['spikes']);

    this.spikes = this.physics.add.staticGroup();
  
    spikes.forEachTile((tile) => {
      if (tile.tileset) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        const spike = this.spikes.create(x, y, 'spikes') as Phaser.Physics.Arcade.Sprite;
        
        spike.body.setSize(this.map.tileWidth, this.map.tileHeight / 2);
        spike.body.setOffset(0, this.map.tileHeight / 2);

        spikes.removeTileAtWorldXY(tile.x, tile.y);
      }
    });
  }

  private initializeCollisions() {
    // collisions for static layers
    this.map.layers.forEach((layer) => {
      this.physics.add.collider(this.player, layer.tilemapLayer);
    });

    this.physics.add.collider(this.player, this.spikes, () => console.log('Ouch!'));
  }
}
