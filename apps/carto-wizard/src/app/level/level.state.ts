import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { JsonCountry } from '../app';

export interface LevelState {
  features: MapboxGeoJSONFeature[];
  currentFeature?: { feature: MapboxGeoJSONFeature; jsonCountry: JsonCountry };
  currentGuess?: MapboxGeoJSONFeature;
  currentChoices?: MapboxGeoJSONFeature[];
  guessedFeatures?: { feature: MapboxGeoJSONFeature; score: number }[];
  showCurrentFeature?: boolean;
  showCurrentChoices?: boolean;
  showStart?: boolean;
  showEnd?: boolean;
  showResult?: boolean;
}
