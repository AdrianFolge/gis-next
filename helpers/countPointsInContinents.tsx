import axios from 'axios';
import * as turf from '@turf/turf';

async function loadGeoData(geojsonFilePath, jsonFilePath) {
  try {
    const geojsonData = await axios.get(geojsonFilePath);
    const jsonData = await axios.get(jsonFilePath);

    return { geojson: geojsonData.data, json: jsonData.data };
  } catch (error) {
    throw new Error('Error loading data: ' + error.message);
  }
}

export interface ContinentDataItem {
    name: string;
    coordinates: (turf.Position | turf.Position[])[]; 
  };

export async function getPointsInContinents(layer, url) {
    const geojsonFilePath = layer; 
    const jsonFilePath = url; 
  
    try {
      const { geojson, json } = await loadGeoData(geojsonFilePath, jsonFilePath);
  
      const points = geojson;
      const continents = json.features;
      const continentData:ContinentDataItem[] = [];

      continents.forEach(continent => {
        const continentName = continent.properties.CONTINENT;
        const pointsInContinent = turf.pointsWithinPolygon(points, continent.geometry);
  
        const coordinates = pointsInContinent.features.map(pointFeature =>
          pointFeature.geometry.coordinates
        );
  
        continentData.push({ name: continentName, coordinates });
      });
      return continentData;
    } catch (error) {
      throw new Error('An error occurred: ' + error.message);
    }
  }