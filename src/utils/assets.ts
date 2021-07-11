import Phaser from 'phaser';

const BASE_FRAME = { frameWidth: 32, frameHeight: 32 };

export function loadAssets(scene: Phaser.Scene): void {
  // load map
  scene.load.tilemapTiledJSON('world', 'tilemap/wei.json');

  // load background assets
  scene.load.image('cloud', 'background/cloud.png');
  scene.load.image('cliff', 'background/cliff.png');
  scene.load.image('ground', 'background/ground.png');

  // load main character assets
  scene.load.spritesheet('char-idle', 'char/idle.png', BASE_FRAME);
  scene.load.spritesheet('char-double-jump', 'char/double-jump.png', BASE_FRAME);
  scene.load.spritesheet('char-hit', 'char/hit.png', BASE_FRAME);
  scene.load.spritesheet('char-run', 'char/run.png', BASE_FRAME);
  scene.load.spritesheet('char-jump', 'char/jump.png', BASE_FRAME);
  scene.load.spritesheet('char-fall', 'char/fall.png', BASE_FRAME);

  // load platforms
  scene.load.image('terrain', 'terrain/terrain.png');
  scene.load.image('spikes', 'terrain/spikes.png');
  scene.load.spritesheet(
    'flyers',
    'terrain/flyers.png',
    { frameWidth: 32, frameHeight: 10 },
  );

  // load collectibles
  scene.load.spritesheet('cherry', 'collectibles/cherry.png', BASE_FRAME);
  scene.load.spritesheet('collected', 'collectibles/collected.png', BASE_FRAME);

  // load saw
  scene.load.spritesheet(
    'saw-off',
    'enemies/saw/off.png',
    { frameWidth: 38, frameHeight: 38 },
  );
  scene.load.spritesheet(
    'saw-on',
    'enemies/saw/on.png',
    { frameWidth: 38, frameHeight: 38 },
  );

  // load mushroom
  scene.load.spritesheet(
    'mushroom-idle',
    'enemies/mushroom/idle.png',
    BASE_FRAME,
  );
  scene.load.spritesheet(
    'mushroom-run',
    'enemies/mushroom/run.png',
    BASE_FRAME,
  );
  scene.load.spritesheet(
    'mushroom-hit',
    'enemies/mushroom/hit.png',
    BASE_FRAME,
  );

  // load trophy
  scene.load.spritesheet(
    'trophy-idle',
    'checkpoint/idle.png',
    { frameWidth: 64, frameHeight: 64 },
  );
  scene.load.spritesheet(
    'trophy-hit',
    'checkpoint/hit.png',
    { frameWidth: 64, frameHeight: 64 },
  );

  // load buttons
  scene.load.image('play', 'buttons/play.png');
  scene.load.image('play-pressed', 'buttons/play-pressed.png');
  scene.load.image('help', 'buttons/help.png');
  scene.load.image('help-pressed', 'buttons/help-pressed.png');
  scene.load.image('back', 'buttons/back.png');
  scene.load.image('back-pressed', 'buttons/back-pressed.png');
  scene.load.image('sfx-on', 'buttons/sfx-on.png');
  scene.load.image('sfx-on-pressed', 'buttons/sfx-on-pressed.png');
  scene.load.image('sfx-off', 'buttons/sfx-off.png');
  scene.load.image('sfx-off-pressed', 'buttons/sfx-off-pressed.png');
  scene.load.image('bgm-on', 'buttons/bgm-on.png');
  scene.load.image('bgm-on-pressed', 'buttons/bgm-on-pressed.png');
  scene.load.image('bgm-off', 'buttons/bgm-off.png');
  scene.load.image('bgm-off-pressed', 'buttons/bgm-off-pressed.png');
  scene.load.image('close', 'buttons/close.png');
  scene.load.image('close-pressed', 'buttons/close-pressed.png');
  scene.load.image('home', 'buttons/home.png');
  scene.load.image('home-pressed', 'buttons/home-pressed.png');
  scene.load.image('retry', 'buttons/retry.png');
  scene.load.image('retry-pressed', 'buttons/retry-pressed.png');
  scene.load.image('twitter', 'buttons/twitter.png');
  scene.load.image('pause', 'buttons/pause.png');
  scene.load.image('pause-pressed', 'buttons/pause-pressed.png');
  scene.load.image('fullscreen', 'buttons/fullscreen.png');
  scene.load.image('fullscreen-pressed', 'buttons/fullscreen-pressed.png');

  // load cursor
  scene.load.spritesheet(
    'cursor',
    'buttons/cursor.png',
    { frameWidth: 16, frameHeight: 16 },
  );
  
  // load hud
  scene.load.spritesheet(
    'hud',
    'hud.png',
    { frameWidth: 8, frameHeight: 8 },
  );

  // load bgm
  scene.load.audio('title', 'bgm/title.mp3');
  scene.load.audio('game', 'bgm/game.mp3');

  // load sfx
  scene.load.audio('button', 'sfx/button.wav');
  scene.load.audio('hit', 'sfx/hit.wav');
  scene.load.audio('jump', 'sfx/jump.wav');
  scene.load.audio('fruit', 'sfx/fruit.wav');
  scene.load.audio('enemy', 'sfx/enemy.wav');
  scene.load.audio('trophy', 'sfx/trophy.wav');
  scene.load.audio('lose', 'sfx/lose.wav');
  scene.load.audio('win', 'sfx/win.wav');
  scene.load.audio('difficulty', 'sfx/difficulty.wav');
}
