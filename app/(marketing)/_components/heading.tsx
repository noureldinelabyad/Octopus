"use client";

import {Button} from "@/components/ui/button"
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4" >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                Your 8 Arms Planer, Welcom to <span
                 className="underline" style={{ color: '#BB007F' }} >Octopus</span>
            </h1>
            <h3  className="text-base sm:text-l md:text-xl font-medium">
                Octopus is the pergect workspace <br/>
                where you connet all your worlds!
            </h3>
            <Button>
                Creat your New world
                <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
        </div>
    )
}