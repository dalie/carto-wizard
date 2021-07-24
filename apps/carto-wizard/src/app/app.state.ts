import { MapboxGeoJSONFeature } from 'mapbox-gl';
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
  showBack?: boolean;
  showHome?: boolean;
  showLevelSelect?: boolean;
  showRegions?: boolean;
  wiki?: WikiResponse;
}

export const states: { [key: string]: AppState } = {
  home: {
    features: [],
    showBack: false,
    showHome: true,
    showLevelSelect: false,
    showRegions: false,
  },
  regions: {
    features: [],
    backState: 'home',
    showBack: true,
    showHome: false,
    showLevelSelect: false,
    showRegions: true,
  },
  levelSelect: {
    showBack: true,
    showHome: false,
    showLevelSelect: true,
    showRegions: false,
  },
};
