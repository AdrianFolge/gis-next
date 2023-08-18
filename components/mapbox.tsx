import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapProps {
  layer: string;
}

const MapboxComponent: React.FC<MapProps> = ({layer }) => {
  const mapContainerRef = useRef(null);
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-73.93, 40.73],
        zoom: 14,
      });
      
    map.on('load', () => {
        map.addSource('geojson-source', {
        type: 'geojson',
        data: layer
        });
    
        map.addLayer({
        id: 'geojson-layer',
        type: 'circle', 
        source: 'geojson-source',
        paint: {
            'circle-color': '#FF0000',
            'circle-radius': 8, 
        },
        });
    });

      return () => map.remove();
    }
  });

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapboxComponent;
