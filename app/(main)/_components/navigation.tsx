"use client";

import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts"; // easer to use this package to resize side sidebar ondrag than tailwind
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { UserItem } from "./user-item";
import { Item } from "./item";
import { DocumentList } from "../../../components/document-list";
import { TrashBox } from "./trash-box";
import { Navbar } from "./navbar";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./title";



export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const Pathname = usePathname(); // this for when user cklick on an itme it collapes the sidebar
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create); // create function  to add new item in db ( + new page )

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile); // on mobile sidebar is automatucaly collapsed!

  const documentId = params.documentId as Id<"documents">;
  

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [Pathname, isMobile]);

  const handelMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove); // when user moves the mouse to resize the sidebar
    document.addEventListener("mouseup", handleMouseUp); // when user leaves the mouse means he stopes resizing
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return; // if no resizing just break it here
    let newWidth = event.clientX;
    // put the width limites
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`; // here we setting the style of the sidebar element
      navbarRef.current.style.setProperty("left", `${newWidth}px`); // here we move the navbar width prppertty with the same amount
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px`); // here we  set the width of the main content
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    // reset width without dragging
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100 - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => {
        setIsResetting(false);
      }, 300); // 300 is our duration and to show this nice animation we use this timeout trick
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handelCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) => {
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: "Creating A NEW  Note...",
      success: "Note Created Successfully!",
      error: "Error Creating The Note!",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto overflow-x-hidden flex w-60 flex-col z-[99999] border-r-3 border-black-500",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0 "
        )}
      >
        <div >

          <div
            onClick={collapse}
            role="button"
            className={cn(
              "flex items-center justify-between p-3 bg-primary mt-1 w-full bg-neutral",
              isMobile && "opacity-100"
            )}
          >
            <div className="flex align-middle mx-2">
              <img src="/logo-light.png" alt="Logo" className="h-11 w-12" />
              <span className="text-2xl mt-2 font-bold [font-family:'Orelega_One-Regular',Helvetica] text-[#5d0096]">
                Octopus
              </span>
            </div>

            <div className="relative w-8 h-8 mr-2 bg-natural rounded-full shadow-md">
              <ChevronsLeft className="absolute w-5 h-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
            </div>

          </div>

          <DropdownMenuSeparator className="bg-primary/10 " />

          <div className="my-3">
            <UserItem />
          </div>

          <div className="mx-2">
            <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
            <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
            <Item onClick={handelCreate} label="New page" icon={PlusCircle} />
          </div>

        </div>

        <div className="mt-4 mx-2 block overflow-y-auto">

          <p className="text-md font-medium text-muted-foreground/80 pb-1">
            Pages
          </p>
          <DocumentList />
       </div>

        <Item onClick={handelCreate} icon={Plus} label="Add a Page" />

        <Popover>
          <PopoverTrigger className="w-full mt-4 ">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-72"
            side={isMobile ? "bottom" : "right"}
          >
            <TrashBox />
          </PopoverContent>
        </Popover>

        <div
          onMouseDown={handelMouseDown}
          onClick={resetWidth}
          className="opacity-70 group/sidebar:opacity-100
          transition cursor-ew-resize absolute h-full w-0.5 bg-primary/10 
          right-0 top-0" // this div is hidden till when we houver on the aside element (group) it will be showmn from (group/sidebar), courser ti resize the size bar (the bold line in the side of navbar)
        />

        <div
          ref={navbarRef}
          className="absolute top-0 z[99999] w-[calc(100%-240px)] left-60transition-all ease-in-out duration-300 bg-[5D0096] shadow-[-3px_4px_6px_#d3c7d6]"
        >
          {!!isCollapsed && (
            <MenuIcon
            onClick={resetWidth}
              role="button"
              className="h-6 w-6 m-3 absolute text-muted-foreground"
            />
          )}
        </div>

      </aside>
    </>
  );
};

export default Navigation;
