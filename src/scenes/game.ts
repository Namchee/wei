import Phaser from 'phaser';

import { Cherry } from '../objects/cherry';
import { Flyer } from '../objects/flyer';
import { Mushroom } from '../objects/mushroom';
import { Movement, Player } from '../objects/player';
import { Saw } from '../objects/saw';
import { Spike } from '../objects/spike';
import { Trophy } from '../objects/trophy';
import { GameState } from '../state/game';
import { GameSettings } from '../state/setting';

import {
  BackgroundManager,
  createBackgroundManager,
} from '../utils/background';
import { MAP, OBJECTS, SOUND } from '../utils/const';
import { injectUI } from '../utils/ui';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  private map!: Phaser.Tilemaps.Tilemap;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private cherries!: Phaser.Physics.Arcade.StaticGroup;
  private saws!: Saw[];
  private mushrooms!: Mushroom[];
  private flyers!: Flyer[];

  private player!: Player;
  private trophy!: Trophy;

  private backgroundManager!: BackgroundManager;

  private gameBgm!: Phaser.Sound.BaseSound;

  private lives!: Phaser.GameObjects.Text;
  private score!: Phaser.GameObjects.Text;
  private times!: Phaser.GameObjects.Text;
  private pauseButton!: Phaser.GameObjects.Image;

  private gameState!: GameState;
  private countdown!: Phaser.Time.TimerEvent;

  public constructor() {
    super('GameScene');
  }

  public create(): void {
    this.gameState = new GameState();

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
    this.initializeEndpoint();

    this.initializeCollisions();
    this.initializeHUD();
    this.initializeBgm();
    this.initializeBottomBounds();

    this.registerInputs();

    this.initializeHooks();
    this.win();
  }

  public update(): void {
    if (this.gameState.isRunning) {
      this.controllerLoop();
      this.player.update();
    } else {
      this.countdown.destroy();
    }

    this.backgroundManager.idle();

    const mushroomBounds = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - OBJECTS.MUSHROOMS.RADIUS,
      this.cameras.main.worldView.y - OBJECTS.MUSHROOMS.RADIUS,
      this.cameras.main.worldView.width + OBJECTS.MUSHROOMS.RADIUS * 2,
      this.cameras.main.worldView.height + OBJECTS.MUSHROOMS.RADIUS * 2
    );

    const sawBounds = new Phaser.Geom.Rectangle(
      this.cameras.main.worldView.x - OBJECTS.SAW.RADIUS,
      this.cameras.main.worldView.y - OBJECTS.SAW.RADIUS,
      this.cameras.main.worldView.width + OBJECTS.SAW.RADIUS * 2,
      this.cameras.main.worldView.height + OBJECTS.SAW.RADIUS * 2
    );

    this.mushrooms.forEach((mushroom: Mushroom) => {
      mushroomBounds.contains(mushroom.x, mushroom.y)
        ? mushroom.startPatrol()
        : mushroom.stopPatrol();
    });

    this.saws.forEach((saw: Saw) => {
      sawBounds.contains(saw.x, saw.y) ? saw.startPatrol() : saw.stopPatrol();
    });
  }

  private initializeBackground(): void {
    this.backgroundManager = createBackgroundManager(this, 'Forest', {
      width: MAP.WIDTH,
      height: MAP.HEIGHT,
    });
  }

  private initializePlayer(): void {
    const layer = this.map.createFromObjects('Player Spawn Point', {});
    const sprite = layer[0] as Phaser.GameObjects.Sprite;

    const x = sprite.x;
    const y = sprite.y;

    this.player = new Player(this, x, y, GameSettings.getInstance().difficulty);

    layer.forEach(sprite => sprite.destroy());
  }

  private initializeCamera(): void {
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.displayWidth / 2);
    this.cameras.main.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5
    );
  }

  private initializeTilemap(): void {
    this.map = this.make.tilemap({ key: 'world' });

    this.physics.world.setBounds(
      0,
      -this.map.heightInPixels / 2,
      this.map.widthInPixels,
      this.map.heightInPixels * 1.5 + MAP.HELLHOLE
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

      prop === 'start'
        ? startPoints.set(Number(id), position)
        : endPoints.set(Number(id), position);
    });

    startPoints.forEach((position, id) => {
      const saw = new Saw(this, position.x, position.y);
      const endPoint = endPoints.get(id);

      saw.setPatrolRoute(endPoint as Phaser.Math.Vector2);
      this.saws.push(saw);
    });

    sawRoutes.forEach(emptySprite => emptySprite.destroy(true));
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

      prop === 'start'
        ? startPoints.set(Number(id), position)
        : endPoints.set(Number(id), position);
    });

    startPoints.forEach((position, id) => {
      const mushroom = new Mushroom(this, position.x, position.y);
      const endPoint = endPoints.get(id);

      mushroom.setPatrolRoute(endPoint as Phaser.Math.Vector2);
      this.mushrooms.push(mushroom);
    });

    mushroomRoutes.forEach(emptySprite => emptySprite.destroy(true));
  }

  private initializeEndpoint(): void {
    const trophyTiles = this.map.createLayer('Checkpoint', 'checkpoint');
    this.map.addTilesetImage('checkpoint', 'trophy-idle');

    trophyTiles.forEachTile((tile: Phaser.Tilemaps.Tile): void => {
      if (tile.tileset) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();

        this.trophy = new Trophy(this, x, y);

        trophyTiles.removeTileAt(tile.x, tile.y);
      }
    });

    this.map.removeLayer(trophyTiles);
  }

  private initializeCollisions(): void {
    // collisions for static layers
    this.map.layers.forEach(({ tilemapLayer }) => {
      const mapCollider = this.physics.add.collider(this.player, tilemapLayer);
      mapCollider.setName('map');
    });

    const spikeCollider = this.physics.add.collider(
      this.spikes,
      this.player,
      () => this.handlePlayerHit()
    );
    spikeCollider.setName('spike');

    this.cherries.getChildren().forEach((cherry) => {
      const collider = this.physics.add.overlap(cherry, this.player, () => {
        (cherry as Cherry).collect();
        this.gameState.collectCherry();
        this.score.setText([`CHERRY: ${this.gameState.cherries}`]);

        this.physics.world.removeCollider(collider);

        if (GameSettings.getInstance().sfx) {
          this.sound.play('fruit', { volume: SOUND.SFX });
        }
      });

      collider.setName('cherry');
    });

    this.flyers.forEach((flyer: Flyer) => {
      const collider = this.physics.add.collider(flyer, this.player, () => {
        if (flyer.body.touching.up) {
          flyer
            .getHit()
            .then(() => this.physics.world.removeCollider(collider));
        }
      });
    });

    const sawCollider = this.physics.add.collider(this.saws, this.player, () =>
      this.handlePlayerHit()
    );
    sawCollider.setName('saw');

    this.mushrooms.forEach((mushroom: Mushroom) => {
      const collider = this.physics.add.collider(mushroom, this.player, () => {
        if (this.player.isInvicible) {
          return;
        }

        if (mushroom.body.touching.up) {
          mushroom.getHit();
          this.player.hitMushroom();

          if (GameSettings.getInstance().sfx) {
            this.sound.play('enemy', { volume: SOUND.SFX });
          }

          this.physics.world.removeCollider(collider);
        } else {
          this.handlePlayerHit();
        }
      });

      collider.setName('mushroom');
    });

    const trophyOverlapper = this.physics.add.overlap(
      this.player,
      this.trophy,
      () => {
        if (GameSettings.getInstance().sfx) {
          this.sound.play('trophy', { volume: SOUND.SFX });
        }

        this.physics.world.removeCollider(trophyOverlapper);
        this.gameState.stopGame();

        this.win();
      }
    );
  }

  private initializeHUD(): void {
    const { width, height } = this.game.config;
    const style = {
      fontFamily: 'Monogram',
      fontSize: '24px',
      lineSpacing: 1.25,
      align: 'center',
    };

    this.lives = this.add
      .text(
        Number(width) * 0.025,
        Number(height) * 0.05,
        `HEALTH: ${this.player.lives} / ${
          GameSettings.getInstance().difficulty
        }`,
        style
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0);

    this.score = this.add
      .text(
        Number(width) * 0.025,
        Number(height) * 0.1,
        `CHERRY: ${this.gameState.cherries}`,
        style
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0);

    this.times = this.add
      .text(
        Number(width) * 0.025,
        Number(height) * 0.15,
        `TIME: ${OBJECTS.TIME}`,
        style
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0);

    const uiButtons = injectUI(this);

    this.pauseButton = this.add
      .image(
        uiButtons[0].x - MAP.TILE_SIZE * 1.5,
        Number(height) * 0.0625,
        'pause'
      )
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' });

    this.pauseButton.on('pointerdown', () => {
      this.pauseButton.setTexture('pause-pressed');
    });

    this.pauseButton.on('pointerup', () => {
      this.pauseButton.setTexture('pause');

      if (GameSettings.getInstance().sfx) {
        this.sound.play('button', { volume: SOUND.SFX });
      }

      this.pauseGame();
    });

    this.countdown = this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        const currentTime = Number(this.times.text.match(/\d+/));
        if (!currentTime) {
          this.countdown.destroy();
        }

        this.times.setText([
          `TIME: ${(currentTime - 1).toString().padStart(3)}`,
        ]);
      },
    });
  }

  private initializeBgm(): void {
    this.keys = this.input.keyboard.createCursorKeys();
    this.gameBgm = this.sound.add('game', { volume: SOUND.BGM });

    if (GameSettings.getInstance().bgm) {
      this.gameBgm.play('', { loop: true });
    }
  }

  private registerInputs(): void {
    const keys = this.input.keyboard.addKeys('SPACE, UP');

    Object.values(keys).forEach((key: Phaser.Input.Keyboard.Key) => {
      key.on('down', () => {
        if (!this.player.isAlive) {
          return;
        }

        this.player.jump();
      });
    });
  }

  private pauseGame(): void {
    this.scene.pause('GameScene');
    this.scene.launch('PauseScene');
  }

  private initializeBottomBounds(): void {
    this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
      if (!body.blocked.down) {
        return;
      }

      const { gameObject } = body;

      switch (gameObject.constructor) {
        case Flyer: {
          (gameObject as Flyer).remove();
          break;
        }
        case Mushroom: {
          (gameObject as Mushroom).remove();
          break;
        }
        default: {
          this.player.die();
          this.lives.setText(
            `HEALTH: ${this.player.lives} / ${
              GameSettings.getInstance().difficulty
            }`
          );
          this.lose();
          break;
        }
      }
    });
  }

  private handlePlayerHit(): void {
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

    if (this.player.isInvicible) {
      return;
    }

    disablePlayerCollision();

    if (GameSettings.getInstance().sfx) {
      this.sound.play('hit', { volume: SOUND.SFX });
    }

    this.player.decrementLives();
    this.lives.setText(
      `HEALTH: ${this.player.lives} / ${GameSettings.getInstance().difficulty}`
    );

    if (this.player.isAlive) {
      this.player.getHit().then(() => enablePlayerCollision());

      return;
    } else {
      this.physics.world.colliders
        .getActive()
        .forEach((collider: Phaser.Physics.Arcade.Collider) => {
          if (['map', 'spike', 'cherry'].includes(collider.name)) {
            this.physics.world.removeCollider(collider);
          }
        });

      this.cameras.main.stopFollow();
      this.player.ragdoll();
    }
  }

  private win(): void {
    this.gameState.stopGame();
    this.gameBgm.pause();
    this.player.idle();
    this.trophy.collect();

    this.scene.launch('ResultScene', {
      result: {
        difficulty: GameSettings.getInstance().difficulty,
        lives: this.player.lives,
        time: Number(this.times.text.match(/\d+/)),
        cherries: this.gameState.cherries,
      },
    });
  }

  private lose(): void {
    this.gameState.stopGame();
    this.gameBgm.pause();

    this.scene.launch('ResultScene', {
      result: {
        lives: 0,
      },
    });
  }

  private controllerLoop(): void {
    if (!this.player.isAlive) {
      return;
    }

    if (
      (!this.keys.right.isDown && !this.keys.left.isDown) ||
      (this.keys.right.isDown && this.keys.left.isDown) ||
      this.player.isBlockedHorizontally
    ) {
      this.player.idle();
      return;
    }

    this.keys.right.isDown
      ? this.player.move(Movement.Right)
      : this.player.move(Movement.Left);
  }

  private initializeHooks(): void {
    this.events.on('resume', () => {
      if (GameSettings.getInstance().bgm) {
        this.gameBgm.resume();
      }
    });

    this.events.on('pause', () => {
      this.gameBgm.pause();
    });
  }
}
