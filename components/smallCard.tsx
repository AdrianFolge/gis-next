import Image from "next/image"
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
function Smallcard({ result, day }) {
    const temperature = result.hourly.temperature_2m[day];
    const rain = result.hourly.rain[day];
    const cloudcover = result.hourly.cloudcover[day];
    let iconColor;
    let iconComponent;
  
    if (temperature < 15) {
      iconColor = 'blue';
    } else if (temperature >= 15 && temperature <= 25) {
      iconColor = 'orange';
    } else {
      iconColor = 'red';
    }
  
    if (rain > 2) {
      iconComponent = <ThunderstormIcon style={{ width: '100%', height: '100%', color: iconColor }} />;
    } else if (cloudcover > 20) {
      iconComponent = <CloudIcon style={{ width: '100%', height: '100%', color: iconColor }} />;
    } else {
        iconComponent = <WbSunnyIcon style={{ width: '100%', height: '100%', color: iconColor }} />;
    }
    
  
    return (
      <div className="flex flex-col items-center justify-center m-2 mt-5 space-y-1 rounded-xl cursor-pointer hover:bg-grey-100 hover:scale-105 transition transform duration-200 ease-out">
        <h3 className="text-gray-500">{result.hourly.time[day].substring(5, 10)}</h3>
        <div className="relative h-16 w-16">
          {iconComponent}
        </div>
        <div>
          <h2>{temperature} C</h2>
        </div>
      </div>
    );
  }
  
export default Smallcard;
  
  
  
  
  