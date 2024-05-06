"use cleint";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Title } from "./title";

interface NavbarProps {
    isCollapsed: boolean;
    onResetWidth: () => void;
};

export const Navbar = ({
    isCollapsed,
    onResetWidth
}: NavbarProps) => {
    const  params = useParams();
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">     // here as  Id because we know the type of `params. id: new Id(params.id as strring) and its expced as Id<"documents"> so we use (as)
    });


    if (document === undefined) {
        return (
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center">
                <Title.Skeleton />
            </nav>
        )
    }

    if (document === null) {
        return null;
    }

    return (
        <>
            <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
                {isCollapsed && (
                    <MenuIcon 
                     role="button"
                     onClick={onResetWidth}
                     className="h-6 w-6 text-muted-foreground"
                    />
                )}
                <div className="flex items-center justify-between w-full">
                    <Title initialData={document} />
                </div>
            </nav>
        </>
    )
}