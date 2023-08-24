import React from 'react'

function ClickedUpperComponent(object) {
    if (!object ||  !object.object ||  !object.object.nearestAirportDistance) {
      return (
        <div className='w-full h-full bg-white'>
          <p>Avstand til nærmeste flyplass: N/A</p>
        </div>
      );
    }
  
    const airport = object.object.nearestAirportDistance;
  
    return (
      <div className='w-full h-full grid grid-cols-3 justify-between'>
        <div className='h-full bg-white'> <p>Avstand til nærmeste flyplass: {Math.ceil(airport.minDistance)} km</p></div>
        <div className='h-full bg-white'> <p>Avstand til nærmeste flyplass: {Math.ceil(airport.minDistance)} km</p></div>
        <div className='h-full bg-white'> <p>Avstand til nærmeste flyplass: {Math.ceil(airport.minDistance)} km</p></div>
      </div>
    );
  }
  
  export default ClickedUpperComponent;