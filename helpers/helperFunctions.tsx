import * as turf from '@turf/turf';
import { polygonToLine } from '@turf/polygon-to-line';
import { FeatureCollection, Point } from 'geojson';
import { useEffect } from 'react';
export interface GeoJSONFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }
  
const calculateBoundingBox = (geojson: GeoJSONFeature[]) => {
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;
  
    geojson.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    });
  
    return { minLng, minLat, maxLng, maxLat };
  };
  
export const calculateCenter = (geojson: GeoJSONFeature[]) => {
    if (geojson.length === 0) {
      return { latitude: 0, longitude: 0, zoom: 10 };
    }
  
    const { minLng, minLat, maxLng, maxLat } = calculateBoundingBox(geojson);
  
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
  
    const distanceLng = maxLng - minLng;
    const distanceLat = maxLat - minLat;
    const zoom = Math.min(
      Math.floor(Math.log2(360 / distanceLng)),
      Math.floor(Math.log2(180 / distanceLat))
    );
  
    return { latitude: centerLat, longitude: centerLng, zoom };
  };



export interface CountryPoints {
    [continent: string]: number;
}

export const countPointsByCountry = (geojsonData: GeoJSON.FeatureCollection): CountryPoints => {
    const pointsByCountry: CountryPoints = {};

    geojsonData.features.forEach((feature) => {
        const country = feature.properties?.adm0name; 
        if (country) {
            pointsByCountry[country] = (pointsByCountry[country] || 0) + 1;
        }
    });

    return pointsByCountry;
};

export const getTopThreeCountries = (countryPoints: CountryPoints): Array<{ country: string; points: number }> => {
  const sortedCountries = Object.keys(countryPoints).sort(
      (a, b) => countryPoints[b] - countryPoints[a]
  );

  return sortedCountries.slice(0, 3).map(country => ({
      country,
      points: countryPoints[country],
  }));
};

export function ElementList({ elements, filterValue }) {
  const filteredElements = elements.filter(element => {
    return element.properties.nearestLineDistance < filterValue;
  })};


const findNearestLineDistance = (point, lines) => {
  let minDistance = Number.MAX_VALUE;
  let nearestLineProperties = null
  
  lines.features.forEach(line => {
    if (line.geometry.type !== "MultiLineString") {
      const distance = turf.pointToLineDistance(point, line);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLineProperties = line;
        }
    }
  });
  return {
    minDistance: minDistance,
    properties: nearestLineProperties
  };
};

interface CalculateDistancesToNearestLineProps {
  pointData: FeatureCollection<Point>,
  lineData: FeatureCollection,
  setSliderMaxValue: React.Dispatch<React.SetStateAction<number>>,
  setSliderValue: React.Dispatch<React.SetStateAction<number>>
  propertyName: string,
}


export const calculateDistancesToNearestLine = ({
  pointData, lineData, setSliderMaxValue, setSliderValue,propertyName
}: CalculateDistancesToNearestLineProps): pointDistanceAndProperties[]=> {
  const nearestLineDistanceArray = []
  if (!pointData || !lineData) {
    return;
  }
  const pointFeaturesWithDistances = pointData.features.map(point => {
    const pointCoordinates = point.geometry.coordinates;
    const pointCorrect = {
      type: 'Point',
      coordinates: pointCoordinates,
    };
    const nearestLineDistance = findNearestLineDistance(pointCorrect, lineData);
    nearestLineDistanceArray.push(nearestLineDistance)
    return {
      ...point,
      properties: {
        ...point.properties,
        [propertyName]: nearestLineDistance.minDistance,
      },
    };
  });

  const distanceValues = pointFeaturesWithDistances.map(point => point.properties[propertyName]);
  setSliderMaxValue(Math.ceil(Math.max(...distanceValues)));
  setSliderValue(Math.ceil(Math.max(...distanceValues)));
  return nearestLineDistanceArray
};

const findNearestPointDistance = (point, points) => {
  let minDistance = Number.MAX_VALUE;
  let nearestPointProperties = null;

  points.features.forEach(otherPoint => {
    const distance = turf.distance(point, otherPoint);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestPointProperties = otherPoint;
    }
  });
  return {
    minDistance: minDistance,
    properties: nearestPointProperties
  };
};






interface CalculateDistancesToNearestPointProps {
  pointData: FeatureCollection<Point>;
  referenceData: FeatureCollection<Point>;
  setSliderMaxValue: React.Dispatch<React.SetStateAction<number>>;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  propertyName: string;
}

type pointDistanceAndProperties = {
  minDistance: number;
  properties: {
    name: string;
    natlscale: number;
    scalerank: number;
    website: string | null;
  };
}

export const calculateDistancesToNearestPoint = ({
  pointData,
  referenceData,
  setSliderMaxValue,
  setSliderValue,
  propertyName,
}: CalculateDistancesToNearestPointProps): pointDistanceAndProperties[] => {
  const nearestPointDistanceArray: pointDistanceAndProperties[] = [];

  if (!pointData || !referenceData) {
    return [];
  }

  const pointFeaturesWithDistances = pointData.features.map(point => {
    const pointCoordinates = point.geometry.coordinates;
    const pointCorrect = {
      type: "Point",
      coordinates: pointCoordinates,
    };
    const nearestPointDistance = findNearestPointDistance(pointCorrect, referenceData);
    nearestPointDistanceArray.push(nearestPointDistance);

    return {
      ...point,
      properties: {
        ...point.properties,
        [propertyName]: nearestPointDistance.minDistance,
      },
    };
  });

  const distanceValues = pointFeaturesWithDistances.map(point => point.properties[propertyName]);
  setSliderMaxValue(Math.ceil(Math.max(...distanceValues)));
  setSliderValue(Math.ceil(Math.max(...distanceValues)));
  return nearestPointDistanceArray;
};

const findNearestPointPolygonDistance = (point, polygons: FeatureCollection): number => {
  let minDistance = Number.MAX_VALUE;
  polygons.features.forEach(polygon => {
    if(polygon.geometry.type === "Polygon"){
      const lineGeometry = polygonToLine(polygon.geometry);
      if(lineGeometry.geometry.type === "LineString"){
        const distance = turf.pointToLineDistance(point, lineGeometry.geometry);
        minDistance = Math.min(minDistance, distance);
      }
    }
  });

  return minDistance;
};

interface CalculateDistancesToNearestPointPolygonProps {
  pointData: FeatureCollection<Point>;
  polygonData: FeatureCollection;
  setSliderMaxValue: React.Dispatch<React.SetStateAction<number>>;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  propertyName: string;
}

export const calculateDistancesToNearestPointPolygon = ({
  pointData,
  polygonData,
  setSliderMaxValue,
  setSliderValue,
  propertyName,
}: CalculateDistancesToNearestPointPolygonProps): number[] => {
  const nearestPointPolygonDistanceArray: number[] = [];

  if (!pointData || !polygonData) {
    return [];
  }

  const pointFeaturesWithDistances = pointData.features.map(point => {
    const pointCoordinates = point.geometry.coordinates;
    const pointCorrect = {
      type: 'Point',
      coordinates: pointCoordinates,
    };
    const nearestPointPolygonDistance = findNearestPointPolygonDistance(pointCorrect, polygonData);
    nearestPointPolygonDistanceArray.push(nearestPointPolygonDistance);

    return {
      ...point,
      properties: {
        ...point.properties,
        [propertyName]: nearestPointPolygonDistance,
      },
    };
  });

  const distanceValues = pointFeaturesWithDistances.map(point => point.properties[propertyName]);
  setSliderMaxValue(Math.ceil(Math.max(...distanceValues)));
  setSliderValue(Math.ceil(Math.max(...distanceValues)));
  return nearestPointPolygonDistanceArray;
};

export function findClosestAttractions(cityPoints, attractionPoints, numClosest) {
  const closestAttractionsArray = [];

  cityPoints.features.forEach(cityPoint => {
    const cityCoordinates = cityPoint.geometry.coordinates;

    // Calculate distances between the city point and all attraction points
    const distances = attractionPoints.features.map(attractionPoint => {
      const attractionCoordinates = attractionPoint.geometry.coordinates;
      const distance = turf.distance(cityCoordinates, attractionCoordinates);
      return { attraction: attractionPoint, distance };
    });

    // Sort attractions by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Select the specified number of closest attractions
    const closestNFeatures = distances.slice(1, numClosest+1).map(item => item.attraction);

    // Create a FeatureCollection for the closest attractions of this city
    const closestAttractions = {
      type: 'FeatureCollection',
      features: closestNFeatures
    };

    // Store the FeatureCollection in the array
    closestAttractionsArray.push(closestAttractions);
  });

  return closestAttractionsArray;
}
