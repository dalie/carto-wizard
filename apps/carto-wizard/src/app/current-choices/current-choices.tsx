import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { Component } from 'react';
import { PropertiesJson } from '../app.state';
import styles from './current-choices.module.scss';

/* eslint-disable-next-line */
export interface CurrentChoicesProps {
  nChoices?: number;
  className: string;
  answer: MapboxGeoJSONFeature;
  choices: MapboxGeoJSONFeature[];
  hideName: boolean;
  onSuccess: (score: number) => void;
}

export class CurrentChoices extends Component<CurrentChoicesProps> {
  state: {
    answer: MapboxGeoJSONFeature;
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
    if (this.props.answer.id !== this.state.answer.id) {
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
          const props: PropertiesJson = c.properties as any;

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
                  alt={this.props.hideName ? '' : props.name}
                  src={`assets/flags/${props.alpha2Code.toLowerCase()}.png`}
                />
              </div>

              {!this.props.hideName && <span>{props.name}</span>}
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
    if (id === this.props.answer.id) {
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
        this.props.answer,
        ...this.props.choices
          .filter((f) => f.id !== this.props.answer.id)
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
