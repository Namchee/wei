export const BACKGROUND = {
  HEIGHT: 176,
  CLOUD_IDLE: 0.05,
  CLOUD_SPEED: 0.175,
  CLOUD_SCROLL: 0.05,
  CLIFF_SPEED: 0.25,
  CLIFF_SCROLL: 0.065,
  GROUND_SPEED: 0.325,
  GROUND_SCROLL: 0.0825,
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
    DURATION: 75,
  },
};

export const SCENES = {
  TRANSITION: 500,
  SPLASH: 3000,
};

export const SOUND = {
  BGM: 0.05,
  SFX: 0.2,
};

export enum Difficulty {
  EASY = 3,
  NORMAL = 2,
  HARD = 1
};

export const HELP_TEXT = 'There\'s an ancient tale of a hero named Wei. This story marks the beginning if his journey. Wei can move using arrow keys on the keyboard. Wei can also jump with either SPACEBAR or UP key. Collect as much cherries as possible while avoiding all harmful obstacles like grinding saws, spikes, and mushrooms. Defeat the mushrooms by jumping on their mushy head. May fortune be with Wei.';

export const COLORS = {
  GRAY: {
    600: 0x313131,
  },
  BLUE: {
    400: 0x5BC2E7,
  }
}

export default { BACKGROUND, COLORS, PHYSICS, ANIMS, MAP, OBJECTS, SOUND, Difficulty };
