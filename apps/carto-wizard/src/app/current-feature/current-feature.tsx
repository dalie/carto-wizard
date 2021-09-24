import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import { PropertiesJson } from '../app.state';
import styles from './current-feature.module.scss';

/* eslint-disable-next-line */
export interface CurrentFeatureProps {
  className?: string;
  feature: MapboxGeoJSONFeature;
  hideName?: boolean;
}

export class CurrentFeature extends Component<CurrentFeatureProps> {
  render() {
    const props: PropertiesJson = this.props.feature.properties as any;

    return (
      <div className={`${this.props.className} ${styles.currentFeature}`}>
        <img
          className={`${styles.flag} ${
            this.props.hideName ? styles.large : ''
          }`}
          src={`assets/flags/${props.alpha2Code.toLowerCase()}.png`}
          title={this.props.hideName ? '??' : props.name}
          alt={this.props.hideName ? '??' : props.name}
        />
        {!this.props.hideName && (
          <span className={styles.name}>{props.name}</span>
        )}
      </div>
    );
  }
}

export default CurrentFeature;
