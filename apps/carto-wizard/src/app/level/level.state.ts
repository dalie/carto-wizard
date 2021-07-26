import { MapboxGeoJSONFeature } from 'mapbox-gl';

export interface LevelState {
  features: MapboxGeoJSONFeature[];
  currentFeature?: MapboxGeoJSONFeature;
  currentGuess?: MapboxGeoJSONFeature;
  showCurrentFeature?: boolean;
  showStart?: boolean;
  showEnd?: boolean;
  showResult?: boolean;
}
