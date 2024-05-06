"use cleint"

import { useState } from "react";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";
import { Item } from "./item";

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?:  number;  // we have level becouse this  component can be used in nested lists. If it is undefined, then the list will show all documents, recursive function
    date?: Doc<"documents">[]; // DOC IS a type THE DOCMENT SCHEMA AND WILL GONNA BE AN ARRAY OF THOSE
}

export const DocumentList = ({
    parentDocumentId,
    level = 0
}: DocumentListProps) => {
    const Params = useParams();
    const router = useRouter();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const onExpand = (documnetId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,   // add all the pprevious expanded documents
            [documnetId]: !prevExpanded[documnetId]   // and here we togle the fucntion  of the current document id, the opposite if the currunt state of the expanded function
        }));
    };

    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId
    });

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };

    if ( documents === undefined) {   // in convex if documnets undified means its loading in loading state but if its truly faild means its null 
        return (     // as we added the skeleton in the itmens component we can use here as well for our  loading state
            <>
              <Item.Skeleton level={level} />  
              {level === 0 && (
                <>
                    <Item.Skeleton level={level} />
                    <Item.Skeleton level={level} />
                </>
              )}
            </>
        );
    };

    return (
        <>
            <p
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn(
                    "hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",    // if it expanded ? give it a class other block
                    level === 0 && "hidden"      // if  its at root means no cheldren so level 0 so we hide the <P></P>
                )}
            >
                No Pages inside
            </p>
            {documents.map((document)=>(
                <div key={document._id}>
                    <Item 
                        id={document._id}
                        onClick={() => onRedirect(document._id)}
                        label={document.title}
                        icon={FileIcon}
                        documentIcon={document.icon}
                        active={Params.documentId === document._id}
                        level={level}
                        onExpand={() => onExpand(document._id)}
                        expanded={expanded[document._id]}
                        />
                        {expanded[document._id] && (
                            <DocumentList 
                             parentDocumentId={document._id}
                             level={level + 1}
                            />
                        )}            {/* we are calling the whole component in a recurcive trick here  */}
                </div>
            ))}
        </>
    );
};