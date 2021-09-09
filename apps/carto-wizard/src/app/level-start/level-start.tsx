import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import homeStyles from '../home/home.module.scss';
import { LevelType } from '../level-select/level-select.models';

/* eslint-disable-next-line */
export interface LevelStartProps {
  features: MapboxGeoJSONFeature[];
  levelType: LevelType;
  onStart: () => void;
}

export class LevelStart extends Component<LevelStartProps> {
  render() {
    return (
      <div>
        <button className={homeStyles.button} onClick={this.onStart}>
          Start
        </button>
      </div>
    );
  }

  private onStart = () => {
    this.props.onStart();
  };
}

export default LevelStart;
