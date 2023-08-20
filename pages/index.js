import { useState, useMemo, useRef } from "react"
import mapboxgl from 'mapbox-gl';
import MapComponent from "../components/mapComponent";

const layers = ["https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_populated_places_simple.geojson","https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_geography_regions_points.geojson", "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_populated_places_simple.geojson"]

export default function Home() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState(layers[0]);
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  const toggleLayer = () => {
    const randomIndex = Math.floor(Math.random() * layers.length); // Generate a random index
    const randomLayer = layers[randomIndex]; // Get the layer at the random index
    setActiveLayer(randomLayer); // Set the active layer to the random layer
  };


  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <button
        className="fixed top-2 left-2 z-10 bg-blue-500 text-white px-3 py-2 rounded"
        onClick={toggleNavbar}
      >
        Toggle Navbar
      </button>

      <div
        className={`absolute top-0 left-0 transition-transform duration-300 w-1/4 bg-gray-800 flex justify-center items-center h-screen ${
          isNavbarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
        className=" bg-blue-500 text-white px-3 py-2 rounded"
        onClick={toggleLayer}
      >
        Change layer
      </button>

      </div>

      <div
        className={`absolute top-0 left-0 transition-transform duration-300 h-full w-full ${
          isNavbarOpen ? 'translate-x-1/4' : 'translate-x-0'
        }`}
      >
         <MapComponent layer={activeLayer}/>
      </div>
    </div>
  );
}
