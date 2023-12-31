import Image from "next/image"
function InfoCard({object, onClick}) {
    const properties = object.properties
    const getImageSource = (region) => {
        switch (region) {
            case 'Asia':
                return '/images/asia.avif';
            case 'Europe':
                return '/images/europe.jpeg';
            case 'South America':
                return '/images/south_america.jpeg';
            case 'Africa':
                return '/images/africa.jpeg';
            case 'North America':
                return '/images/north_america.jpeg';
            case 'Oceania':
                return '/images/oceania.jpeg';
          // Add more cases for other regions
          default:
            return '/images/else.jpeg'; // Fallback image
        }
      };
    return (
        <div onClick={() => onClick()}>
            <div className="flex py-7 px-2 border-b cursor-pointer hover:opacity-60 hover:shadow-lg transition duration-200 ease-out first:border-t m-4">
                <div className="relative w-40 md:h-4 md:w-70 flex-shrink-0 bg-slate-800">
                    <div className="relative h-24 w-40 md:h-52 md:w-70 flex-shrink-0 ">
                        <Image alt="" src={getImageSource(properties.region)} layout="fill" objectFit="cover" className="rounded-2xl" />
                    </div>
                </div>
                <div className="flex flex-col flex-grow pl-5">
                    <div className="flex justify-between">
                        <p>{properties.name}</p>
                    </div>
                    <h4 className="text-xl">{properties.subregion ? (
                            <p>{properties.adm0name}</p>
                            ) : (
                            <p>{properties.sov0name}</p>
                            )}</h4>
                    <div className="border-b w-10 pt-2"/>
                    <div className="justify-between items-end pt-5">
                        <p className="pt-2 text-sm text-gray-500 flex-grow">Nærmeste Kystlinje: {properties.nearestCoastDistance.minDistance < 10 ? Math.ceil(properties.nearestCoastDistance.minDistance * 10) / 10
                            : Math.ceil(properties.nearestCoastDistance.minDistance)} km</p>
                        <p className="pt-2 text-sm text-gray-500 flex-grow">
                        Nærmeste elv: {properties.nearestRiverDistance.minDistance < 10
                            ? Math.ceil(properties.nearestRiverDistance.minDistance * 10) / 10
                            : Math.ceil(properties.nearestRiverDistance.minDistance)} km
                        </p>           
                        <p className="pt-2 text-sm text-gray-500 flex-grow">
                        Nærmeste innsjø: {properties.nearestLakeDistance < 10
                                ? Math.ceil(properties.nearestLakeDistance * 10) / 10
                                : Math.ceil(properties.nearestLakeDistance)} km
                        </p>
                        <p className="pt-2 text-sm text-gray-500 flex-grow">
                        Nærmeste havn: {properties.nearestPortDistance.minDistance < 10
                                ? Math.ceil(properties.nearestPortDistance.minDistance * 10) / 10
                                : Math.ceil(properties.nearestPortDistance.minDistance)} km
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoCard