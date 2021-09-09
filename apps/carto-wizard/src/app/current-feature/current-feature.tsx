import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import styles from './current-feature.module.scss';

/* eslint-disable-next-line */
export interface CurrentFeatureProps {
  className?: string;
  feature: MapboxGeoJSONFeature;
  hideName?: boolean;
}

export class CurrentFeature extends Component<CurrentFeatureProps> {
  render() {
    let flagCode = this.props.feature.properties?.code;
    if (!flagCode) {
      flagCode = this.props.feature.properties?.parentCode;
    }

    return (
      <div className={`${this.props.className} ${styles.currentFeature}`}>
        <img
          className={`${styles.flag} ${
            this.props.hideName ? styles.large : ''
          }`}
          src={`assets/flags/${flagCode}.png`}
          title={
            this.props.hideName ? '??' : this.props.feature.properties?.name
          }
          alt={this.props.hideName ? '??' : this.props.feature.properties?.name}
        />
        {!this.props.hideName && (
          <>
            <span className={styles.name}>
              {this.props.feature.properties?.name}
            </span>
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://en.wikipedia.org/wiki/${this.props.feature.properties?.wikiLink}`}
            >
              <img
                className={styles.wiki}
                alt={`Wikipedia`}
                title={`Wikipedia`}
                src={`assets/images/wikipedia_icon.png`}
              />
            </a>
          </>
        )}
      </div>
    );
  }
}

export default CurrentFeature;
