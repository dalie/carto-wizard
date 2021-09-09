import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import './level-end.module.scss';

/* eslint-disable-next-line */
export interface LevelEndProps {
  features?: {
    feature: MapboxGeoJSONFeature;
    correct: boolean;
  }[];
}

export class LevelEnd extends Component<LevelEndProps> {
  render() {
    const totalCountries = this.props.features?.length;
    const correctGuesses = this.props.features?.filter((f) => f.correct).length;

    return (
      <div>
        <p>
          You guessed correctly {correctGuesses} out of {totalCountries}{' '}
          countries.
        </p>
      </div>
    );
  }
}

export default LevelEnd;