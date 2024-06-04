"use client"

import {
     ChevronDown,
     ChevronRight,
     LucideIcon, 
     MoreHorizontal, 
     Plus,
     Trash
    } from "lucide-react";
    import { useMutation } from "convex/react";
    import { useRouter } from "next/navigation";
    import { toast } from "sonner";
    import { useUser } from "@clerk/clerk-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
     DropdownMenu,
     DropdownMenuTrigger,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator
    } from "@/components/ui/dropdown-menu";
import React from "react";

interface ItemProps {
    id?: Id<"documents">;      // the id is optional bc some items we will reuse like the button for a new page, but we also some itmes need the id like the actual documents as they will gonna be inside of a map function so we also know where to redirecte
    documentIcon?: string;     // this has type of string bc it will be just an emoji 
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: ()=> void;
    label: string;
    onClick?: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,  // mapping the icon to Icon to use as jsx element with the lable 
    active,
    documentIcon,
    isSearch,
    level = 0,  // so if we dont pass the level of the item it will be 0  by default.
    onExpand,
    expanded,
}: ItemProps )  => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);

    const onArchive = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
      if (!id) return;     // if there is no id break the all function before it starts
      const promise = archive({ id })   // call the mutation and send the id
        .then(() => router.push("/documents"));  // rdedrited to the documents page after the promise is resolved

      toast.promise(promise, {
        loading: "Moving to trash...",
        success: "Note moved to tarsh!",
        error: "Fialed to Archive  Note!"
      });
    };

    const handelExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    )  => {
        event.stopPropagation();   // here we stop  propagation because when we click on expand button we do not want that the parent gets clicked and redirect
        onExpand?.();
    };

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    )  =>{
        event.stopPropagation();
        if (!id) return;
        const promise = create ({ title: "Untitled", parentDocument : id })   // cereating a child within the parent documnt that had this perant id
         .then((documentId) => {
            if(!expanded) {
                onExpand?.();
            }
            router.push(`/documents/${documentId}`);
         });

         toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New Note created!",
            error: "Failed to clreate a new note"
         });
    };

    const ChivronIcon = expanded ? ChevronDown : ChevronRight; // we render the chivron icon to indicate if the user expanded the page and its children or not
    
    return (
        <div
         onClick={onClick}
         role="button"         // we are reusing this prop to show all pagees and all chiled pages so to render every page under the othe we use the padding 12px to move the page under the pernet to the roght a litile
         style={{
            paddingLeft: level ? `${(level * 12) + 12}px` : "12px" // if doesnt have a leverl render 12px but if it has it multiply 12, add 12 px dependes how mony childs the page has and how deep is nested thats how much it will be pushed to the left
        }}
         className={cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
            active && "bg-primary/5 text-primary"
         )}
        >  {/*the !! turns the id to type boolen so its there or undifiend */}
            {!!id && (
                <div
                 role="button"
                 className="h-full rounded-sm hover:bg-neutral-300
                 dark:hover:bg-neutral-600 mr-1"
                 onClick={handelExpand}           // here  we add the handel expand function to show  the sub items when clicked. or {No pages inside}
                >
                  <ChivronIcon      
                  className="h-4 w-4 shrink-0 text-muted-foreground/50"
                  />  {/* the condintinal ico the showes wether we are xpandedn or not*/}
                </div>
            )}   
            {documentIcon ? (
                <div className="shrink-0 mr-2 text-[18x]">
                    {documentIcon}
                </div>
            ): (
                <Icon 
                className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
                />     
            )}
            <span className="truncate">
                {label} 
            </span>
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5
                 selected-none items-center gap-1 rounded border bg-muted px-1.5
                 font-mono text-[10px] font-medium text-muted-foreground
                 opacity-100">
                 <span className="text-xs">CTRL</span>K
                </kbd>
            ) } {/* check if this type of item is used for searching item*/}
            {!!id && (  
                 <div className="ml-auto flex items-center gap-x-2" >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                         onClick={(e) => e.stopPropagation()}      // we stop propogation so when u click on the triggers we dont get redirected to the document itself 
                         asChild
                        >
                           <div
                             role="button"
                             className="opacity-0 group-hover:opacity-100 h-full ml-auto 
                             rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                           >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                           </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                      className="w-60"
                      align="start"
                      side="right"
                      forceMount
                      >
                        <DropdownMenuItem onClick={onArchive}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                          <div className="text-xs text-muted-foreground p-2">
                            Last edited by: {user?.fullName}
                          </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                     role ="button"
                     onClick={onCreate}
                      className="opacity-0 group-hover:opacity-100 h-full ml-auto
                      rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}      
        </div>
    )
}

Item.Skeleton = function ItemSkeleton({ level}: { level? : number }) {
    return(
        <div
          style={{
            paddingLeft: level? `${(level * 12) + 25}px` : "12px"
          }}
          className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4"/>
            <Skeleton className="h-4 w-[30%]"/>
        </div>
    )
}