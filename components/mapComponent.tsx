import React, { useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import {calculateCenter, GeoJSONFeature, countPointsByCountry, getTopThreeCountries} from "../helpers/helperFunctions"
import supercluster from 'supercluster';
import axios from "axios"
import { getPointsInContinents, ContinentDataItem } from "../helpers/countPointsInContinents"

const url = "https://gist.githubusercontent.com/hrbrmstr/91ea5cc9474286c72838/raw/59421ff9b268ff0929b051ddafafbeb94a4c1910/continents.json"


interface MapComponentProps {
    layer: string;
    setDisplayTotalPoints: React.Dispatch<React.SetStateAction<number>>;
    setDisplayNumberOfClusters: React.Dispatch<React.SetStateAction<number>>;
    setDisplayAverageDistance: React.Dispatch<React.SetStateAction<number>>;
    setCountryPoints: React.Dispatch<React.SetStateAction<Array<{ country: string; points: number }>>>;
    selectedContinent: string;
    setContinentData: React.Dispatch<React.SetStateAction<ContinentDataItem[]>>;
}

const MapComponent: React.FC<MapComponentProps> = ({ layer, setDisplayTotalPoints, setDisplayNumberOfClusters, setDisplayAverageDistance, setCountryPoints, selectedContinent, setContinentData }) => {
    const [geojsonData, setGeojsonData] = useState<GeoJSONFeature[]>([]);
    const [hexagonData, setHexagonData] = useState([])
    const [worldLayer, setWorldLayer] = useState({ type: 'FeatureCollection', features: [] });
    const [viewState, setViewState] = useState({
      latitude: 0, 
      longitude: 0, 
      zoom: 10, 
    });
    useEffect(() => {
        // Fetch GeoJSON data from the URL
        axios.get(url)
            .then(response => {
                const allFeatures = response.data.features;
                let filteredFeatures = allFeatures;
    
                if (selectedContinent !== 'All') {
                    filteredFeatures = allFeatures.filter(feature =>
                        feature.properties.CONTINENT === selectedContinent
                    );
                }
    
                setWorldLayer({
                    type: 'FeatureCollection',
                    features: filteredFeatures
                });
            })
            .catch(error => {
                console.error('Error fetching GeoJSON data:', error);
            });
    }, [url, selectedContinent]);
    useEffect(() => {
      const geojsonUrl = layer;
        fetch(geojsonUrl)
        .then(response => response.json())
        .then(geojson => {
            const hexagonDataTemp = geojson.features.map(feature => {
                const { coordinates } = feature.geometry;
                return {
                    position: coordinates,
                };
            })
            setHexagonData(hexagonDataTemp)
            const countries = countPointsByCountry(geojson)
            setCountryPoints(getTopThreeCountries(countries))
            setDisplayTotalPoints(geojson.features.length)
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


    useEffect(() => {
      async function fetchData() {
        try {
          const data = await getPointsInContinents(layer,url);
          setContinentData(data);
        } catch (error) {
          console.error('An error occurred:', error.message);
        }
      }
      fetchData();
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
    setDisplayNumberOfClusters(clusterFeatures.length)

  return (
    <ReactMapGL
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {worldLayer && (
      <Source type="geojson" data={worldLayer}>
      <Layer 
          id="fill-layer"
          type="fill"
          paint={{
            'fill-color': ['match', ['get', 'CONTINENT'],
            'Asia', '#FF0000', 
            'Europe', '#00FF00', 
            'Africa', '#0000FF', 
            "South America", "#fcba03",
            "North America", "#5e03fc",
            "Oceania", "#03fcb5",
            "Antarctica", "#b1fc03",
            '#808080' 
            ],
              'fill-opacity': 0.5, 
          }}/>
        </Source>
      )}
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

