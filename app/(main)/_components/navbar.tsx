"use cleint";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollTop } from "@/hooks/use-scroll-top"

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";
import { Item } from "./item";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";


interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth
}: NavbarProps) => {
    const scrollDirection = useScrollTop();
    const search = useSearch();
    const settings = useSettings();
    const  params = useParams();
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">
    });

    if (document === undefined) {
        return (
            <nav className={`bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between ${isCollapsed ? '' : 'w-full'}`}>
                <Title.Skeleton />
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton />
                </div>
            </nav>
        );
    }

    if (document === null) {
        return null;
    }

    
    return (
        <>
            <div className={cn(" z-[9999] sticky top-0", 
             scrollDirection === 'down' && "border-b shadow-sm")}>
                <nav className={`bg-secondary dark:bg-[#1F1F1F] px-3 py-2 w-full h-[77px] flex items-center justify-between`}>
                    <div className="flex w-full justify-start">
                        {/* Empty div for balancing flex space */}
                    </div>
                    <div className="flex w-full h-full items-center justify-center">
                        <div className="w-[90%] h-10 flex items-center justify-center bg-natural rounded-full hover:bg-natural/80 shadow-[-3px_4px_6px_#d3c7d6]">
                            <Item label="Search for ..." icon={Search} onClick={search.onOpen} />
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-end">
                        <Publish initialData={document} />
                        <img src="/settings-icon.png" alt="Settings" onClick={settings.onOpen} className="h-8 w-8 text-muted-foreground" />
                        <Menu documentId={document._id} />
                    </div>
                </nav>
                <span className="absolute justify-start ml-[4%] top-6 truncate">
                    <Title initialData={document} />
                </span>
                {document.isArchived && (
                    <Banner documentId={document._id}/>
                )}
            </div>
        </>
    );
}