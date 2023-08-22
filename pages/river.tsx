import React, { useEffect, useState } from 'react'
import MapComponent from '../components/mapComponentRiver'
import * as turf from '@turf/turf';
import Slider from '@mui/material/Slider';

const riverLines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointsOfCities = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson"
const pointsOfPorts = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson"
const coastlines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_coastline.geojson"
const lakes = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson"
const reefs = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_reefs.geojson"

function river() {
    const [sliderMinValue, setSliderMinValue] = useState(0);
    const [sliderMaxValue, setSliderMaxValue] = useState(0)
    const [pointDataWithDistance, setPointDataWithDistance] = useState(null);
    const [pointDataWithDistanceManipulated, setPointDataWithDistanceManipulated] = useState(null);
    const [pointData, setPointData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [portsData, setPortsData] = useState(null)
    const [coastlinesData, setCoastlinesData] = useState(null);
    const [lakesData, setLakesData] = useState(null);
    const [reefsData, setReefsData] = useState(null)
    const [value, setValue] = useState(0);
    const handleSliderChange = (event, newValue) => {
      setValue(newValue);
    };
    const [viewState, setViewState] = useState({
      latitude: 0,
      longitude: 0,
      zoom: 10,
    });
  
    useEffect(() => {
      const pointLayerURL = pointsOfCities;
      const lineLayerURL = riverLines;
      const portPointsURL = pointsOfPorts
      const coastlinesURL = coastlines;
      const lakesURL = lakes;
      const reefsURL = reefs;
      fetch(pointLayerURL)
        .then(response => response.json())
        .then(geojson => {
            setPointData(geojson);
        });
  
      fetch(lineLayerURL)
        .then(response => response.json())
        .then(geojson => {
          setLineData(geojson);
        });

        fetch(portPointsURL)
        .then(response => response.json())
        .then(geojson => {
          setPortsData(geojson);
        });
        fetch(coastlinesURL)
        .then(response => response.json())
        .then(geojson => {
            setCoastlinesData(geojson);
        });
  
      fetch(lakesURL)
        .then(response => response.json())
        .then(geojson => {
          setLakesData(geojson);
        });

        fetch(reefsURL)
        .then(response => response.json())
        .then(geojson => {
          setReefsData(geojson);
        });
    }, []);

    const findNearestLineDistance = (point, lines) => {
        let minDistance = Number.MAX_VALUE;
        
        lines.features.forEach(line => {
          const distance = turf.pointToLineDistance(point, line);
          minDistance = Math.min(minDistance, distance);
        });
    
        return minDistance;
      };
      const calculateDistancesToNearestLines = () => {
        console.log(pointData)
        if (!pointData || !lineData) {
          return ("HH");
        }
        const pointFeaturesWithDistances = pointData.features.map(point => {
          const pointCoordinates = point.geometry.coordinates;
          const pointCorrect = {
            type: 'Point',
            coordinates: pointCoordinates,
          };
          const nearestLineDistance = findNearestLineDistance(pointCorrect, lineData);
          console.log("Point:", pointCoordinates);
          console.log("Distance to nearest line:", nearestLineDistance);
          return {
            ...point,
            properties: {
              ...point.properties,
              nearestLineDistance: nearestLineDistance,
            },
          };
        });
      
        const updatedPointData = {
          ...pointData,
          features: pointFeaturesWithDistances,
        };
        
        setPointDataWithDistance(updatedPointData);
        setPointDataWithDistanceManipulated(updatedPointData)
        const distanceValues = []
        updatedPointData.features.forEach(point => {
            distanceValues.push(point.properties.nearestLineDistance)
        })
        setSliderMaxValue(Math.max(...distanceValues))
        setSliderMinValue(Math.min(...distanceValues))
        };
        useEffect(() => {
        if (pointData && lineData) {
            console.log(pointData);
            calculateDistancesToNearestLines();
        }
        }, [pointData, lineData]);
        useEffect(() => {
            if (pointData && lineData) {
            const filteredElements = pointDataWithDistance.features.filter(element => {
                return element.properties.nearestLineDistance < value;
              });
              const filteredFeatureCollection = {
                type: 'FeatureCollection',
                features: filteredElements,
              };
            setPointDataWithDistanceManipulated(filteredFeatureCollection)}
        }, [value, pointDataWithDistance])
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="h-screen w-1/4 bg-gray-800 fixed top-1/2 left-0 flex flex-col justify-between z-10">
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <Slider defaultValue={sliderMaxValue} min={sliderMinValue} max={sliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleSliderChange}/>
          {/* Add your navbar items/icons here */}
          <div className="my-2 text-white">
            <i className="fas fa-home"></i>
          </div>
          <div className="my-2 text-white w-1/2 h-1/2">
          </div>
          {/* Add more items/icons as needed */}
        </div>
        {/* You can add a logout or other bottom items here */}
        <div className="p-4">
          <div className="my-2 text-white">
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
        <MapComponent pointLayer={pointDataWithDistanceManipulated} lineLayer={lineData} portsPointLayer={portsData} viewState={viewState} setViewState={setViewState} coastLinesLayer={coastlinesData} reefsLayer={reefsData} lakesLayer={lakesData}/>
    </div>
  )
}

export default river