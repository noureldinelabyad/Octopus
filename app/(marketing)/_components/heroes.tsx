import Image from "next/image";
import React from 'react';


export const Heroes  = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative h-[400px] w-[400px] hidden md:block">
                    {/* <img 
                    src="/notes.png" 
                    className="object-contain dark:hidden" // dark mode pic
                    dark:block // dispy darkmode pic 
                    alt="notes" 
                    /> */}
                    <img 
                    src="/notes.png" 
                    className="object-contain"
                    alt="notes" 
                    />
                </div>
                <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px]
                md:h-[400px] md:w[400px]">
                    <img
                        src="/background.png"
                        className="objec-contain rounded-3xl bg-transparent	 opacity-90"
                        alt="task"
                    />
                </div>
            </div>
        </div>
    )
}