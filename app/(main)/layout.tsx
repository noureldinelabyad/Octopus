"use client";

import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

import { Spinner } from "@/components/spinner";

import { Navigation } from "./_components/navigation";

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
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation/>
            <main className="flex-1 h-full overglow-y-auto">
            {children}
            </main>
        </div>
     );
}
 
export default MainLayout;