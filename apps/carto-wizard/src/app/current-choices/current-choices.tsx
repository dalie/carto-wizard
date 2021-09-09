import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';

import styles from './current-choices.module.scss';

/* eslint-disable-next-line */
export interface CurrentChoicesProps {
  className: string;
  choices: MapboxGeoJSONFeature[];
  hideName: boolean;
  onSelectedChoice: (id: string) => void;
}

export class CurrentChoices extends Component<CurrentChoicesProps> {
  render() {
    return (
      <div className={`${this.props.className} ${styles.choices}`}>
        {this.props.choices.map((c) => {
          let flagCode = c.properties?.code;
          if (!flagCode) {
            flagCode = c.properties?.parentCode;
          }

          return (
            <div
              className={styles.choice}
              key={`choice_${c.id}`}
              onClick={() => {
                this.onClick(c.id as string);
              }}
            >
              <div className={styles.flag}>
                <img
                  alt={this.props.hideName ? '' : c.properties?.name}
                  src={`assets/flags/${flagCode}.png`}
                />
              </div>

              {!this.props.hideName && <span>{c.properties?.name}</span>}
            </div>
          );
        })}
      </div>
    );
  }

  private onClick = (id: string) => {
    this.props.onSelectedChoice(id);
  };
}

export default CurrentChoices;
