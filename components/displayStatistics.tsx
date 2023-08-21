import React from 'react'
import { ContinentDataItem } from '../helpers/countPointsInContinents';


interface displayStatisticsProps {
    displayTotalPoints: number;
    displayNumberOfClusters: number;
    displayAverageDistance: number;
    countryPoints: Array<{ country: string; points: number }> ;
    continentData: ContinentDataItem[];

}


const DisplayStatistics: React.FC<displayStatisticsProps> = ({displayTotalPoints, displayAverageDistance, displayNumberOfClusters, countryPoints, continentData}) => {
  return (
    <div className='grid grid-rows-2'>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md grid grid-rows-4 grid-cols-2 m-4">
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">North America</p>
            <p className="text-2xl font-bold text-purple-600">{continentData[0]?.coordinates.length  || 0}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Europe</p>
            <p className="text-2xl font-bold text-green-600">{continentData[1]?.coordinates.length || 0}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">South America</p>
            <p className="text-2xl font-bold text-yellow-500">{continentData[2]?.coordinates.length  || 0}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Africa</p>
            <p className="text-2xl font-bold text-blue-600">{continentData[3]?.coordinates.length  || 0}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Antartica</p>
            <p className="text-2xl font-bold text-lime-400">{continentData[4]?.coordinates.length  || 0}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Asia</p>
            <p className="text-2xl font-bold text-red-500">{continentData[5]?.coordinates.length || 0}</p>
            </div>
            <div className="text-center col-span-2">
            <p className="text-lg font-semibold text-gray-700 mb-1">Oceanic</p>
            <p className="text-2xl font-bold text-stone-400">{continentData[6]?.coordinates.length  || 0}</p>
            </div>
        </div>
    <div className="grid grid-cols-2 gap-4 m-4">
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md grid grid-rows-3">
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Total Points</p>
            <p className="text-2xl font-bold text-blue-600">{displayTotalPoints}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Clusters</p>
            <p className="text-2xl font-bold text-green-600">{displayNumberOfClusters}</p>
            </div>
            <div className="text-center">
            <p className="text-lg font-semibold text-gray-700 mb-1">Average Distance</p>
            <p className="text-2xl font-bold text-purple-600">{displayAverageDistance}</p>
            </div>
        </div>
        <div className="justify-between items-center bg-white bg-opacity-90 p-4 rounded-md shadow-md grid grid-rows-3">
        {countryPoints[0] ? (
            <>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-1">{countryPoints[0]?.country || 0}</p>
                    <p className="text-2xl font-bold text-blue-600">{countryPoints[0]?.points || 0}</p>
                </div>
                <div className="text-center">
                    <p className="text-md font-semibold text-gray-700 mb-1">{countryPoints[1]?.country || 0}</p>
                    <p className="text-xl font-bold text-green-600">{countryPoints[1]?.points || 0}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-1">{countryPoints[2]?.country || 0}</p>
                    <p className="text-l font-bold text-purple-600">{countryPoints[2]?.points || 0}</p>
                </div>
            </>
        ) : (
            <p className="text-center text-red-600">File does not contain country data</p>
        )}
        </div>
        </div>
        </div>
    )
}

export default DisplayStatistics