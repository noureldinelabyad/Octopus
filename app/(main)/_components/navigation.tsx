"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon } from "lucide-react";
import { tree } from "next/dist/build/templates/app-page";
import { usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts"; // easer to use this package to resize side sidebar ondrag than tailwind

export const Navigation = () => {
  const Pathname = usePathname(); // this for when user cklick on an itime it collapes the sidebar
  const isMobile = useMediaQuery("(max-width: 768px)");

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile); // on mobile sidebar is automatucaly collapsed!

  useEffect(() => {
    if (isMobile){
        collpse();
    } else {
        resetWidth();
    }
  }, [isMobile]);

  useEffect(() =>{
    if (isMobile) {
        collpse();
    }
  }, [Pathname, isMobile]);

    const handelMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);  // when user moves the mouse to resize the sidebar
        document.addEventListener("mouseup", handleMouseUp);     // when user leaves the mouse means he stopes resizing
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return;   // if no resizing just break it here
        let newWidth = event.clientX;
        // put the width limites
        if (newWidth < 240) newWidth = 240; 
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;  // here we setting the style of the sidebar element
            navbarRef.current.style.setProperty ("left", `${newWidth}px`); // here we move the navbar width prppertty with the same amount
            navbarRef.current.style.setProperty ("width", `calc(100% - ${newWidth}px`); // here we  set the width of the main content
        }
    };
     
    const handleMouseUp = ()  => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const resetWidth = () => {  // rest width without draging
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed (false);
            setIsResetting (true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.setProperty(
                  "width", isMobile ? "0" : "calc(100 - 240px)"  
            );
            navbarRef.current.style.setProperty(
                "left",  isMobile ? "100%" : "240px"
            );
            setTimeout(()=>{setIsResetting(false)},300);  // 300 is iur duration and to show this nice animation we use thisa timeout trick 
        }
    };


    const collpse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width= "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");
            setTimeout (() => setIsResetting(false), 300); 
        }
    }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
            "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "trasition-all ease-in-out duration-300",
                isMobile && "w-0 "
        )}
      >
        <div
        onClick={collpse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opac100"
            )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <p>Action items</p>
        </div>
        <div className="mt-4">
          <p>Documents</p>
        </div>
        <div 
            onMouseDown = { handelMouseDown }
            onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 
          transtion cursor-ew-resize absolute h-full w-1 bg-primary/10 
          right-0 top-0" // this div is hidden till when we houver on the aside element (group) it will be showmn from (group/sidebar), courser ti resize the size bar (the bold line in the side of navbar)
        />
      </aside>
      <div
      ref={navbarRef}
      className={cn( // to make  sure that the navbar will be always at the top 
        "absolute top-0 z[99999] left-60 w-[calc(100%-240px)]", // 240px is the value of left-60
        isResetting && "transition-all ease-in-out duration-300",
        isMobile && "left-0 w-full"
      )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && <MenuIcon onClick={resetWidth} role="button"
             className="h-6 w-6 text-muted-foreground"/>}
        </nav>

      </div>
    </>
  );
};
