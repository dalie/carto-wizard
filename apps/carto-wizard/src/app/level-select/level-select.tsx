import { Component } from 'react';
import styles from './level-select.module.scss';
import appStyles from '../app.module.scss';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

/* eslint-disable-next-line */
export interface LevelSelectProps {
  features: MapboxGeoJSONFeature[] | undefined;
}

export class LevelSelect extends Component<LevelSelectProps> {
  render() {
    return (
      <div className={appStyles.ui}>
        {this.props.features?.map((f, i) => (
          <p key={i}>{f.properties?.name}</p>
        ))}
      </div>
    );
  }
}

export default LevelSelect;
