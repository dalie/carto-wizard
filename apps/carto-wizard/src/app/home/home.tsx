import { Component } from 'react';
import styles from './home.module.scss';

/* eslint-disable-next-line */
export interface HomeProps {
  onSelectRegion: () => void;
  onSelectWorld: () => void;
}

export class Home extends Component<HomeProps> {
  render() {
    return (
      <div className={styles.ui}>
        <div className={styles.menu}>
          <h1>CartoWizard</h1>
          <button className={styles.button} onClick={this.props.onSelectWorld}>
            World
          </button>
          <button className={styles.button} onClick={this.props.onSelectRegion}>
            Select Region
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
