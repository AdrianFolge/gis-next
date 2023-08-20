import React, { useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import {calculateCenter, GeoJSONFeature} from "../helpers/helperFunctions"
import supercluster from 'supercluster';


interface MapComponentProps {
    layer: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ layer }) => {
    const [geojsonData, setGeojsonData] = useState<GeoJSONFeature[]>([]);
    const [viewState, setViewState] = useState({
      latitude: 0, 
      longitude: 0, 
      zoom: 10, 
    });
  
    useEffect(() => {
      const geojsonUrl = layer;
        fetch(geojsonUrl)
        .then(response => response.json())
        .then(geojson => {
            setGeojsonData(geojson.features);
            const { latitude, longitude, zoom } = calculateCenter(geojson.features);
            setViewState({
            latitude,
            longitude,
            zoom,
            });
        })
        .catch(error => {
            console.error('Error fetching GeoJSON:', error);
        });
    }, [layer]);

    const cluster = new supercluster({
        radius: 60,
        maxZoom: 3,
      });
      cluster.load(geojsonData.map(feature => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: feature.geometry.coordinates,
        }
      })));
      const clusterFeatures = cluster.getClusters([-180, -85, 180, 85], Math.floor(viewState.zoom)).map(cluster => {

        const properties = cluster.properties || {}; 
        const point_count = properties.point_count || 1; 
    
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: cluster.geometry.coordinates,
          },
          properties: {
            point_count,
          },
        };
      });
  return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
  {/* Render the clusters and markers */}
  {viewState.zoom <= 3 ? (
        <Source type="geojson" data={{ type: 'FeatureCollection', features: clusterFeatures }}>
            <Layer
            id="cluster"
            type="circle"
            paint={{
                'circle-color': [
                'case',
                ['>=', ['get', 'point_count'], 50], '#f28cb1',
                ['>=', ['get', 'point_count'], 10], '#f1f075',
                '#51bbd6',
                ],
                'circle-radius': [
                'case',
                ['>=', ['get', 'point_count'], 50], 40,
                ['>=', ['get', 'point_count'], 10], 30,
                20,
                ],
            }}
            />
            <Layer
            id="cluster-count"
            type="symbol"
            layout={{
                'text-field': '{point_count}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            }}
            paint={{
                'text-color': 'black',
            }}
            />
        </Source>
      ) : (
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
      )}
    </ReactMapGL>
  );
};

export default MapComponent;