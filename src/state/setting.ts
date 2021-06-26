export class GameSettings {
  private _sfx!: boolean;
  private _bgm!: boolean;

  private static instance: GameSettings;
  
  private constructor() {
    this._sfx = true;
    this._bgm = true;
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

  public toggleBgm(): void {
    this._bgm = !this._bgm;
  }

  public toggleSfx(): void {
    this._sfx = !this._sfx;
  }
}