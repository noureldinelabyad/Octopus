"use client";

import {Button} from "@/components/ui/button"
import { ArrowRight } from "lucide-react";

import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { SignInButton } from "@clerk/clerk-react";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="max-w-3xl space-y-4" >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                Your 8 Arms Brain, Welcom to <span
                 className="underline" style={{ color: '#BB007F' }} >Octopus</span>
            </h1>
            <h3  className="text-base sm:text-l md:text-xl font-medium">
                Octopus is the perfect workspace <br/>
                where you conncet all your worlds!
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                <Spinner size="lg"/>
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/documents">
                     Creat your New world
                        <ArrowRight className="h-4 w-4 ml-2"/>
                    </Link>
                 </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                    <Button>
                        Get Octopus Free
                        <ArrowRight className="h-4 w-4 ml-2"/>
                    </Button>
                </SignInButton>
            )}
        </div>
    )
}