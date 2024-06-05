"use client"

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Item } from "@/app/(main)/_components/item";
import { MenuIcon, Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";


import { DocumentsGrid } from "@/components/document-list";

const DocumentsPage = () => {
    const {user} = useUser();
    const create = useMutation(api.documents.create);   // calling the create function from documents.ts
    const router = useRouter();

    const search = useSearch();
    const settings = useSettings();


    const onCreate = () => {   // handelr to fire a toast on creting new doc and maybe rediricte 
        const promise = create ({ title: "Untitled" })     // as tittle is requored in the db  we set it to untitled as defualte 
        .then((documentId) => {
            router.push(`/documents/${documentId}`);
        });

        toast.promise(promise, {        // showing msgs  with toasts onCreate new doc
            loading: "Creatign a new note...",
            success: "New note Created!",
            error: "Failed to create a new note."
        });
    };
    
    return (
        <div className="h-full flex flex-col items-center space-y-4 dark:bg-[#1F1F1F]" >
            <div className=" z-[9999] sticky top-[0] w-full">
                <nav className={`bg-secondary dark:bg-[#1F1F1F] px-3 py-2 w-full h-[77px] flex items-center justify-between`}>
                    <div className="flex w-full justify-start">
                        {/* Empty div for balancing flex space */}
                    </div>
                    <div className="w-[190%] h-10 flex items-center justify-center bg-natural rounded-full hover:bg-natural/80 shadow-[-3px_4px_6px_#d3c7d6]">
                        <Item label="Search for ..." icon={Search} onClick={search.onOpen} />
                    </div>
                    <div className="flex w-full justify-start">
                        {/* Empty div for balancing flex space */}
                    </div>
                    <div className="flex w-full items-center justify-end mr-2">
                        <img src="/settings-icon.png" alt="Settings" onClick={settings.onOpen} className="h-8 w-8 text-muted-foreground" />
                    </div>
                </nav>
            </div>
            <div className=" w-full justify-center items-center flex opacity-100 z-[99] ">
                <DocumentsGrid/>
            </div>
            <div className=" fixed justify-center items-center top-[200px] opacity-10 z-[0] ">
                <Image
                src="/octoput-light.png"
                height="220"
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
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-lg font-medium">
                    Welcome to {user?.firstName}&apos;s Octopus
                </h2>
                <Button onClick={onCreate}>
                    <PlusCircle className="h-4 w-4 mr-2"/>
                    Create a note
                </Button>
            </div>
        </div>
    );
}
export default DocumentsPage;