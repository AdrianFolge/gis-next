import React, { useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { ContinentDataItem } from "../helpers/countPointsInContinents"

const lineData = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointData = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_populated_places_simple.geojson"

interface MapComponentProps {
    pointsOfCities: string;
    riverLines: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ pointsOfCities, riverLines }) => {
    const [pointData, setPointData] = useState(null);
    const [viewState, setViewState] = useState({
      latitude: 0, 
      longitude: 0, 
      zoom: 10, 
    });
    useEffect(() => {
        const pointLayerURL = pointsOfCities;
          fetch(pointLayerURL)
          .then(response => response.json())
          .then(geojson => {
                setPointData(geojson)
            })
    }, [])
    const handleHover = event => {
        if (!pointData) {
          return;
        }
    
        const features = event.features;
        console.log(event)
        const hoveredPoint = features && features.find(f => f.layer.id === 'point');
        
        if (hoveredPoint) {
          console.log("hover");
        }
      };
    
  return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      onClick={handleHover}
    >
        <Source type="geojson" data={lineData}>
          <Layer
            id="line"
            type="line"
            paint={{
              'line-color': '#FF0000',
            }}
          />
        </Source>
        <Source type="geojson" data={pointData}>
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