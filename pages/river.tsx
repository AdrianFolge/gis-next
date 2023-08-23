import React, { useEffect, useState } from 'react'
import MapComponent from '../components/mapComponentRiver'
import Slider from '@mui/material/Slider';
import { calculateDistancesToNearestLine, calculateDistancesToNearestPoint, calculateDistancesToNearestPointPolygon } from '../helpers/helperFunctions';
import InfoCard from '../components/card';
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
      <div className="h-screen w-1/4 bg-gray-800 fixed left-0 flex flex-col  z-10">
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <h3 className='mx-auto text-center'>Distance from River</h3>
        <Slider min={0} max={riverSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleRiverSliderChange}/>
        </div>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <h3 className='mx-auto text-center'>Distance from coast</h3>
        <Slider  min={0} max={coastSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleCoastSliderChange}/>
        </div>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <h3 className='mx-auto text-center'>Distance from reef</h3>
        <Slider  min={0} max={reefsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleReefsSliderChange}/>
        </div>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <h3 className='mx-auto text-center'>Distance from port</h3>
        <Slider min={0} max={portsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handlePortsSliderChange}/>
        </div>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
        <h3 className='mx-auto text-center'>Distance from lake</h3>
        <Slider min={0} max={lakesSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleLakesSliderChange}/>
        </div>
        <div className="justify-between items-center center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
            <p className='mx-auto text-center'>Points matching your description: {pointDataWithDistanceManipulated ? pointDataWithDistanceManipulated.features.length : 0}</p>
        </div>
        <div className='m-4 overflow-y-auto'>
            {pointDataWithDistanceManipulated && pointDataWithDistanceManipulated.features && pointDataWithDistanceManipulated.features.length > 0 ? (
                pointDataWithDistanceManipulated.features.map(feature => (
                    <InfoCard object={feature} />
                ))
                ) : (
                <p>No matching features found.</p>
                )}
        </div>
      </div>
        <MapComponent pointLayer={pointDataWithDistanceManipulated} lineLayer={lineData} portsPointLayer={portsData} viewState={viewState} setViewState={setViewState} coastLinesLayer={coastlinesData} reefsLayer={reefsData} lakesLayer={lakesData}/>
    </div>
  )
}

export default river