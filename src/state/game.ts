export class GameState {
  private _isRunning: boolean;
  private _cherries: number;

  public constructor() {
    this._isRunning = true;
    this._cherries = 0;
  }

  public get isRunning(): boolean {
    return this._isRunning;
  }

  public get cherries(): number {
    return this._cherries;
  }

  public stopGame(): void {
    this._isRunning = false;
  }

  public collectCherry(): void {
    this._cherries++;
  }
}
