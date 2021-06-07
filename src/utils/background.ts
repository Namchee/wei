import Phaser from 'phaser';

import { UnimplementedFeatureException } from '../exceptions/unimplemented';
import { BACKGROUND, COLORS } from './theme';

export interface BackgroundManager {
  scrollLeft: () => void;
  scrollRight: () => void;
  idle: () => void;
}

export interface Dimension {
  width: number;
  height: number;
}

export class ForestBackgroundManager implements BackgroundManager {
  private readonly layerGroup: Phaser.GameObjects.Group;

  private constructor(scene: Phaser.Scene) {
    this.layerGroup = scene.add.group();
  }

  public static initalize(
    scene: Phaser.Scene,
    dimension: Dimension,
  ): ForestBackgroundManager {
    const manager = new ForestBackgroundManager(scene);
    manager.applyBackground();
    manager.applyLayers(dimension);

    return manager;
  }

  private applyBackground(): void {
    const scene = this.layerGroup.scene;
    const { width, height } = scene.game.config;

    const bg = scene.add.renderTexture(
      0,
      0,
      Number(width),
      Number(height),
    );

    bg.setScrollFactor(0);
    bg.setAlpha(1);
    bg.fill(COLORS.BLUE[400]);
  }

  private applyLayers({ width, height }: Dimension): void {
    const scene = this.layerGroup.scene;
  
    const cloud = scene.add.tileSprite(
      0,
      height - (1.25 * BACKGROUND.HEIGHT),
      width,
      BACKGROUND.HEIGHT,
      'cloud',
    )
      .setOrigin(0, 0)
      .setName('cloud');
    const cliff = scene.add.tileSprite(
      0,
      height - (1.1 * BACKGROUND.HEIGHT),
      width,
      BACKGROUND.HEIGHT,
      'cliff',
    )
      .setOrigin(0, 0)
      .setName('cliff');
    const ground = scene.add.tileSprite(
      0,
      height - BACKGROUND.HEIGHT,
      width,
      BACKGROUND.HEIGHT,
      'ground',
    )
      .setOrigin(0, 0)
      .setName('ground');

    this.layerGroup.addMultiple([cloud, cliff, ground]);
  }

  public scrollLeft(): void {
    this.layerGroup.children.iterate((child) => {
      const layer = child as Phaser.GameObjects.TileSprite;
      let scrollAmount = 0;

      switch (layer.name) {
        case 'cloud': 
          scrollAmount = BACKGROUND.CLOUD_SPEED;
          break;
        case 'cliff':
          scrollAmount = BACKGROUND.CLIFF_SPEED;
          break;
        case 'ground':
          scrollAmount = BACKGROUND.GROUND_SPEED;
          break;
      }
    
      layer.tilePositionX -= scrollAmount;
    });
  }

  public scrollRight(): void {
    this.layerGroup.children.iterate((child) => {
      const layer = child as Phaser.GameObjects.TileSprite;
      let scrollAmount = 0;

      switch (layer.name) {
        case 'cloud':
          scrollAmount = BACKGROUND.CLOUD_SPEED;
          break;
        case 'cliff':
          scrollAmount = BACKGROUND.CLIFF_SPEED;
          break;
        case 'ground':
          scrollAmount = BACKGROUND.GROUND_SPEED;
          break;
      }
    
      layer.tilePositionX += scrollAmount;
    });
  }

  public idle(): void {
    this.layerGroup.children.iterate((child) => {
      const layer = child as Phaser.GameObjects.TileSprite;
      
      if (layer.name === 'cloud') {
        layer.tilePositionX += BACKGROUND.CLOUD_IDLE;
      }
    });
  }
}

export function createBackgroundManager(
  scene: Phaser.Scene,
  key: string,
  dimension: Dimension,
): BackgroundManager {
  if (key === 'Forest') {
    return ForestBackgroundManager.initalize(scene, dimension);
  }

  throw new UnimplementedFeatureException(`${key}BackgroundManager`);
}
