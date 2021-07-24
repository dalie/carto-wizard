import { Component } from 'react';
import styles from './level-select.module.scss';
import homeStyles from '../home/home.module.scss';
import appStyles from '../app.module.scss';
import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { WikiResponse } from '../app.state';

/* eslint-disable-next-line */
export interface LevelSelectProps {
  features: MapboxGeoJSONFeature[] | undefined;
  wiki: WikiResponse | undefined;
}

export class LevelSelect extends Component<LevelSelectProps> {
  render() {
    return (
      <div className={appStyles.ui}>
        <div className={styles.container}>
          <div className={styles.extract}>
            <div>
              <img
                src={this.props.wiki?.thumbnail.source}
                alt={this.props.wiki?.displaytitle}
              />
            </div>
            <div
              className={styles.wiki}
              dangerouslySetInnerHTML={{
                __html: this.props.wiki?.extract_html as string,
              }}
            ></div>
          </div>
        </div>
        <div className={styles.modes}>
          <div className={styles.mode}>
            <div>
              <img src="" alt="" />
            </div>
            <button className={homeStyles.button}>Play</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LevelSelect;
