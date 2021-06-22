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

export const OBJECTS = {
  FLYER: {
    WIDTH: 32,
    HEIGHT: 10,
    OSCILATE: 10,
    TIMER: 1000,
    GRAVITY: 1000,
  },
  SAW: {
    WIDTH: 38,
    HEIGHT: 38,
    TWEEN: 3000,
    DELAY: 1500,
    RADIUS: 200,
  },
  MUSHROOMS: {
    WIDTH: 32,
    HEIGHT: 20,
    TWEEN: 4000,
    DELAY: 2000,
    RADIUS: 150,
    DEATH: 300,
    ANGLE: 22.5,
    ANGLE_DURATION: 50,
    GRAVITY: 1000,
  },
};

export const PHYSICS = {
  GRAVITY: 800,
  MOVEMENT: 135,
  JUMP: 375,
  MUSHROOM: 200,
  HIT_BACK: {
    DURATION: 250,
    X: 25,
    Y: 200,
  },
  INVICIBILITY: {
    PERIOD: 10,
    DURATION: 85,
  },
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

export default { BACKGROUND, COLORS, PHYSICS, ANIMS, MAP, OBJECTS, Difficulty };
