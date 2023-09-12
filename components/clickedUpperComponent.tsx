import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import KayakingIcon from '@mui/icons-material/Kayaking';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import WavesIcon from '@mui/icons-material/Waves';
import ScubaDivingIcon from '@mui/icons-material/ScubaDiving';
import DirectionsBoatFilledIcon from '@mui/icons-material/DirectionsBoatFilled';
import PeopleIcon from '@mui/icons-material/People';
import { createApi } from 'unsplash-js';
import axios from 'axios';
import Smallcard from './smallCard';
import MediumCard from './mediumCard';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
});

function formatCountryName(countryName) {
  if (countryName.includes(' ')) {
    return countryName.toLowerCase().replace(/\s+/g, '-');
  } else {
    return countryName.toLowerCase();
  }
}

function ClickedUpperComponent({object, drivingInfo, setDrivingInstructionsLine, setDrivingInstructionsPointLayer, setListOfInstructions, hotelInfo, setHotelInfo, showHotelInfo,setShowHotelInfo, setViewState, restaurantClicked, setRestaurantClicked}) {
  const [travelAdvisor, setTravelAdvisor] = useState(null);
  const [restaurantID, setRestaurantID] = useState(null)
  const [displayRestaurantInfo, setDisplayRestaurantInfo] = useState(null)
  const [restaurantDetailsID, setRestaurantDetailsID] = useState(null)
  const [restaurantArray, setRestaurantArray] = useState(null)
  const [restaurantAccordionExpanded, setRestaurantAccordionExpanded] = useState(false)
  const [images, setImages] = useState([]);
  const [firstImages, setFirstImages] = useState([])
  const [secondImages, setSecondImages] = useState([])
  const [thirdImages, setThirdImages] = useState([])
  const [weather, setWeather] = useState(null)
  const cityName = object.name.toLowerCase()
  const getTravelAdvisor = {
    method: 'GET',
    url: 'https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng',
    params: {
      latitude: `${object.latitude}`,
      longitude: `${object.longitude}`,
      limit: '30',
      currency: 'USD',
      distance: '2',
      open_now: 'false',
      lunit: 'km',
      lang: 'en_US'
    },
    headers: {
      'X-RapidAPI-Key': '009df56685msh0c6db62aeb97668p1a6c24jsn9d4b6be588fd',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }  
  };

  const options = {
    method: 'GET',
    url: 'https://hotels4.p.rapidapi.com/locations/search',
    params: {
      query: `${cityName}`,
    },
    headers: {
      'X-RapidAPI-Key': '009df56685msh0c6db62aeb97668p1a6c24jsn9d4b6be588fd',
      'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
    }
  };

  const tripadvisorRestaurantsId = {
    method: 'GET',
    url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchLocation',
    params: { query: `${cityName}` },
    headers: {
      'X-RapidAPI-Key': '009df56685msh0c6db62aeb97668p1a6c24jsn9d4b6be588fd',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
  };

  const tripAdvisorOptionsRestaurants = {
    method: 'GET',
    url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/searchRestaurants',
    params: { locationId: `${restaurantID}` },
    headers: {
      'X-RapidAPI-Key': '009df56685msh0c6db62aeb97668p1a6c24jsn9d4b6be588fd',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
  };

  const tripAdvisorRestaurantDetail = {
    method: 'GET',
    url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails',
    params: {     restaurantsId: `${restaurantDetailsID}`,
                  currencyCode: 'USD' 
    },
    headers: {
      'X-RapidAPI-Key': '009df56685msh0c6db62aeb97668p1a6c24jsn9d4b6be588fd',
      'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
    }
  };

  if (!object || !object.nearestAirportDistance) {
    return (
      <div className='w-full h-full bg-white'>
        <p>Avstand til nærmeste flyplass: N/A</p>
      </div>
    );
  }
  const firstImage = object.nearestAttractions.features[0].properties.name
  const secondImage = object.nearestAttractions.features[1].properties.name
  const thirdImage = object.nearestAttractions.features[2].properties.name
  const airport = object.nearestAirportDistance;
  const obj = object
  useEffect(() => {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?forecast_days&latitude=${obj.latitude}&longitude=${obj.longitude}&hourly=temperature_2m&hourly=cloudcover&hourly=rain`
    axios.get(apiUrl)
    .then(response => {
      const weatherData = response.data;
      setWeather(weatherData)
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
    unsplash.search.getPhotos({ query: obj.name, perPage: 1 }).then(result => {
      if (result.errors) {
        console.error(result.errors);
      } else {
        setImages(result.response.results);
      }
    });
    unsplash.search.getPhotos({ query: firstImage, perPage: 1 }).then(result => {
      if (result.errors) {
        console.error(result.errors);
      } else {
        setFirstImages(result.response.results);
      }
    });
    unsplash.search.getPhotos({ query: secondImage, perPage: 1 }).then(result => {
      if (result.errors) {
        console.error(result.errors);
      } else {
        setSecondImages(result.response.results);
      }
    });
    unsplash.search.getPhotos({ query: thirdImage, perPage: 1 }).then(result => {
      if (result.errors) {
        console.error(result.errors);
      } else {
        setThirdImages(result.response.results);
      }
    });
    axios.request(options)
    .then(response => {
      const cityInfo = response.data;
      setHotelInfo(cityInfo.suggestions)
    })
    .catch(error => {
      console.error(error);
    });

    axios.request(getTravelAdvisor)
    .then(response => {
      console.log(response.data.data);
      setRestaurantArray(response.data.data)
      
    })
    .catch(error => {
      console.error(error);
    });
    }, [object]);

    

  function handleMediumCardClick(features, object){
    const routeFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [object.longitude, object.latitude],
          [features.geometry.coordinates[0], features.geometry.coordinates[1]],
        ],
      },
    };
    setDrivingInstructionsPointLayer(routeFeature)
      const apiUrl =
        `https://api.mapbox.com/directions/v5/mapbox/driving/${object.longitude}%2C${object.latitude}%3B${features.geometry.coordinates[0]}%2C${features.geometry.coordinates[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`;
  
      axios.get(apiUrl)
        .then(response => {
          console.log("RESPONSE: ", response);
          setListOfInstructions(response.data.routes[0].legs[0].steps)
          const lineFeature = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: response.data.routes[0].geometry.coordinates,
            },
          };
          setDrivingInstructionsLine(lineFeature)
        })
        .catch(error => {
          console.error('Error fetching directions:', error);
        });

  };
  const formattedCountryName = formatCountryName(obj.adm0name);
  const arrayOfImages = [firstImages, secondImages, thirdImages];
  
  const handleAccordionChange = (event, isExpanded) => {
    // Update showHotelInfo state based on whether the Accordion is expanded
    setShowHotelInfo(isExpanded);
  };
  const handleRestaurantAccordion = (event, isExpanded) => {
    setRestaurantAccordionExpanded(isExpanded)
    if(!isExpanded){
      setRestaurantClicked({
        isClicked: false,
        latitude: null,
        longitude: null
      })
    }
  }
  function handleRestaurantClick(restaurant) {
    setDisplayRestaurantInfo(restaurant)
    setRestaurantClicked({
      isClicked: true,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    });
    setViewState({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      zoom: 16,
  })}
  return (
    <div className='w-full h-full grid grid-cols-4 justify-between gap-6 bg-white'>
        {!restaurantClicked.isClicked ? (
          <>
            <div className='h-full items-center flex justify-center'> 
              <div className="relative h-full w-full flex-shrink-0">
                    {images.length > 0 ? (
                      <Image alt="" src={images[0].urls.regular} layout="fill" objectFit="cover" unoptimized={true} className='rounded-xl'/>
                    ) : (
                      <p>No images available.</p>
                    )}
              </div>
            </div>
              <div className='h-full items-center justify-center grid grid-rows-5'> 
                <div className='flex gap-3 items-center'>
                  <h4 className='text-2xl'>{obj.name}</h4>
                  <div className="relative h-6 w-6">
                    <Image 
                        alt=""
                        src={`https://cdn.countryflags.com/thumbs/${formattedCountryName}/flag-square-500.png`}
                        layout="fill"
                        className="rounded-lg"
                        unoptimized={true}
                    />
                  </div>
                </div>
                  <div className='flex gap-3'>
                    <h1 className='text-l'>Innbyggertall: {Math.ceil(obj.pop_max)}</h1>
                    <PeopleIcon />
                  </div>
                  {weather && (
                  <div className='flex row-span-3 overflow-x-auto'>
                    {Array.from({ length: 7 }, (_, index) => (
                      <Smallcard key={index} result={weather} day={index*24}/>
                    ))}
                  </div>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-rows-3 gap-4 justify-center ml-20'>
                  {object.nearestAttractions.features.map((feature, index) => (
                    <MediumCard key={index} title={feature.properties.name} img={arrayOfImages[index]} drivingInfo={drivingInfo} index={index} onClick={() => handleMediumCardClick(feature, object)}/>
                  ))}
                </div>
                </>
        ): (displayRestaurantInfo &&  
        <div className='h-full items-center flex col-span-3 pl-2 grid-cols-2 bg-gray-100 p-4 rounded-lg shadow-md gap-2 overflow-y-auto'>
          <div className="w-full h-full">
            <h2 className="text-2xl font-semibold mb-2">
              {displayRestaurantInfo.name}
            </h2>
            <p className="text-gray-700">
              {displayRestaurantInfo.description}
            </p>
            <div className="mt-2">
              <span className="text-green-500">Price Level:</span> {displayRestaurantInfo.price_level} ({displayRestaurantInfo.price})
            </div>
            <div className="mt-2">
              <span className="text-blue-500">Location:</span> {displayRestaurantInfo.address}
            </div>
            <div className="mt-2">
              <span className={displayRestaurantInfo.is_closed === false ? "text-green-500" : "text-red-500"}>{displayRestaurantInfo.is_closed === false ? "Open" : "Closed"}</span>
            </div>
            <div className="mt-2">
              <a className="text-blue-500 hover:underline">{displayRestaurantInfo.website}</a>
            </div>
          </div> 
          <div className='w-full h-full'>
          {displayRestaurantInfo && displayRestaurantInfo.photo && displayRestaurantInfo.photo.images && displayRestaurantInfo.photo.images.medium ? (
          <Image alt={""}  src={displayRestaurantInfo.photo.images.medium.url} className="rounded-xl w-full h-full" width={100} height={100} unoptimized={true}/>
          ) : (
            <Image src="/images/rest.jpeg" alt="Fallback Restaurant" className="rounded-xl w-full h-full" width={100} height={100} />
            )}
          </div>
        </div>)}
        <div className='overflow-y-auto'>
        <Accordion className="">
            <AccordionSummary className="bg-white rounded-lg" expandIcon={<ExpandMoreIcon />}>
              <h3 className='mx-auto text-center'>Aktiviteter</h3>
            </AccordionSummary>
            <AccordionDetails>
        <div className='h-full items-center justify-center grid grid-rows-5'> 
          <div className='flex gap-3 p-3 rounded-lg' style={{backgroundColor: "#800080"}} onClick={() => handleMediumCardClick(object.nearestAirportDistance.properties, object)}>
            <p>Nærmeste flyplass: {airport.properties.properties.name_en} ({Math.ceil(airport.minDistance)}) km</p>
            <ConnectingAirportsIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Nærmeste elv: {obj.nearestRiverDistance.properties.properties.name} ({Math.ceil(obj.nearestRiverDistance.minDistance)}) km</p>
            <KayakingIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Nærmeste kystlinje: {Math.ceil(obj.nearestCoastDistance.minDistance)} km</p>
            <WavesIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Nærmeste koralrev: {Math.ceil(obj.nearestReefsDistance.minDistance)} km</p>
            <ScubaDivingIcon/>
          </div>
          <div className='flex gap-3 p-3 rounded-lg' style={{backgroundColor: "#4169E1"}} onClick={() => handleMediumCardClick(object.nearestPortDistance.properties, object)}>
            <p>Nærmeste havn: {obj.nearestPortDistance.properties.properties.name} ({Math.ceil(obj.nearestPortDistance.minDistance)}) km</p>
            <DirectionsBoatFilledIcon/>
          </div>
        </div>
        </AccordionDetails>
        </Accordion>
        <Accordion className="overflow-y-auto" expanded={showHotelInfo} onChange={handleAccordionChange} >
            <AccordionSummary className="bg-white rounded-lg" expandIcon={<ExpandMoreIcon />}>
              <h3 className='mx-auto text-center'>Hoteller</h3>
            </AccordionSummary>
            <AccordionDetails>
        <div className=' justify-center items-center overflow-y-auto '> 
          {hotelInfo && hotelInfo.map(hotel => (
                <div className='overflow-y-auto justify-center items-center text-center'>
                  {hotel.entities.map(entity => (
                    <p className='m-3'>{entity.name}</p>
                  ))}
                </div>
          ))}
        </div>
        </AccordionDetails>
        </Accordion>
        <Accordion className="overflow-y-auto" expanded={restaurantAccordionExpanded} onChange={handleRestaurantAccordion}>
            <AccordionSummary className="bg-white rounded-lg" expandIcon={<ExpandMoreIcon />}>
              <h3 className='mx-auto text-center'>Restauranter</h3>
            </AccordionSummary>
            <AccordionDetails>
        <div className=' justify-center items-center overflow-y-auto '> 
                <div className='overflow-y-auto justify-center items-center text-center'>
                  {restaurantArray && restaurantArray.map(restaurant => (
                    <div className='hover:bg-gray-300 rounded-lg cursor-pointer' onClick={() => handleRestaurantClick(restaurant)}>
                    <p className='m-3'>{restaurant.name}</p>
                    </div>
                  ))}
                </div>
        </div>
        </AccordionDetails>
        </Accordion>
        </div>
    </div>
  );
}
  
  export default ClickedUpperComponent;