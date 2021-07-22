import { Component } from 'react';

import styles from './back-button.module.scss';

/* eslint-disable-next-line */
export interface BackButtonProps {
  onClickBack: () => void;
}

export class BackButton extends Component<BackButtonProps> {
  render() {
    return (
      <div className={styles.container}>
        <button onClick={this.props.onClickBack}>Back</button>
      </div>
    );
  }
}

export default BackButton;
