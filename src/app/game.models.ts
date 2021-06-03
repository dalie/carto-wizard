export enum GameDifficulty {
  Easy,
  Medium,
  Hard,
}

export enum GameMode {
  Find,
  Identify,
}

export interface GameScenario {
  id: string;
  dataFile: string;
  description: string;
  labelType: 'string' | 'image';
  labelAccessor: string;
  mode: GameMode;
  name: string;
  startPosition: [number, number];
}
