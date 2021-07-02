export const BACKGROUND = {
  HEIGHT: 176,
  CLOUD_IDLE: 0.05,
  CLOUD_SPEED: 0.175,
  CLOUD_SCROLL: 0.05,
  CLIFF_SPEED: 0.25,
  CLIFF_SCROLL: 0.075,
  GROUND_SPEED: 0.325,
  GROUND_SCROLL: 0.1,
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
  TROPHY: {
    DURATION: 1500,
  },
  TIME: 300,
};

export const PHYSICS = {
  GRAVITY: 800,
  MOVEMENT: 135,
  JUMP: 375,
  MUSHROOM: 200,
  HIT_BACK: {
    DURATION: 250,
    X: 75,
    Y: 200,
  },
  INVICIBILITY: {
    PERIOD: 10,
    DURATION: 75,
  },
  DIE: {
    GRAVITY: 300,
    ANGLE: 22.5,
    DURATION: 1000,
  }
};

export const TITLE = {
  DURATION: 1250,
};

export const SCENES = {
  TRANSITION: 200,
  RESULT: 500,
  SPLASH: 3000,
};

export const SOUND = {
  BGM: 0.0625,
  SFX: 0.2,
};

export enum Difficulty {
  EASY = 5,
  NORMAL = 3,
  HARD = 1,
};

export const SCORE = {
  LIVES: 50,
  CHERRY: 5,
  TIME: 0.1,
  DIFFICULTY: {
    5: 1,
    3: 2,
    1: 3.5,
  },
  HIGH_SCORE_BLINK: {
    DURATION: 115,
  },
}

export const TEXT = {
  HELP: [
    'There\'s an ancient tale of a legendary hero named Wei. This story marks the beginning of his heroic journey.',
    '',
    '',
    '',
    'As Wei\'s guide, you must help him attain the legends by controlling him.',
    'Move Wei with ARROW keys on your keyboard.',
    'Make Wei jump using the SPACE or UP key.',
    'Avoid obstacles like mushrooms, saws, and spikes as much as possible.',
    '',
    '',
    'May fortune be with you, o heroes!',
  ],
  OBJECTIVE: 'Get as fast as possible to the endpoint while keeping Wei healthy.',
  LOSE: {
    TITLE: 'You Lose!',
    DESC: ['Wei has taken too much hit and fainted!', 'Better luck next time, o heroes!'],
  },
  WIN: {
    TITLE: 'You Win!',
  },
  SHARE: 'Hey!%20I%27m%20having%20a%20blast%20after%20playing%20a%20new-and-exciting%20platformer%20game%20%27Wei%27!%0A%0ACome%20and%20try%20it%20out%20now!%20https%3A%2F%2Fwei.vercel.app%2F',
}

export const COLORS = {
  GRAY: {
    600: 0x313131,
  },
  BLUE: {
    400: 0x5BC2E7,
  }
}

export default { BACKGROUND, COLORS, PHYSICS, ANIMS, MAP, OBJECTS, SOUND, TEXT, TITLE, SCORE, Difficulty };
