import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import { JsonCountry } from '../app';

import styles from './current-choices.module.scss';

/* eslint-disable-next-line */
export interface CurrentChoicesProps {
  nChoices?: number;
  className: string;
  answer: { feature: MapboxGeoJSONFeature; jsonCountry: JsonCountry };
  choices: {
    features: MapboxGeoJSONFeature[];
    jsonCountries: { [key: string]: JsonCountry };
  };
  hideName: boolean;
  onSuccess: (score: number) => void;
}

export class CurrentChoices extends Component<CurrentChoicesProps> {
  state: {
    answer: { feature: MapboxGeoJSONFeature; jsonCountry: JsonCountry };
    attempts: number;
    currentChoices: MapboxGeoJSONFeature[];
    nChoices: number;
    failed: string[];
    showContinue?: boolean;
  };

  constructor(props: CurrentChoicesProps) {
    super(props);
    const nChoices = props.nChoices ?? 3;
    this.state = {
      answer: this.props.answer,
      attempts: nChoices,
      currentChoices: this.getChoices(nChoices),
      nChoices,
      failed: [],
    };
  }

  componentDidUpdate() {
    if (this.props.answer.feature.id !== this.state.answer.feature.id) {
      this.setState({
        answer: this.props.answer,
        currentChoices: this.getChoices(this.state.nChoices),
      });
    }
  }

  render() {
    return (
      <div
        className={`${this.props.className} ${styles.choices} ${
          this.props.hideName ? '' : styles.grid
        }`}
      >
        {this.state.currentChoices.map((c) => {
          const country =
            this.props.choices.jsonCountries[c.properties?.iso_3166_1];
          const flagCode = country.iso2;

          return (
            <div
              className={`${styles.choice} ${
                this.state.failed.indexOf(c.id as string) > -1
                  ? styles.failed
                  : ''
              }`}
              key={`choice_${c.id}`}
              onClick={() => {
                if (this.state.failed.indexOf(c.id as string) < 0) {
                  this.onClick(c.id as string);
                }
              }}
            >
              <div className={styles.flag}>
                <img
                  alt={this.props.hideName ? '' : country.name}
                  src={`assets/flags/${flagCode.toLowerCase()}.png`}
                />
              </div>

              {!this.props.hideName && <span>{country.name}</span>}
            </div>
          );
        })}

        {this.state.showContinue && (
          <div onClick={this.onContinue}>Continue</div>
        )}
      </div>
    );
  }

  private onClick = (id: string) => {
    if (id === this.props.answer.feature.id) {
      this.setState({
        showContinue: true,
      });
    } else {
      const failed = this.state.failed;
      failed.push(id);
      this.setState({
        attempts: this.state.attempts - 1,
        failed,
      });
    }
  };

  private onContinue = () => {
    const score = (1 / this.state.nChoices) * this.state.attempts;
    this.setState({
      showContinue: false,
      failed: [],
    });
    this.props.onSuccess(score);
  };

  private getChoices(nChoices: number): MapboxGeoJSONFeature[] {
    if (this.props.choices) {
      return [
        this.props.answer.feature,
        ...this.props.choices.features
          .filter((f) => f.id !== this.props.answer.feature.id)
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value)
          .slice(0, nChoices),
      ]
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
    } else {
      return [];
    }
  }
}

export default CurrentChoices;
