import Image from "next/image";
import { useEffect, useState } from "react";
import { createApi } from 'unsplash-js';
const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
});


function MediumCard({title, img}) {
    const altImg = "/images/africa.jpeg" 
    return (    
        <div className="cursor-pointer hover:scale-105 transform transition duration-300 ease-out grid grid-cols-2 items-center gap-2">
            <div className="">
                <h3 className="text-2xl mt-3">{title}</h3>
            </div>
            <div className="relative h-20 w-20 justify-center items-center">
                {img[0] && (
                    <Image alt={altImg} src={img[0].urls.regular} layout="fill" className="rounded-xl" unoptimized={true}/>
                )}
            </div>
        </div>
    )
}

export default MediumCard