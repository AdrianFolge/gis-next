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

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
});



const getImageSource = (region) => {
  switch (region) {
      case 'Asia':
          return '/images/asia.avif';
      case 'Europe':
          return '/images/europe.jpeg';
      case 'South America':
          return '/images/south_america.jpeg';
      case 'Africa':
          return '/images/africa.jpeg';
      case 'North America':
          return '/images/north_america.jpeg';
      case 'Oceania':
          return '/images/oceania.jpeg';
    // Add more cases for other regions
    default:
      return '/images/else.jpeg'; // Fallback image
  }
};

function ClickedUpperComponent(object) {
    const [images, setImages] = useState([]);
    const [weather, setWeather] = useState(null)
    if (!object ||  !object.object ||  !object.object.nearestAirportDistance) {
      return (
        <div className='w-full h-full bg-white'>
          <p>Avstand til nærmeste flyplass: N/A</p>
        </div>
      );
    }
  
    const airport = object.object.nearestAirportDistance;
    const obj = object.object
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
    }, [object]);
    return (
      <div className='w-full h-full grid grid-cols-3 justify-between gap-6 bg-white'>
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
          <div className='flex gap-3'>
            <h4 className='text-2xl'>{obj.name}</h4>
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
        <div className='h-full items-center justify-center grid grid-rows-5'> 
          <div className='flex gap-3'>
            <p>Avstand til nærmeste flyplass: {Math.ceil(airport.minDistance)} km</p>
            <ConnectingAirportsIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Avstand til nærmeste elv: {Math.ceil(obj.nearestRiverDistance.minDistance)} km</p>
            <KayakingIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Avstand til nærmeste kystlinje: {Math.ceil(obj.nearestCoastDistance.minDistance)} km</p>
            <WavesIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Avstand til nærmeste koralrev: {Math.ceil(obj.nearestReefsDistance.minDistance)} km</p>
            <ScubaDivingIcon/>
          </div>
          <div className='flex gap-3'>
            <p>Avstand til nærmeste havn: {Math.ceil(obj.nearestPortDistance.minDistance)} km</p>
            <DirectionsBoatFilledIcon/>
          </div>
        </div>
      </div>
    );
  }
  
  export default ClickedUpperComponent;