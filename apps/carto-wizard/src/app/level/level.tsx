import { Map, MapboxGeoJSONFeature, MapLayerMouseEvent } from 'mapbox-gl';
import { Component } from 'react';
import { LevelType } from '../level-select/level-select.models';

import './level.module.scss';

/* eslint-disable-next-line */
export interface LevelProps {
  features: MapboxGeoJSONFeature[] | undefined;
  type: LevelType | undefined;
  map: Map | undefined;
}

export class Level extends Component<LevelProps> {
  private _hoveredStateIds: (number | string | undefined)[] = [];
  private _registeredListeners = false;

  componentWillUnmount() {
    if (this._registeredListeners) {
      this.props?.map?.off('mousemove', 'countries_fill', this.onMouseMove);
      this.props?.map?.off('mouseleave', 'countries_fill', this.onMouseLeave);
      this.props?.map?.off('click', 'countries_fill', this.onMouseClick);
    }
  }

  render() {
    if (!this._registeredListeners && this.props.map) {
      this.props?.map?.on('mousemove', 'countries_fill', this.onMouseMove);
      this.props?.map?.on('mouseleave', 'countries_fill', this.onMouseLeave);
      this.props?.map?.on('click', 'countries_fill', this.onMouseClick);
      this._registeredListeners = true;
    }

    return (
      <div>
        <p>Welcome to level!</p>
      </div>
    );
  }

  private onMouseClick = (e: MapLayerMouseEvent) => {
    console.log(e.features ? e.features[0].properties?.name : '');
  };

  private onMouseMove = (e: MapLayerMouseEvent) => {
    if (this.props.map && e.features) {
      this.props.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (this._hoveredStateIds.length) {
          this.setFeatureState(this._hoveredStateIds, { hover: false });
        }
        this._hoveredStateIds = [e.features[0].id];
        this.setFeatureState(this._hoveredStateIds, { hover: true });
      }
    }
  };

  private onMouseLeave = (e: MapLayerMouseEvent) => {
    if (this.props.map) {
      this.props.map.getCanvas().style.cursor = '';
      if (this._hoveredStateIds.length) {
        this.setFeatureState(this._hoveredStateIds, { hover: false });
      }
      this._hoveredStateIds = [];
    }
  };

  private setFeatureState(
    ids: (number | string | undefined)[],
    properties: any
  ) {
    ids.forEach((id) => {
      this.props.map?.setFeatureState(
        {
          id,
          source: 'countries_source',
          sourceLayer: 'countries',
        },
        properties
      );
    });
  }
}

export default Level;
