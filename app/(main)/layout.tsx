"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";
import { SearchCommand } from "@/components/search-command";

import { Navigation } from "./_components/navigation";

import Image from "next/image";


const MainLayout = ({
    children 
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
        <div className="h-full flex items-center justify-center">
            <Spinner size="lg"/>
        </div>
        );
    }

    if (!isAuthenticated) {   // as we create this logic in the layout  and not on each page, it's safe to assume that all pages in (main) are protected by convex auth
        return redirect("/");
    }


    return ( 
        <div className="flex h-full dark:bg-[#1F1F1F]">
            <div className="flex max-h-full top-0">
             <Navigation />
            </div>
            <main className="flex-1 h-full overglow-y-auto">
            <SearchCommand />
            <div className="  fixed opacity-30 ">
                <Image
                src="/octoput-light.png"
                height="300"
                width="300"
                alt="note"
                className="dark:hidden"
                />
                <Image
                src="/octoput-dark.png"
                height="300"
                width="300"
                alt="note"
                className="hidden dark:block"
                />
            </div>
            {children}
            
            </main>
        </div>
     );
}
 
export default MainLayout;