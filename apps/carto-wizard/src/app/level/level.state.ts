import { MapboxGeoJSONFeature } from 'mapbox-gl';

export interface LevelState {
  features: MapboxGeoJSONFeature[];
  currentFeature?:  MapboxGeoJSONFeature;
  currentGuess?: MapboxGeoJSONFeature;
  currentChoices?: MapboxGeoJSONFeature[];
  guessedFeatures?: { feature: MapboxGeoJSONFeature; score: number }[];
  showCurrentFeature?: boolean;
  showCurrentChoices?: boolean;
  showStart?: boolean;
  showEnd?: boolean;
  showResult?: boolean;
}
