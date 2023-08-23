import React, { use, useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';



const lineData = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointData = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson"
interface viewState {
    latitude: number,
    longitude: number,
    zoom: number
}


interface MapComponentProps {
    pointLayer: string;
    lineLayer: string;
    portsPointLayer: string;
    coastLinesLayer: string;
    lakesLayer: string;
    reefsLayer: string;
    viewState: viewState;
    setViewState: React.Dispatch<React.SetStateAction<viewState>>;
}

const MapComponent: React.FC<MapComponentProps> = ({ pointLayer, lineLayer, viewState, setViewState, portsPointLayer, coastLinesLayer, lakesLayer, reefsLayer }) => {
    console.log(pointLayer)
    const [blinkOpacity, setBlinkOpacity] = useState(0.8);
    useEffect(() => {
      const interval = setInterval(() => {
        setBlinkOpacity(prevOpacity => (prevOpacity === 0 ? 0.8 : 0)); // Toggle opacity
      }, 3000); // Blink every 1 second
  
      return () => clearInterval(interval);
    }, []);
    return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
        <Source type="geojson" data={lineLayer}>
          <Layer
            id="line"
            type="line"
            paint={{
              'line-color': '#FF0000',
            }}
          />
        </Source>
        <Source type="geojson" data={pointLayer}>
          <Layer
            id="point"
            type="circle"
            paint={{
                'circle-radius': 10,
                'circle-color': 'red',
                'circle-opacity': blinkOpacity, // Toggle opacity based on blink state
                'circle-stroke-width': 2,
                'circle-stroke-color': 'red',
              }}
          />
        </Source>
        <Source type="geojson" data={portsPointLayer}>
          <Layer
            id="ports"
            type="circle"
            paint={{
              'circle-color': '#4169E1',
              'circle-radius': 8,
            }}
          />
        </Source>
        <Source type="geojson" data={lakesLayer}>
          <Layer
            id="lakes"
            type="fill"
            paint={{
              'fill-color': '#0F52BA',
              'fill-opacity': 0.6,
            }}
          />
        </Source>
        <Source type="geojson" data={reefsLayer}>
          <Layer
            id="reefs"
            type="line"
            paint={{
              'line-color': '#008000',
            }}
          />
        </Source>
        <Source type="geojson" data={coastLinesLayer}>
          <Layer
            id="coastline"
            type="line"
            paint={{
              'line-color': '#9ACD32',
            }}
          />
        </Source>
    </ReactMapGL>
  );
};

export default MapComponent;