import React, { useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

// Define your GeoJSON data
const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0], // Replace with your coordinates
      },
      properties: {
        name: 'Marker',
      },
    },
  ],
};

interface MapComponentProps {
    layer: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ layer }) => {
  const [viewState, setViewState] = useState({
    latitude: 0, // Initial latitude
    longitude: 0, // Initial longitude
    zoom: 10, // Initial zoom level
  });

  return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Source type="geojson" data={layer}>
        <Layer
          id="point"
          type="circle"
          paint={{
            'circle-color': '#FF0000',
            'circle-radius': 8,
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default MapComponent;