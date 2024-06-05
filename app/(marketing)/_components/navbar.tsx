"use client"

import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

import { useScrollTop } from "@/hooks/use-scroll-top"
import { useConvexAuth } from "convex/react";

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar  = () => {
    const { isAuthenticated, isLoading } = useConvexAuth(); // here we  get the user info and check if it's authenticated or not.
    const scrollDirection = useScrollTop();
    return(
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
            scrollDirection === 'down' && "border-b shadow-sm"
            // if we scroled away from the nave we add border btoma nd sahdow small (dynamic class name)
        )}>
            <Logo/>
            <div className="md:ml-auto md:justify-end
                justify-between w-full flex items-center gap-x-2">
                {isLoading && (       //  Loading convex auth status (like if condtion if  user is logged in and if authenticated)
                    <Spinner/>
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                    <SignInButton mode="modal">
                       <Button variant="ghost" size="sm">
                        Log in
                       </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                       <Button size="sm">
                        Get Octopus Free
                       </Button>
                    </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Enter Octopus
                            </Link>
                        </Button>
                        <UserButton
                        afterSignOutUrl="/"
                        />
                    </>
                )}
                <ModeToggle/>
            </div>
        </div>
    )
}