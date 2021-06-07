export const BACKGROUND = {
  HEIGHT: 176,
  CLOUD_IDLE: 0.05,
  CLOUD_SPEED: 0.5,
  CLOUD_SCROLL: 0.1,
  CLIFF_SPEED: 0.9,
  CLIFF_SCROLL: 0.1,
  GROUND_SPEED: 1.125,
  GROUND_SCROLL: 0.235,
};

export const MAP = {
  WIDTH: 2560,
  HEIGHT: 384,
}

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

export default { BACKGROUND, COLORS, MAP, Difficulty };
