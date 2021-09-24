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

export interface PropertiesJson {
  alpha2Code: string;
  alpha3Code: string;
  altSpelling: string;
  area:number;
  borders: string;
  callingCodes: string;
  capital: string;
  cioc: string;
  currencies: string;
  demonym: string;
  flag: string;
  languages: string;
  lngLat:string;
  name: string;
  nativeName: string;
  noFlag: boolean;
  numericCode: number;
  population: number;
  region: string;
  subregion: string;
  timezones: string;
  topLevelDomain: string;
}

export interface Properties {
  alpha2Code: string;
  alpha3Code: string;
  altSpelling: string[];
  area:number;
  borders: string[];
  callingCodes: string[];
  capital: string;
  cioc: string;
  currencies: { code: string; name: string; symbol: string }[];
  demonym: string;
  flag: string;
  languages: { iso639_1: string; iso639_2: string; nativeName: string }[];
  lngLat: GeoJSON.Position;
  name: string;
  nativeName: string;
  noFlag: boolean;
  numericCode: number;
  population: number;
  region: string;
  subregion: string;
  timezones: string[];
  topLevelDomain: string[];
}

export function parseProps(p: PropertiesJson): Properties {
  return {
    alpha2Code: p.alpha2Code,
    alpha3Code: p.alpha3Code,
    altSpelling: p.altSpelling? JSON.parse(p.altSpelling):[],
    area:p.area,
    borders: p.borders ? JSON.parse(p.borders) : [],
    callingCodes: p.callingCodes ? JSON.parse(p.callingCodes) : [],
    capital: p.capital,
    cioc: p.cioc,
    currencies: p.currencies ? JSON.parse(p.currencies) : [],
    demonym: p.demonym,
    flag: p.flag,
    languages: p.languages ? JSON.parse(p.languages) : [],
    lngLat: JSON.parse(p.lngLat),
    name: p.name,
    nativeName: p.nativeName,
    noFlag: !!p.noFlag,
    numericCode: p.numericCode,
    population: p.population,
    region: p.region,
    subregion: p.subregion,
    timezones: p.timezones ? JSON.parse(p.timezones) : [],
    topLevelDomain: p.topLevelDomain ? JSON.parse(p.topLevelDomain) : [],
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
