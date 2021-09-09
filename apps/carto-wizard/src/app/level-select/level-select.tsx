import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import appStyles from '../app.module.scss';
import homeStyles from '../home/home.module.scss';
import { LevelType } from './level-select.models';
import styles from './level-select.module.scss';

/* eslint-disable-next-line */
export interface LevelSelectProps {
  region?: string;
  features: MapboxGeoJSONFeature[] | undefined;
  onLevelSelect: (level: LevelType) => void;
}

export class LevelSelect extends Component<LevelSelectProps> {
  render() {
    return (
      <div className={appStyles.ui}>
        <div className={styles.container}>
          <h2>{this.props.region}</h2>
        </div>
        <div className={styles.modes}>
          <div className={styles.mode}>
            <div>
              <h2>Locate on Map</h2>
              <p>Find the country on the map.</p>
            </div>
            <button
              onClick={() => this.onLevelSelect(LevelType.Locate)}
              className={homeStyles.button}
            >
              Play
            </button>
          </div>
          <div className={styles.mode}>
            <div>
              <h2>Identify</h2>
              <p>Identify the country by it's location.</p>
            </div>
            <button
              onClick={() => this.onLevelSelect(LevelType.Identify)}
              className={homeStyles.button}
            >
              Play
            </button>
          </div>
          <div className={styles.mode}>
            <div>
              <h2>Locate by Flags</h2>
              <p>Find the country on the map but you only see the flag.</p>
            </div>
            <button
              onClick={() => this.onLevelSelect(LevelType.LocateFlag)}
              className={homeStyles.button}
            >
              Play
            </button>
          </div>
          <div className={styles.mode}>
            <div>
              <h2>Identify by Flags</h2>
              <p>
                Identify the country by it's location but you only see the flag.
              </p>
            </div>
            <button
              onClick={() => this.onLevelSelect(LevelType.IdentifyFlag)}
              className={homeStyles.button}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    );
  }

  private onLevelSelect(type: LevelType) {
    if (this.props.onLevelSelect) {
      this.props.onLevelSelect(type);
    }
  }
}

export default LevelSelect;
