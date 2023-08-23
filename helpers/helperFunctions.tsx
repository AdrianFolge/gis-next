import * as turf from '@turf/turf';
import { FeatureCollection, Point } from 'geojson';
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
  lines.features.forEach(line => {
    if (line.geometry.type !== "MultiLineString") {
      const distance = turf.pointToLineDistance(point, line);
      minDistance = Math.min(minDistance, distance);
    }
  });

  return minDistance;
};

interface CalculateDistancesToNearestLineProps {
  pointData: FeatureCollection<Point>,
  lineData: FeatureCollection,
  setPointData: React.Dispatch<React.SetStateAction<FeatureCollection<Point>>>,
  setPointDataWithDistance: React.Dispatch<React.SetStateAction<FeatureCollection<Point>>>,
  setPointDataWithDistanceManipulated: React.Dispatch<React.SetStateAction<FeatureCollection<Point>>>,
  setSliderMinValue: React.Dispatch<React.SetStateAction<number>>,
  setSliderMaxValue: React.Dispatch<React.SetStateAction<number>>,
  propertyName: string,
}


export const calculateDistancesToNearestLine = ({
  pointData, lineData, setPointData,setPointDataWithDistance, setPointDataWithDistanceManipulated, setSliderMinValue, setSliderMaxValue, propertyName
}: CalculateDistancesToNearestLineProps) => {
  if (!pointData || !lineData) {
    return("Feil med pointData/lineData")
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
        [propertyName]: nearestLineDistance,
      },
    };
  });

  const updatedPointData: FeatureCollection<Point> = {
    ...pointData,
    features: pointFeaturesWithDistances,
  };
  console.log(propertyName, ":",updatedPointData)
  setPointData(updatedPointData)
  setPointDataWithDistance(updatedPointData);
  setPointDataWithDistanceManipulated(updatedPointData);

  const distanceValues = pointFeaturesWithDistances.map(point => point.properties[propertyName]);
  setSliderMaxValue(Math.max(...distanceValues));
  setSliderMinValue(Math.min(...distanceValues));
};