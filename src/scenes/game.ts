import Phaser from 'phaser';

import theme from '../utils/theme';

export class GameScene extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  public constructor() {
    super('GameScene');
  }

  public create() {
    this.initializeBackground();

    this.keys = this.input.keyboard.createCursorKeys();
  }

  public update() {
    const cam = this.cameras.main;
    const speed = 2;

    if (this.keys.right.isDown) {
      cam.scrollX += speed;
    } else if (this.keys.left.isDown) { 
      cam.scrollX -= speed;
    }
  }

  private initializeBackground(): void {
    const { width, height } = this.scale;
    const totalWidth = width * 100;

    const bgRepeater = (texture: string, speed: number) => {
      const width = this.textures.get(texture).getSourceImage().width;
      const count = Math.ceil(totalWidth / width) * speed;

      let x = 0;

      for (let i = 0; i < count; i++) {
        const m = this.add.image(x, height, texture)
          .setOrigin(0, 1)
          .setScrollFactor(speed);

        x += m.width;
      }
    };

    this.add.tileSprite(0, 0, Number(this.game.config.width), Number(this.game.config.height), 'sky');

    bgRepeater('cloud', theme.BACKGROUND_SPEED.CLOUD);
    bgRepeater('cliff', theme.BACKGROUND_SPEED.CLIFF);
    bgRepeater('ground', theme.BACKGROUND_SPEED.GROUND);
  }
}
