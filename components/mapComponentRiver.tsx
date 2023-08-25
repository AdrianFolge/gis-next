import React, { useEffect, useState } from 'react';
import ReactMapGL, { Source, Layer, MapRef } from 'react-map-gl';
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
    airportLayer: string;
    viewState: viewState;
    setViewState: React.Dispatch<React.SetStateAction<viewState>>;
    mapReference: React.MutableRefObject<MapRef | null>;
    singleCityFeature: string;
    singlePortFeature: string;
    singleAirportFeature: string;
    singleRiverFeature: string;
    singleReefFeature: string;
    singleCoastFeature: string;
    threeAttractionsFeature: string;
    showPortsLayer: boolean;
    showCoastsLayer: boolean;
    showRiversLayer: boolean;
    showReefsLayer: boolean;
    showAirportsLayer: boolean;
    showLakesLayer: boolean;

}

const MapComponent: React.FC<MapComponentProps> = ({ pointLayer, lineLayer, viewState, setViewState, portsPointLayer, coastLinesLayer, lakesLayer, reefsLayer, mapReference, airportLayer, singleCityFeature, singleAirportFeature, singleCoastFeature, singlePortFeature, singleReefFeature, singleRiverFeature, showAirportsLayer, showCoastsLayer, showLakesLayer, showPortsLayer, showReefsLayer, showRiversLayer, threeAttractionsFeature }) => {
  const [blinkOpacity, setBlinkOpacity] = useState(0.8);
    useEffect(() => {
      const interval = setInterval(() => {
        setBlinkOpacity(prevOpacity => (prevOpacity === 0 ? 0.8 : 0)); // Toggle opacity
      }, 3000); // Blink every 1 second
      return () => clearInterval(interval);
    }, []);
    return (
    <ReactMapGL
      ref={mapReference}
      {...viewState}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || ''}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
    >
    
      {!singleCityFeature && (
        <> 
          {showRiversLayer && (
            <Source type="geojson" data={lineLayer}>
              <Layer
                id="line"
                type="line"
                paint={{
                  'line-color': '#FF0000',
                }}
              />
            </Source>
          )}
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
        {showPortsLayer && (
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
        )}
        {showLakesLayer && (
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
        )}
        {showReefsLayer && (
        <Source type="geojson" data={reefsLayer}>
          <Layer
            id="reefs"
            type="line"
            paint={{
              'line-color': '#008000',
            }}
          />
        </Source>
        )}
        {showCoastsLayer && (
        <Source type="geojson" data={coastLinesLayer}>
          <Layer
            id="coastline"
            type="line"
            paint={{
              'line-color': '#9ACD32',
            }}
          />
        </Source>
        )}
        {showAirportsLayer && (
        <Source type="geojson" data={airportLayer}>
          <Layer
            id="airport"
            type="circle"
            paint={{
              'circle-color': '#800080',
              'circle-radius': 8,
            }}
          />
        </Source>)} </>)}
        {singleCityFeature && (
          <>
          <Source id="feature-source" type="geojson" data={singleCityFeature}>
            <Layer
              id="feature-layer"
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
          <Source id="port-source" type="geojson" data={singlePortFeature}>
          <Layer
              id="ports"
              type="circle"
              paint={{
                'circle-color': '#4169E1',
                'circle-radius': 8,
              }}
            />
        </Source>
        <Source id="attractions-source" type="geojson" data={threeAttractionsFeature}>
          <Layer
              id="attractions"
              type="circle"
              paint={{
                'circle-color': '#FFC0CB',
                'circle-radius': 8,
              }}
            />
        </Source>
        <Source id="river-source" type="geojson" data={singleRiverFeature}>
          <Layer
            id="river-line"
            type="line"
            paint={{
              'line-color': '#FF0000',
            }}
          />
        </Source>
        <Source id="coast-source" type="geojson" data={singleCoastFeature}>
          <Layer
            id="coast-line"
            type="line"
            paint={{
              'line-color': '#9ACD32',
            }}
          />
        </Source>
        <Source id="reef-source" type="geojson" data={singleReefFeature}>
          <Layer
            id="reef-line"
            type="line"
            paint={{
              'line-color': '#008000',
            }}
          />
        </Source>
        <Source id="airport-source" type="geojson" data={singleAirportFeature}>
          <Layer
            id="airport-layer"
            type="circle"
            paint={{
              'circle-color': '#800080',
              'circle-radius': 8,
            }}
          />
        </Source>
        </>
        )}
    </ReactMapGL>
  );
};

export default MapComponent;