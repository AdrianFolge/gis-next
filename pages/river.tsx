import React, { useEffect, useState } from 'react'
import MapComponent from '../components/mapComponentRiver'
import Slider from '@mui/material/Slider';
import { calculateDistancesToNearestLine, calculateDistancesToNearestPoint, calculateDistancesToNearestPointPolygon } from '../helpers/helperFunctions';

const riverLines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointsOfCities = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson"
const pointsOfPorts = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson"
const coastlines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_coastline.geojson"
const lakes = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson"
const reefs = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_reefs.geojson"

function river() {
    const [riverSliderMaxValue, setRiverSliderMaxValue] = useState(0)
    const [riverSliderValue, setRiverSliderValue] = useState(0);

    const [coastSliderMaxValue, setCoastSliderMaxValue] = useState(0)
    const [coastSliderValue, setCoastSliderValue] = useState(0);

    const [reefsSliderMaxValue, setReefsSliderMaxValue] = useState(0)
    const [reefsSliderValue, setReefsSliderValue] = useState(0);

    const [portsSliderMaxValue, setPortsSliderMaxValue] = useState(0)
    const [portsSliderValue, setPortsSliderValue] = useState(0);

    const [lakesSliderMaxValue, setLakesSliderMaxValue] = useState(0)
    const [lakesSliderValue, setLakesSliderValue] = useState(0);

    const [pointDataWithDistance, setPointDataWithDistance] = useState(null);
    const [pointDataWithDistanceManipulated, setPointDataWithDistanceManipulated] = useState(null);
    const [pointData, setPointData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [portsData, setPortsData] = useState(null)
    const [coastlinesData, setCoastlinesData] = useState(null);
    const [lakesData, setLakesData] = useState(null);
    const [reefsData, setReefsData] = useState(null)
    
    const handleRiverSliderChange = (event, newValue) => {
      setRiverSliderValue(newValue);
    };
    const handleCoastSliderChange = (event, newValue) => {
        setCoastSliderValue(newValue);
    };
    const handleReefsSliderChange = (event, newValue) => {
        setReefsSliderValue(newValue);
    };
    const handlePortsSliderChange = (event, newValue) => {
        setPortsSliderValue(newValue);
    };
    const handleLakesSliderChange = (event, newValue) => {
        setLakesSliderValue(newValue);
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

    useEffect(() => {
        if (pointData && lineData && coastlinesData) {
          const arrayReefsDistances = calculateDistancesToNearestLine({
            pointData,
            lineData: reefsData,
            setSliderMaxValue: setReefsSliderMaxValue,
            propertyName: "nearestReefsDistance"
        });
            const arrayCoastDistances = calculateDistancesToNearestLine({
              pointData,
              lineData: coastlinesData,
              setSliderMaxValue: setCoastSliderMaxValue,
              propertyName: "nearestCoastDistance"
        });
             const arrayRiverDistances = calculateDistancesToNearestLine({
              pointData,
              lineData,
              setSliderMaxValue: setRiverSliderMaxValue,
              propertyName: "nearestRiverDistance"
        });
            const arrayPortsDistances = calculateDistancesToNearestPoint({
                pointData,
                referenceData: portsData,
                setSliderMaxValue: setLakesSliderMaxValue,
                propertyName: "nearestPortDistance"
        });
        const arrayLakesDistances = calculateDistancesToNearestPointPolygon({
            pointData,
            polygonData: lakesData,
            setSliderMaxValue: setPortsSliderMaxValue,
            propertyName: "nearestLakeDistance"
        });
             const manipulatedDataWithDistances = {
                type: "FeatureCollection",
                features: pointData.features.map((point, index) => ({
                  ...point,
                  properties: {
                    ...point.properties,
                    nearestReefsDistance: arrayReefsDistances[index],
                    nearestCoastDistance: arrayCoastDistances[index],
                    nearestRiverDistance: arrayRiverDistances[index],
                    nearestPortDistance: arrayPortsDistances[index],
                    nearestLakeDistance: arrayLakesDistances[index]
                  }
                }))
              };
              setPointDataWithDistance(manipulatedDataWithDistances)
              setPointDataWithDistanceManipulated(manipulatedDataWithDistances)
        }
      }, [lineData, coastlinesData, reefsData]);
        useEffect(() => {
            if (pointData && lineData) {
              const filteredElements = pointDataWithDistance.features.filter(element => {
                return (
                  element.properties.nearestRiverDistance < riverSliderValue &&
                  element.properties.nearestCoastDistance < coastSliderValue && 
                  element.properties.nearestReefsDistance < reefsSliderValue &&
                  element.properties.nearestPortDistance < portsSliderValue &&
                  element.properties.nearestLakeDistance < lakesSliderValue
                );
              });
          
              const filteredFeatureCollection = {
                type: 'FeatureCollection',
                features: filteredElements,
              };
          
              setPointDataWithDistanceManipulated(filteredFeatureCollection);
            }
          }, [riverSliderValue, coastSliderValue, reefsSliderValue, portsSliderValue, lakesSliderValue]);

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="h-screen w-1/4 bg-gray-800 fixed left-0 flex flex-col justify-between z-10">
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4 top-1/2">
        <Slider min={0} max={riverSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleRiverSliderChange}/>
        <Slider  min={0} max={coastSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleCoastSliderChange}/>
        <Slider  min={0} max={reefsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleReefsSliderChange}/>
        <Slider min={0} max={portsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handlePortsSliderChange}/>
        <Slider min={0} max={lakesSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleLakesSliderChange}/>
        <p className='text-red'>{pointDataWithDistanceManipulated ? pointDataWithDistanceManipulated.features.length : 0}</p>
          <div className="my-2 text-white">
            <i className="fas fa-home"></i>
          </div>
          <div className="my-2 text-white w-1/2 h-1/2">
          </div>
        </div>
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