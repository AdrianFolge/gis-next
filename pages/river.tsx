import React, { useEffect, useState } from 'react'
import MapComponent from '../components/mapComponentRiver'
import * as turf from '@turf/turf';

const riverLines = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson"
const pointsOfCities = "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson"
const fireEffect = 0;
function river() {
    const [sliderMinValue, setSliderMinValue] = useState(0);
    const [sliderMaxValue, setSliderMaxValue] = useState(0)
    const [pointDataWithDistance, setPointDataWithDistance] = useState(null);
    const [pointData, setPointData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [viewState, setViewState] = useState({
      latitude: 0,
      longitude: 0,
      zoom: 10,
    });
  
    useEffect(() => {
      const pointLayerURL = pointsOfCities;
      const lineLayerURL = riverLines;
  
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
        const distanceValues = []
        updatedPointData.features.forEach(point => {
            distanceValues.push(point.properties.nearestLineDistance)
        })
        console.log(Math.max(...distanceValues))
      };
  useEffect(() => {
    calculateDistancesToNearestLines();
  }, [pointData]);
  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="h-screen w-1/4 bg-gray-800 fixed top-0 left-0 flex flex-col justify-between z-10">
        <div className="p-4">
          {/* Add your navbar items/icons here */}
          <div className="my-2 text-white">
            <i className="fas fa-home"></i>
          </div>
          <div className="my-2 text-white">
            <i className="fas fa-search"></i>
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
        <MapComponent pointLayer={pointDataWithDistance} lineLayer={lineData} viewState={viewState} setViewState={setViewState}/>
    </div>
  )
}

export default river