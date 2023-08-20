import React, { useState } from 'react';


const CollapsibleNavbar: React.FC = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className="relative z-10 bg-gray-800">
      <button
      className="absolute top-2 left-2 z-10 bg-blue-500 text-white px-3 py-2 rounded"
      onClick={toggleNavbar}
    >
      Toggle Navbar
    </button>
      <div
        className={`absolute z-10 top-0 left-0 transform ${isNavbarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 h-full w-1/4 bg-gray-800 text-white`}
      >
      </div>
    </div>
  );
};

export default CollapsibleNavbar;