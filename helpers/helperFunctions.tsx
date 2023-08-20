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
  
    // Calculate zoom level based on distance between points
    const distanceLng = maxLng - minLng;
    const distanceLat = maxLat - minLat;
    const zoom = Math.min(
      Math.floor(Math.log2(360 / distanceLng)),
      Math.floor(Math.log2(180 / distanceLat))
    );
  
    return { latitude: centerLat, longitude: centerLng, zoom };
  };