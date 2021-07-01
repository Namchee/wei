import { Difficulty } from '../utils/const';

export interface GameResult {
  readonly difficulty: Difficulty;
  readonly lives: number;
  readonly cherries: number;
  readonly time: number;
}
