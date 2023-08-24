import React, { useEffect, useState, useRef } from 'react'
import MapComponent from '../components/mapComponentRiver'
import { MapRef } from "react-map-gl"
import Slider from '@mui/material/Slider';
import { calculateDistancesToNearestLine, calculateDistancesToNearestPoint, calculateDistancesToNearestPointPolygon } from '../helpers/helperFunctions';
import InfoCard from '../components/card';
import ClickedUpperComponent from '../components/clickedUpperComponent';

const riverLines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointsOfCities = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson"
const pointsOfPorts = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson"
const coastlines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_coastline.geojson"
const lakes = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson"
const reefs = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_reefs.geojson"
const airport = "https://raw.githubusercontent.com/AdrianFolge/gis-next/main/data/osm-world-airports%40babel.geojson"

function river() {
    const [riverSliderMaxValue, setRiverSliderMaxValue] = useState(0)
    const [riverSliderValue, setRiverSliderValue] = useState(0);

    const [coastSliderMaxValue, setCoastSliderMaxValue] = useState(0)
    const [coastSliderValue, setCoastSliderValue] = useState(0);

    const [reefsSliderMaxValue, setReefsSliderMaxValue] = useState(0)
    const [reefsSliderValue, setReefsSliderValue] = useState(0);

    const [portsSliderMaxValue, setPortsSliderMaxValue] = useState(0)
    const [portsSliderValue, setPortsSliderValue] = useState(0);

    const [airportsSliderMaxValue, setAirportsSliderMaxValue] = useState(0)
    const [airportsSliderValue, setAirportsSliderValue] = useState(0);

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
    const [airportData, setAirportData] = useState(null);

    const [singleCityFeature, setSingleCityFeature] = useState(null)
    const [singlePortFeature, setSinglePortFeature] = useState(null)
    const [singleAirportFeature, setSingleAirportFeature] = useState(null)
    const [singleReefFeature, setSingleReefFeature] = useState(null)
    const [singleRiverFeature, setSingleRiverFeature] = useState(null)
    const [singleCoastFeature, setSingleCoastFeature] = useState(null)

    const [clickedLayerData, setClickedLayerData] = useState(null)

    const [airportObject, setAirportObject] = useState(null)

    const [infoCardClicked, setInfoCardClicked] = useState(false);

    const handleUpperDivClick = () => {
      setInfoCardClicked(!infoCardClicked);
      setSingleCityFeature(null)
    };
      
    
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
    const mapReference = useRef<MapRef>()
    const handleInfoCardClick = (latitude, longitude, object) => {
        setInfoCardClicked(true);
        const cityFeature = {
            type: 'Feature',
            geometry: object.geometry,
            properties: {
            }

        }
        setSingleCityFeature(cityFeature)
        const portFeature = {
            type: 'Feature',
            geometry: object.properties.nearestPortDistance.properties.geometry,
            properties: {
            }
        }
        setSinglePortFeature(portFeature)
        const airportFeature = {
            type: 'Feature',
            geometry: object.properties.nearestAirportDistance.properties.geometry,
            properties: {
            }
        }
        setSingleAirportFeature(airportFeature)
        const reefsFeature = {
            type: 'Feature',
            geometry: object.properties.nearestReefsDistance.properties.geometry,
            properties: {
            }
        }
        setSingleReefFeature(reefsFeature)
        const riverFeature = {
            type: 'Feature',
            geometry: object.properties.nearestRiverDistance.properties.geometry,
            properties: {
            }
        }
        setSingleRiverFeature(riverFeature)
        const coastFeature = {
            type: 'Feature',
            geometry: object.properties.nearestCoastDistance.properties.geometry,
            properties: {
            }
        }
        setSingleCoastFeature(coastFeature)
        setAirportObject(object.properties)
        setViewState({
            latitude: latitude,
            longitude: longitude,
            zoom: 8,
        });
        mapReference.current?.flyTo({center: [longitude,latitude], duration: 2000, zoom: 5});
      };
    useEffect(() => {
      const pointLayerURL = pointsOfCities;
      const lineLayerURL = riverLines;
      const portPointsURL = pointsOfPorts
      const coastlinesURL = coastlines;
      const lakesURL = lakes;
      const reefsURL = reefs;
      const airportURL = airport
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
        fetch(airportURL)
        .then(response => response.json())
        .then(geojson => {
          setAirportData(geojson);
        });
    }, []);

    useEffect(() => {
        if (pointData && lineData && coastlinesData) {
          const arrayReefsDistances = calculateDistancesToNearestLine({
            pointData,
            lineData: reefsData,
            setSliderMaxValue: setReefsSliderMaxValue,
            setSliderValue: setReefsSliderValue,
            propertyName: "nearestReefsDistance"
        });
            const arrayCoastDistances = calculateDistancesToNearestLine({
              pointData,
              lineData: coastlinesData,
              setSliderMaxValue: setCoastSliderMaxValue,
              setSliderValue: setCoastSliderValue,
              propertyName: "nearestCoastDistance"
        });
             const arrayRiverDistances = calculateDistancesToNearestLine({
              pointData,
              lineData,
              setSliderMaxValue: setRiverSliderMaxValue,
              setSliderValue: setRiverSliderValue,
              propertyName: "nearestRiverDistance"
        });
            const arrayPortsDistances = calculateDistancesToNearestPoint({
                pointData,
                referenceData: portsData,
                setSliderMaxValue: setPortsSliderMaxValue,
                setSliderValue: setPortsSliderValue,
                propertyName: "nearestPortDistance"
        });
        const arrayAirportsDistances = calculateDistancesToNearestPoint({
            pointData,
            referenceData: airportData,
            setSliderMaxValue: setAirportsSliderMaxValue,
            setSliderValue: setAirportsSliderValue,
            propertyName: "nearestAirportDistance"
        });
        const arrayLakesDistances = calculateDistancesToNearestPointPolygon({
            pointData,
            polygonData: lakesData,
            setSliderMaxValue: setLakesSliderMaxValue,
            setSliderValue: setLakesSliderValue,
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
                    nearestLakeDistance: arrayLakesDistances[index],
                    nearestAirportDistance: arrayAirportsDistances[index],
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
                  element.properties.nearestRiverDistance.minDistance < riverSliderValue &&
                  element.properties.nearestCoastDistance.minDistance < coastSliderValue && 
                  element.properties.nearestReefsDistance.minDistance < reefsSliderValue &&
                  element.properties.nearestPortDistance.minDistance < portsSliderValue &&
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
                {riverSliderMaxValue > 0 && (
                    <Slider defaultValue={riverSliderMaxValue} min={0} max={riverSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleRiverSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <h3 className='mx-auto text-center'>Distance from coast</h3>
                {coastSliderMaxValue > 0 && (
                    <Slider defaultValue={coastSliderMaxValue} min={0} max={coastSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleCoastSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <h3 className='mx-auto text-center'>Distance from reef</h3>
                {reefsSliderMaxValue > 0 && (
                    <Slider defaultValue={reefsSliderMaxValue} min={0} max={reefsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleReefsSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <h3 className='mx-auto text-center'>Distance from port</h3>
                {portsSliderMaxValue > 0 && (
                    <Slider defaultValue={portsSliderMaxValue} min={0} max={portsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handlePortsSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <h3 className='mx-auto text-center'>Distance from lake</h3>
                {lakesSliderMaxValue > 0 && (
                    <Slider defaultValue={lakesSliderMaxValue} min={0} max={lakesSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleLakesSliderChange}/>
                )}
            </div>
        <div className="justify-between items-center center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
            <p className='mx-auto text-center'>Points matching your description: {pointDataWithDistanceManipulated ? pointDataWithDistanceManipulated.features.length : 0}</p>
        </div>
        <div className='m-4 overflow-y-auto'>
            {pointDataWithDistanceManipulated && pointDataWithDistanceManipulated.features && pointDataWithDistanceManipulated.features.length > 0 ? (
                pointDataWithDistanceManipulated.features.map(feature => (
                    <InfoCard object={feature} onClick={() => handleInfoCardClick(feature.properties.lat_y, feature.properties.long_x, feature)}/>
                ))
                ) : (
                <p>No matching features found.</p>
                )}
        </div>
      </div>
      {infoCardClicked && (
      <div
          className="fixed top-0 left-1/4 w-3/4 h-1/4 bg-black opacity-50 z-20"
          onClick={handleUpperDivClick}
        >
            <ClickedUpperComponent object={airportObject}/>
        </div> )}
        <MapComponent pointLayer={pointDataWithDistanceManipulated} lineLayer={lineData} portsPointLayer={portsData} viewState={viewState} setViewState={setViewState} coastLinesLayer={coastlinesData} reefsLayer={reefsData} lakesLayer={lakesData} mapReference={mapReference} airportLayer={airportData} singleCityFeature={singleCityFeature} singleAirportFeature={singleAirportFeature} singleCoastFeature={singleCoastFeature} singlePortFeature={singlePortFeature} singleReefFeature={singleReefFeature} singleRiverFeature={singleRiverFeature}/>
    </div>
  )
}

export default river