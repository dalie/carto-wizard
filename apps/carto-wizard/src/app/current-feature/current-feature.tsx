import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import { JsonCountry } from '../app';
import styles from './current-feature.module.scss';

/* eslint-disable-next-line */
export interface CurrentFeatureProps {
  className?: string;
  feature: { feature: MapboxGeoJSONFeature; jsonCountry: JsonCountry };
  hideName?: boolean;
}

export class CurrentFeature extends Component<CurrentFeatureProps> {
  render() {
    const country = this.props.feature.jsonCountry;
    console.log(country);
    const flagCode = country.parentIso2 ?? country.iso2;

    return (
      <div className={`${this.props.className} ${styles.currentFeature}`}>
        <img
          className={`${styles.flag} ${
            this.props.hideName ? styles.large : ''
          }`}
          src={`assets/flags/${flagCode.toLowerCase()}.png`}
          title={this.props.hideName ? '??' : country.name}
          alt={this.props.hideName ? '??' : country.name}
        />
        {!this.props.hideName && (
          <>
            <span className={styles.name}>{country.name}</span>
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://en.wikipedia.org/wiki/${this.props.feature.feature.properties?.wikidata_id}`}
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
