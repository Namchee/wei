export const BACKGROUND = {
  HEIGHT: 176,
  CLOUD_IDLE: 0.05,
  CLOUD_SPEED: 0.375,
  CLOUD_SCROLL: 0.085,
  CLIFF_SPEED: 0.5,
  CLIFF_SCROLL: 0.1,
  GROUND_SPEED: 0.675,
  GROUND_SCROLL: 0.115,
};

export const MAP = {
  TILE_SIZE: 16,
  WIDTH: 2560,
  HEIGHT: 384,
  HELLHOLE: 48,
};

export const ANIMS = {
  FPS: 20,
};


// 800
// 375
export const PHYSICS = {
  GRAVITY: 800,
  MOVEMENT: 135,
  JUMP: 375,
};

export enum Difficulty {
  EASY = 3,
  NORMAL = 2,
  HARD = 1
};

export const COLORS = {
  GRAY: {
    600: 0x313131,
  },
  BLUE: {
    400: 0x5BC2E7,
  }
}

export default { BACKGROUND, COLORS, PHYSICS, ANIMS, MAP, Difficulty };
