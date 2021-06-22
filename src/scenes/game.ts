import Phaser from 'phaser';
import { Cherry } from '../objects/cherry';
import { Flyer } from '../objects/flyer';
import { Mushroom } from '../objects/mushroom';

import { Movement, Player } from '../objects/player';
import { Saw } from '../objects/saw';
import { Spike } from '../objects/spike';

import { BackgroundManager, createBackgroundManager } from '../utils/background';
import { Difficulty, MAP, OBJECTS } from '../utils/const';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private cherries!: Phaser.Physics.Arcade.StaticGroup;

  private saws!: Saw[];
  private mushrooms!: Mushroom[];
  private flyers!: Flyer[];

  private backgroundManager!: BackgroundManager;
  private player!: Player;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();
    this.initializeTilemap();
    this.initializeSaw();
    this.initializeTerrain();
    this.initializeSpikes();
    this.initializeFlyers();
    this.initializePlayer();
    this.initializeCamera();
    this.initializeCollectibles();
    this.initializeMushrooms();
    
    this.initializeCollisions();
    this.registerInputs();
  }

  public update() {
    this.controllerLoop();
    this.backgroundLoop();

    this.player.update();

    const mushroomBounds = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - OBJECTS.MUSHROOMS.RADIUS,
      this.cameras.main.worldView.y - OBJECTS.MUSHROOMS.RADIUS,
      this.cameras.main.worldView.width + OBJECTS.MUSHROOMS.RADIUS * 2,
      this.cameras.main.worldView.height + OBJECTS.MUSHROOMS.RADIUS * 2,
    );

    const sawBounds = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - OBJECTS.SAW.RADIUS,
      this.cameras.main.worldView.y - OBJECTS.SAW.RADIUS,
      this.cameras.main.worldView.width + OBJECTS.SAW.RADIUS * 2,
      this.cameras.main.worldView.height + OBJECTS.SAW.RADIUS * 2,
    );

    this.mushrooms.forEach((mushroom: Mushroom) => {
      mushroomBounds.contains(mushroom.x, mushroom.y) ?
        mushroom.startPatrol() :
        mushroom.stopPatrol();
    });

    this.saws.forEach((saw: Saw) => {
      sawBounds.contains(saw.x, saw.y) ?
        saw.startPatrol() :
        saw.stopPatrol();
    });
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(
      this,
      'Forest',
      { width: MAP.WIDTH, height: MAP.HEIGHT },
    );
  }

  private initializePlayer(): void {
    const layer = this.map.createFromObjects('Player Spawn Point', {});
    const sprite = layer[0] as Phaser.GameObjects.Sprite;

    const x = sprite.x;
    const y = sprite.y;

    this.player = new Player(this, x, y, Difficulty.NORMAL);

    layer.forEach((sprite) => sprite.destroy());
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

  private initializeTilemap(): void {
    this.map = this.make.tilemap({ key: 'world' });

    this.physics.world.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5 + MAP.HELLHOLE,
    );
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

  private initializeFlyers(): void {
    const flyerTiles = this.map.createLayer('Flyers', ['flyers']);
    this.map.addTilesetImage('flyers', 'flyers');

    this.flyers = [];

    flyerTiles.forEachTile((tile: Phaser.Tilemaps.Tile): void => {
      if (tile.tileset) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        this.flyers.push(new Flyer(this, x, y));

        flyerTiles.removeTileAt(tile.x, tile.y, true);
      }
    });

    this.map.removeLayer('Flyer');
  }

  private initializeSaw(): void {
    const sawRoutes = this.map.createFromObjects('Saw Route', {});

    this.saws = [];

    const startPoints = new Map<number, Phaser.Math.Vector2>();
    const endPoints = new Map<number, Phaser.Math.Vector2>();

    sawRoutes.forEach((point) => {
      const pointSprite = point as Phaser.GameObjects.Sprite;

      const customProps = Object.keys(pointSprite.data.list);
      const [prop, id] = customProps[0].split('_');
      const position = new Phaser.Math.Vector2(pointSprite.x, pointSprite.y);

      prop === 'start' ?
        startPoints.set(Number(id), position) :
        endPoints.set(Number(id), position);
    });

    startPoints.forEach((position, id) => {
      const saw = new Saw(this, position.x, position.y);
      const endPoint = endPoints.get(id);

      saw.setPatrolRoute(endPoint as Phaser.Math.Vector2);
      this.saws.push(saw);
    });

    sawRoutes.forEach((emptySprite) => emptySprite.destroy(true));
  }

  private initializeMushrooms(): void {
    const mushroomRoutes = this.map.createFromObjects('Enemy Route', {});

    this.mushrooms = [];

    const startPoints = new Map<number, Phaser.Math.Vector2>();
    const endPoints = new Map<number, Phaser.Math.Vector2>();

    mushroomRoutes.forEach((point) => {
      const pointSprite = point as Phaser.GameObjects.Sprite;

      const customProps = Object.keys(pointSprite.data.list);
      const [prop, id] = customProps[0].split('_');
      const position = new Phaser.Math.Vector2(pointSprite.x, pointSprite.y);

      prop === 'start' ?
        startPoints.set(Number(id), position) :
        endPoints.set(Number(id), position);
    });

    startPoints.forEach((position, id) => {
      const mushroom = new Mushroom(this, position.x, position.y);
      const endPoint = endPoints.get(id);

      mushroom.setPatrolRoute(endPoint as Phaser.Math.Vector2);
      this.mushrooms.push(mushroom);
    });

    mushroomRoutes.forEach((emptySprite) => emptySprite.destroy(true));
  }

  private initializeCollisions(): void {
    const disablePlayerCollision = () => {
      this.physics.world.colliders.getActive().forEach((collider) => {
        if (['saw', 'mushroom'].includes(collider.name)) {
          collider.active = false;
        }
      });
    };

    const enablePlayerCollision = () => {
      this.physics.world.colliders.getActive().forEach((collider) => {
        if (['saw', 'mushroom'].includes(collider.name)) {
          collider.active = true;
        }
      });
    };

    // collisions for static layers
    this.map.layers.forEach(({ tilemapLayer }) => {
      this.physics.add.collider(this.player, tilemapLayer);
    });

    this.physics.add.collider(this.spikes, this.player, () => {
      if (this.player.isInvicible) {
        return;
      }

      this.player.getHit();
    });

    this.physics.add.overlap(this.cherries, this.player, (_, cherry) => {
      (cherry as Cherry).collect();
    });

    this.flyers.forEach((flyer: Flyer) => {
      const collider = this.physics.add.collider(flyer, this.player, () => {
        if (flyer.body.touching.up) {
          flyer.getHit()
            .then(() => this.physics.world.removeCollider(collider));
        }
      });
    });

    const sawCollider = this.physics.add.collider(this.saws, this.player, () => {
      if (this.player.isInvicible) {
        return;
      }

      disablePlayerCollision();
      this.player.getHit()
        .then(() => enablePlayerCollision());
    });
    sawCollider.setName('saw');

    this.mushrooms.forEach((mushroom: Mushroom) => {
      const collider = this.physics.add.collider(mushroom, this.player, () => {
        if (this.player.isInvicible) {
          return;
        }

        if (mushroom.body.touching.up) {
          mushroom.getHit();
          this.player.hitMushroom();
          this.physics.world.removeCollider(collider);
        } else {
          disablePlayerCollision();

          this.player.getHit()
            .then(() => enablePlayerCollision());
        }
      });

      collider.setName('mushroom');
    });
  }

  private registerInputs(): void {
    const spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    const up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP,
    )

    spacebar.on('down', () => {
      this.player.jump();
    });
    up.on('down', () => {
      this.player.jump();
    })

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
