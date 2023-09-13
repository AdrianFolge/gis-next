import React, { useEffect, useState, useRef } from 'react'
import MapComponent from '../components/mapComponentRiver'
import { MapRef } from "react-map-gl"
import Slider from '@mui/material/Slider';
import { calculateDistancesToNearestLine, calculateDistancesToNearestPoint, calculateDistancesToNearestPointPolygon, findClosestAttractions } from '../helpers/helperFunctions';
import InfoCard from '../components/card';
import ClickedUpperComponent from '../components/clickedUpperComponent';
import { Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const riverLines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointsOfCities = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_populated_places_simple.geojson"
const pointsOfPorts = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson"
const coastlines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_coastline.geojson"
const lakes = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson"
const reefs = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_reefs.geojson"
const airport = "https://raw.githubusercontent.com/AdrianFolge/gis-next/main/data/osm-world-airports%40babel.geojson"
const attractions = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_populated_places_simple.geojson"

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
    const [hotelInfo, setHotelInfo] = useState(null)
    const [showHotelInfo, setShowHotelInfo] = useState(false);

    const [pointDataWithDistance, setPointDataWithDistance] = useState(null);
    const [pointDataWithDistanceManipulated, setPointDataWithDistanceManipulated] = useState(null);
    const [pointData, setPointData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [portsData, setPortsData] = useState(null)
    const [coastlinesData, setCoastlinesData] = useState(null);
    const [lakesData, setLakesData] = useState(null);
    const [reefsData, setReefsData] = useState(null)
    const [airportData, setAirportData] = useState(null);
    const [attractionsData, setAttractionsData] = useState(null)

    const [singleCityFeature, setSingleCityFeature] = useState(null)
    const [singlePortFeature, setSinglePortFeature] = useState(null)
    const [singleAirportFeature, setSingleAirportFeature] = useState(null)
    const [singleReefFeature, setSingleReefFeature] = useState(null)
    const [singleRiverFeature, setSingleRiverFeature] = useState(null)
    const [singleCoastFeature, setSingleCoastFeature] = useState(null)
    const [threeAttractionsFeature, setThreeAttractionsFeature] = useState(null)

    const[showRiversLayer, setShowRiversLayer] = useState(false);
    const[showLakesLayer, setShowLakesLayer] = useState(false);
    const[showPortsLayer, setShowPortsLayer] = useState(false);
    const[showAirportsLayer, setShowAirportsLayer] = useState(false);
    const[showReefsLayer, setShowReefsLayer] = useState(false);
    const[showCoastsLayer, setShowCoastsLayer] = useState(false);

    const [restaurantClicked, setRestaurantClicked] = useState({
      isClicked: false,
      latitude: null,
      longitude: null,
    })

    const[drivingInfo, setDrivingInfo] = useState(null)

    const [airportObject, setAirportObject] = useState(null)

    const [infoCardClicked, setInfoCardClicked] = useState(false);

    // Driving instructions

    const [drivingInstructionsLine, setDrivingInstructionsLine] = useState(null)
    const [drivingInstructionsPointLayer, setDrivingInstructionsPointLayer] = useState(null)

    const [listOfInstructions, setListOfInstructions] = useState(null)

    const handleUpperDivClick = () => {
      setInfoCardClicked(!infoCardClicked);
      setSingleCityFeature(null)
      setDrivingInstructionsLine(null)
      setDrivingInstructionsPointLayer(null)
      setListOfInstructions(null)
    };
      
    const handleShowRiversChange = () => {
        setShowRiversLayer(prevValue => !prevValue);
      };
    const handleShowCoastsChange = () => {
        setShowCoastsLayer(prevValue => !prevValue);
    };
    const handleShowAirportsChange = () => {
        setShowAirportsLayer(prevValue => !prevValue);
    };
    const handleShowLakesChange = () => {
        setShowLakesLayer(prevValue => !prevValue);
    };
    const handleShowPortsChange = () => {
        setShowPortsLayer(prevValue => !prevValue);
    };
    const handleShowReefsChange = () => {
        setShowReefsLayer(prevValue => !prevValue);
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
      latitude: 10.56,
      longitude: 63.161,
      zoom: 6,
    });
    const mapReference = useRef<MapRef>()
    const handleInfoCardClick = (latitude, longitude, object) => {
      setDrivingInstructionsLine(null)
      setDrivingInstructionsPointLayer(null)
      setListOfInstructions(null)
        const attractionsFeature = object.properties.nearestAttractions;
        setThreeAttractionsFeature(attractionsFeature)
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
            geometry: object.properties.nearestAirportDistance ? object.properties.nearestAirportDistance.properties.geometry : null,
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
            zoom: 4,
        });
        mapReference.current?.flyTo({center: [longitude,latitude], duration: 2000, zoom: 8});
      };
    useEffect(() => {
      const pointLayerURL = pointsOfCities;
      const lineLayerURL = riverLines;
      const portPointsURL = pointsOfPorts
      const coastlinesURL = coastlines;
      const lakesURL = lakes;
      const reefsURL = reefs;
      const airportURL = airport
      const attractionsURL = attractions  
      fetch(attractionsURL)
        .then(response => response.json())
        .then(geojson => {
          setAttractionsData(geojson);
      });
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
        if (pointData && lineData && coastlinesData && attractionsData) {
            const arrayNearestAttractions = findClosestAttractions(pointData, attractionsData, 3)
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
                    nearestAttractions: arrayNearestAttractions[index]
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
  const [visibleCardIndex, setVisibleCardIndex] = useState(0);

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop;
    const screenHeight = window.innerHeight;
    const cardHeight = screenHeight / 5;
    const newIndex = Math.ceil((scrollPosition / cardHeight));
    setVisibleCardIndex(newIndex);
    const lineFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: listOfInstructions[newIndex].geometry.coordinates,
      },
      properties: {},
    };
    setDrivingInstructionsLine(lineFeature)
    mapReference.current?.flyTo({center: [lineFeature.geometry.coordinates[0][0],lineFeature.geometry.coordinates[0][1]], duration: 1000, zoom: 17});
  }
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="h-screen w-1/4 bg-gray-800 fixed left-0 flex flex-col  z-10">
          <Accordion className='bg-gray-800'>
            <AccordionSummary className="bg-white rounded-lg m-4" expandIcon={<ExpandMoreIcon />}>
              <h3 className='mx-auto text-center'>Juster kriterier</h3>
            </AccordionSummary>
            <AccordionDetails>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <div className='flex justify-center items-center'>
                <h3 className='mx-auto text-center'>Distanse til elv</h3>
                <FormControlLabel
                    control={<Checkbox checked={showRiversLayer} onChange={handleShowRiversChange} />}
                    label="Vis elver"
                />
                </div>
                {riverSliderMaxValue > 0 && (
                    <Slider defaultValue={riverSliderMaxValue} min={0} max={riverSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleRiverSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <div className='flex justify-center items-center'>
                <h3 className='mx-auto text-center'>Distanse til Kyst</h3>
                <FormControlLabel
                    control={<Checkbox checked={showCoastsLayer} onChange={handleShowCoastsChange} />}
                    label="Vis kystlinje"
                />
                </div>
                {coastSliderMaxValue > 0 && (
                    <Slider defaultValue={coastSliderMaxValue} min={0} max={coastSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleCoastSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <div className='flex justify-center items-center'>
                <h3 className='mx-auto text-center'>Distanse til Koralrev</h3>
                <FormControlLabel
                    control={<Checkbox checked={showReefsLayer} onChange={handleShowReefsChange} />}
                    label="Vis koralrev"
                />
                </div>
                {reefsSliderMaxValue > 0 && (
                    <Slider defaultValue={reefsSliderMaxValue} min={0} max={reefsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleReefsSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <div className='flex justify-center items-center'>
                <h3 className='mx-auto text-center'>Distanse til havn</h3>
                <FormControlLabel
                    control={<Checkbox checked={showPortsLayer} onChange={handleShowPortsChange} />}
                    label="Vis havndata"
                />
                </div>
                {portsSliderMaxValue > 0 && (
                    <Slider defaultValue={portsSliderMaxValue} min={0} max={portsSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handlePortsSliderChange}/>
                )}
                </div>
                <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4">
                <div className='flex justify-center items-center'>
                <h3 className='mx-auto text-center'>Distanse til innsjø</h3>
                <FormControlLabel
                    control={<Checkbox checked={showLakesLayer} onChange={handleShowLakesChange} />}
                    label="Vis innsjø"
                />
                </div>
                {lakesSliderMaxValue > 0 && (
                    <Slider defaultValue={lakesSliderMaxValue} min={0} max={lakesSliderMaxValue} aria-label="Default" valueLabelDisplay="auto" onChange={handleLakesSliderChange}/>
                )}
            </div>
            </AccordionDetails>
      </Accordion>
        <div className="justify-between items-center center bg-white bg-opacity-90 p-4 rounded-md shadow-md m-4 flex">
            <p className='mx-auto text-center'>Antall punkter: {pointDataWithDistanceManipulated ? pointDataWithDistanceManipulated.features.length : 0}</p>
            <FormControlLabel
                    control={<Checkbox checked={showAirportsLayer} onChange={handleShowAirportsChange} />}
                    label="Vis flyplasser"
                />
        </div>
        <div className='m-4 overflow-y-auto'>
            {pointDataWithDistanceManipulated && pointDataWithDistanceManipulated.features && pointDataWithDistanceManipulated.features.length > 0 ? (
                pointDataWithDistanceManipulated.features.map(feature => (
                    <InfoCard object={feature} onClick={() => handleInfoCardClick(feature.properties.latitude, feature.properties.longitude, feature)}/>
                ))
                ) : (
                <p>No matching features found.</p>
                )}
        </div>
      </div>
      {infoCardClicked && (
      <div
          className="fixed top-0 left-1/4 w-3/4 h-1/3 bg-black z-20"
        >
            <ClickedUpperComponent object={airportObject} drivingInfo={drivingInfo} setDrivingInstructionsLine={setDrivingInstructionsLine} setDrivingInstructionsPointLayer={setDrivingInstructionsPointLayer} setListOfInstructions={setListOfInstructions} hotelInfo={hotelInfo} setHotelInfo={setHotelInfo} showHotelInfo={showHotelInfo} setShowHotelInfo={setShowHotelInfo} setViewState={setViewState} restaurantClicked={restaurantClicked} setRestaurantClicked={setRestaurantClicked}/>
        </div> )}
      {drivingInstructionsPointLayer && listOfInstructions && (
        <div className='fixed top-2/4 left-3/4 w-1/4 h-1/5 gap-2 z-20 bg-opacity-60 overflow-y-auto' onScroll={handleScroll}>
              {listOfInstructions.map(instruction => (
                <div className='bg-white p-3 h-full z-20 flex justify-center items-center bg-opacity-0 rounded-lg'>
                  <div className='p-5 bg-white rounded-xl'>
                    <h1>
                    {instruction.maneuver.instruction}
                    </h1>
                    <h1>
                    ({Math.ceil(instruction.distance)} m)
                    </h1>
                </div>
              </div>
              ))}
        </div>
      )}
        <MapComponent pointLayer={pointDataWithDistanceManipulated} lineLayer={lineData} portsPointLayer={portsData} viewState={viewState} setViewState={setViewState} coastLinesLayer={coastlinesData} reefsLayer={reefsData} lakesLayer={lakesData} mapReference={mapReference} airportLayer={airportData} singleCityFeature={singleCityFeature} singleAirportFeature={singleAirportFeature} singleCoastFeature={singleCoastFeature} singlePortFeature={singlePortFeature} singleReefFeature={singleReefFeature} singleRiverFeature={singleRiverFeature} showAirportsLayer={showAirportsLayer} showCoastsLayer={showCoastsLayer} showLakesLayer={showLakesLayer} showPortsLayer={showPortsLayer} showReefsLayer={showReefsLayer} showRiversLayer={showRiversLayer} threeAttractionsFeature={threeAttractionsFeature} setDrivingInfo={setDrivingInfo} drivingInstructionsLine={drivingInstructionsLine} drivingInstructionsPointLayer={drivingInstructionsPointLayer} onClick={handleUpperDivClick} hotelInfo={hotelInfo} showHotelInfo={showHotelInfo} restaurantClicked={restaurantClicked}/>
    </div>
  )
}

export default river