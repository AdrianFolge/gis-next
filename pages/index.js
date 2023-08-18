import { useState, useMemo } from "react"
import MapboxComponent from '../components/mapbox'
import CollapsibleNavbar from '../components/collapsibleNavbar'

export default function Home() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  const memoizedMapboxComponent = useMemo(
    () => <MapboxComponent initialCoordinates={[10, 63]} zoom={14} />,
    [] // Empty dependency array ensures the component is memoized once
  );

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <button
        className="fixed top-2 left-2 z-10 bg-blue-500 text-white px-3 py-2 rounded"
        onClick={toggleNavbar}
      >
        Toggle Navbar
      </button>

      <div
        className={`absolute top-0 left-0 transition-transform duration-300 h-full w-1/4 ${
          isNavbarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CollapsibleNavbar isNavbarOpen={isNavbarOpen} />
      </div>

      <div
        className={`absolute top-0 left-0 transition-transform duration-300 h-full w-full ${
          isNavbarOpen ? 'translate-x-1/4' : 'translate-x-0'
        }`}
      >
        {memoizedMapboxComponent}
      </div>
    </div>
  );
}
