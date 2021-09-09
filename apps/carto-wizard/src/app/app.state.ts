import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { LevelType } from './level-select/level-select.models';
export interface WikiResponse {
  displaytitle: string;
  extract_html: string;
  thumbnail: {
    height: number;
    source: string;
    width: number;
  };
}

export interface AppState {
  features?: MapboxGeoJSONFeature[];
  backState?: string;
  levelType?: LevelType;
  showBack?: boolean;
  showHome?: boolean;
  showLevel?: boolean;
  showLevelSelect?: boolean;
  showRegions?: boolean;
  selectedRegion?: string;
}

export const states: { [key: string]: AppState } = {
  home: {
    features: [],
    showBack: false,
    showHome: true,
    showLevelSelect: false,
    showRegions: false,
    showLevel: false,
  },
  regions: {
    features: [],
    backState: 'home',
    showBack: true,
    showHome: false,
    showLevelSelect: false,
    showRegions: true,
    showLevel: false,
  },
  level: {
    backState: 'levelSelect',
    showBack: true,
    showHome: false,
    showLevelSelect: false,
    showLevel: true,
  },
  levelSelect: {
    backState: 'home',
    showBack: true,
    showHome: false,
    showLevelSelect: true,
    showRegions: false,
    showLevel: false,
  },
};
