import { Difficulty } from '../utils/const';

export class GameSettings {
  private _sfx: boolean;
  private _bgm: boolean;
  private _difficulty: Difficulty;

  private static instance: GameSettings;
  
  private constructor() {
    this._sfx = true;
    this._bgm = true;
    this._difficulty = Difficulty.NORMAL;
  }

  public static getInstance(): GameSettings {
    if (!GameSettings.instance) {
      GameSettings.instance = new GameSettings();
    }

    return GameSettings.instance;
  }

  public get bgm(): boolean {
    return this._bgm;
  }

  public get sfx(): boolean {
    return this._sfx;
  }

  public get difficulty(): Difficulty {
    return this._difficulty;
  }

  public toggleBgm(): void {
    this._bgm = !this._bgm;
  }

  public toggleSfx(): void {
    this._sfx = !this._sfx;
  }

  public setDifficulty(diff: Difficulty): void {
    this._difficulty = diff;
  }
}
