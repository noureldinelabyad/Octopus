"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

export const Footer  = () => {
    const scrollDirection = useScrollTop();

    return (
        <div className={cn(
            "flex items-center fixed bottom-0 w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]", 
            scrollDirection === 'down' && "border-b shadow-sm"
        )}>
            <Logo/>
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Button variant="ghost" size="sm">
                    Privacy Policy
                </Button>

                <Button variant="ghost" size="sm">
                    Terms & Conditions
                </Button>
            </div>
        </div>
    )
}
