import Image from "next/image";
import DriveEtaIcon from '@mui/icons-material/DriveEta';

function MediumCard({title, img, drivingInfo, index, onClick}) {
    const drivingInfoProps = drivingInfo ? drivingInfo[index]: null;
    const altImg = "/images/africa.jpeg" 
    const color = drivingInfoProps ? drivingInfoProps.properties.color : "white";
    const realDistance = drivingInfoProps ? drivingInfoProps.properties.distance / 1000 : 0;
    const realDuration = drivingInfoProps ? drivingInfoProps.properties.duration / 60 : 0;
    return (    
        <div className="cursor-pointer hover:scale-105 transform transition duration-300 ease-out grid grid-cols-2 items-center gap-2 rounded-xl pl-2" style={{ backgroundColor: color }} onClick={onClick}>
            <div className="">
                <h3 className="text-2xl mt-3">{title}</h3>
                <div className="flex gap-3">
                    <h3 className="text-md">{realDistance < 10
                                        ? Math.ceil(realDistance* 10) / 10
                                        : Math.ceil(realDistance)} km
                    </h3>
                    <h3 className="text-md">
                        {Math.ceil(realDuration)} min
                    </h3>
                    <DriveEtaIcon />
                </div>
            </div>
            <div className="absolute right-0 h-20 w-20">
                {img[0] && (
                    <Image alt={altImg} src={img[0].urls.regular} layout="fill" className="rounded-xl right-0" unoptimized={true}/>
                )}
            </div>
        </div>
    )
}

export default MediumCard