import Phaser from 'phaser';
import { Cherry } from '../objects/cherry';

import { Movement, Player } from '../objects/player';
import { Spike } from '../objects/spike';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty, MAP } from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private cherries!: Phaser.Physics.Arcade.StaticGroup;

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
    this.initializeCollectibles();

    this.initializeCollisions();
    this.registerInputs();
  }

  public update() {
    this.controllerLoop();
    this.backgroundLoop();

    this.player.update();
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

  private initializeWorld(): void {
    this.map = this.make.tilemap({ key: 'world' });

    this.physics.world.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5 + MAP.HELLHOLE,
    );

    this.initializeTerrain();
    this.initializeSpikes();
  }

  private initializeTerrain(): void {
    const terrain = this.map.createLayer('Terrain', ['terrain']);
    this.map.addTilesetImage('terrain', 'terrain');

    terrain.setCollisionByProperty({ collides: true, collidesTop: true });

    terrain.tilemap.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.properties.collidesTop) {
        tile.collideLeft = false;
        tile.collideRight = false;
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
      tile.collideUp = !!tile.properties.collidesTop;
      tile.collideDown = false;
      tile.collideLeft = !!tile.properties.collidesRight;
      tile.collideRight = !!tile.properties.collidesLeft;
    });
  }

  private initializeSpikes(): void {
    const spikeTiles = this.map.createLayer('Spikes', ['spikes']);
    this.map.addTilesetImage('spikes', 'spikes');

    this.spikes = this.physics.add.staticGroup();
  
    spikeTiles.forEachTile((tile: Phaser.Tilemaps.Tile): void => {
      if (tile.tileset) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        const spike = new Spike(this, x, y);
        this.spikes.add(spike, true);
  
        spikeTiles.removeTileAt(tile.x, tile.y);
      }
    });

    this.map.removeLayer('Spikes');
  }

  private initializeCollectibles(): void {
    const cherryTiles = this.map.createLayer('Fruits', ['cherry']);
    this.map.addTilesetImage('cherry', 'cherry');

    this.cherries = this.physics.add.staticGroup();

    cherryTiles.forEachTile((tile: Phaser.Tilemaps.Tile): void => {
      if (tile.tileset) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        const cherry = new Cherry(this, x, y);
        this.cherries.add(cherry, true);

        cherryTiles.removeTileAt(tile.x, tile.y, true);
      }
    });

    this.map.removeLayer('Fruits');
  }

  private initializeCollisions(): void {
    // collisions for static layers
    this.map.layers.forEach(({ tilemapLayer }) => {
      this.physics.add.collider(this.player, tilemapLayer);
    });

    this.physics.add.collider(this.spikes, this.player, () => console.log('Ouch!'));

    this.physics.add.overlap(this.cherries, this.player, (_, cherry) => {
      (cherry as Cherry).collect();
    });
  }

  private registerInputs(): void {
    const spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    spacebar.on('down', () => {
      this.player.jump();
    });

    this.keys = this.input.keyboard.createCursorKeys();
  }

  private controllerLoop(): void {
    if (
      (!this.keys.right.isDown && !this.keys.left.isDown) ||
      (this.keys.right.isDown && this.keys.left.isDown)
    ) {
      this.player.idle();
      return;
    }
  
    this.keys.right.isDown ?
      this.player.move(Movement.Right) :
      this.player.move(Movement.Left);
  }

  private backgroundLoop(): void {
    const velocity = this.player.body.velocity.x;

    if (!velocity) {
      this.backgroundManager.idle();
      return;
    }

    velocity > 0 ?
      this.backgroundManager.scrollRight() :
      this.backgroundManager.scrollLeft();
  }
}
