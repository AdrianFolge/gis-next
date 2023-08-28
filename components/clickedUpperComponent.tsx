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


function ClickedUpperComponent({object, drivingInfo}) {
    const [images, setImages] = useState([]);
    const [firstImages, setFirstImages] = useState([])
    const [secondImages, setSecondImages] = useState([])
    const [thirdImages, setThirdImages] = useState([])
    const [weather, setWeather] = useState(null)
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
    }, [object]);
    const formattedCountryName = formatCountryName(obj.adm0name);
    const arrayOfImages = [firstImages, secondImages, thirdImages]
    return (
      <div className='w-full h-full grid grid-cols-4 justify-between gap-6 bg-white'>
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
            <MediumCard key={index} title={feature.properties.name} img={arrayOfImages[index]} drivingInfo={drivingInfo} index={index}/>
          ))}
        </div>
        <div className='h-full items-center justify-center grid grid-rows-5'> 
          <div className='flex gap-3'>
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
          <div className='flex gap-3'>
            <p>Nærmeste havn: {obj.nearestPortDistance.properties.properties.name} ({Math.ceil(obj.nearestPortDistance.minDistance)}) km</p>
            <DirectionsBoatFilledIcon/>
          </div>
        </div>
      </div>
    );
  }
  
  export default ClickedUpperComponent;