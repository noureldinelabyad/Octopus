"use clint"

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

import {
     ChevronDown,
     ChevronRight,
     LucideIcon 
    } from "lucide-react";

interface ItemProps {
    id?: Id<"documents">;      // the id is optional bc some items we will reuse like the button for a new page, but we also some itmes need the id like the actual documents as they will gonna be inside of a map function so we also know where to redirecte
    documentIcon?: string;     // this has type of string bc it will be just an emoji 
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: ()=> void;
    label: string;
    onClick: () => void;
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
    const ChivronIcon = expanded ? ChevronDown : ChevronRight; // we render the chivron icon to indicate if the user expanded the page and its children or not
    
    return (
        <div
         onClick={onClick}
         role="button"         // we are resuign this prop to show all pagees and all chiled pages so to render every page under the othe we use the padding 12px to move the page under the pernet to the roght a litile
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
                 dark:bg-neutral-600 mr-1"
                 onClick={() => {}}
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
                className="shrink-0 h-[18px] mr-2 text-muted-foreground"
                />     
            )}
            <span className="truncate">
            {label} 
            {isSearch && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5
                 selected-none items-center gap-1 rounded border bg-muted px-1.5
                 font-mono text-[10px] font-medium text-muted-foreground
                 opacity-100">
                    <span className="text-sm">CTRL</span>K
                </kbd>
            ) }     {/* check if this type of item is used for searching item*/}
            </span>
        </div>
    )
}