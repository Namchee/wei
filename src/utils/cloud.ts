import Phaser from 'phaser';

import { BACKGROUND } from './theme'; 

export class CloudManager extends Phaser.GameObjects.Group {
  private constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public static initialize(scene: Phaser.Scene): CloudManager {
    const manager = new CloudManager(scene);

    const clouds = [...Array(BACKGROUND.CLOUD_COUNT)]
      .map(() => {
        const { width } = manager.scene.game.config;

        const x = Math.random() * 0.7 + 0.15;

        const cloud = manager.scene.add.image(
          Number(width) * x,
          0,
          '',
        ).setOrigin(0, 0);

        manager.randomizeY(cloud);
        manager.randomizeTexture(cloud);
        manager.randomizeSpeed(cloud);

        return cloud;
      })
  
    manager.addMultiple(clouds);

    return manager;
  }

  public update(cam: Phaser.Cameras.Scene2D.Camera) {
    const { width } = this.scene.game.config;

    this.children.iterate((cloud: Phaser.GameObjects.GameObject) => {
      const cloudImage = cloud as Phaser.GameObjects.Image;

      const { x, y, displayWidth } = cloudImage;

      // right bound
      if (cam.scrollX < (x + displayWidth)) {
        cloudImage.setX(cam.scrollX);
      } else if (cam.scrollX > x) {
        cloudImage.setX(cam.scrollX - Number(width));
      }
    });
  }

  private randomizeY(cloud: Phaser.GameObjects.Image): void {
    const { height } = this.scene.game.config;

    const y = Math.random() * (BACKGROUND.Y_MAX - BACKGROUND.Y_MIN) + BACKGROUND.Y_MIN;

    cloud.setY(Number(height) * y);
  }

  private randomizeTexture(cloud: Phaser.GameObjects.Image): void {
    const texture = `cloud${Math.floor(Math.random() * 7) + 1}`;

    cloud.setTexture(texture);
  }

  private randomizeSpeed(cloud: Phaser.GameObjects.Image): void {
    const speed = Math.random() * (BACKGROUND.SPEED_MAX - BACKGROUND.SPEED_LOW) +
      BACKGROUND.SPEED_LOW;

    cloud.setScrollFactor(speed);
  }
}
