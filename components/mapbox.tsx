import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapProps {
  initialCoordinates: [number, number];
  zoom: number;
}

const MapboxComponent: React.FC<MapProps> = ({ initialCoordinates, zoom }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: initialCoordinates,
        zoom: zoom,
      });

      // Clean up the map instance when the component unmounts
      return () => map.remove();
    }
  }, [initialCoordinates, zoom]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapboxComponent;
