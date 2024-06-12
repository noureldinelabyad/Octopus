"use cleint"
import React from 'react';
import { useState } from "react";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";
import { Item } from "../app/(main)/_components/item";

interface DocumentListProps {
    parentDocumentId?: Id<"documents">;
    level?:  number;  // we have level becouse this  component can be used in nested lists. If it is undefined, then the list will show all documents, recursive function
    data?: Doc<"documents">[]; // DOC IS a type THE DOCMENT SCHEMA AND WILL GONNA BE AN ARRAY OF THOSE
    initialData?: Doc<"documents">;

}

export const DocumentList = ({
    parentDocumentId,
    level = 0,

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
                <div key={document._id}
                    className=" overflow-auto"
                >
                    <Item 
                        id={document._id}
                        label={document.title}
                        onClick={() => onRedirect(document._id)}
                        icon={FileIcon}
                        active={Params.documentId === document._id}
                        documentIcon={document.icon}
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

export const DocumentsGrid = ({
     parentDocumentId,
    }: DocumentListProps) => {
    const documents = useQuery(api.documents.getSidebar, {
        parentDocument: parentDocumentId,
    });

    const router = useRouter();

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };
    
    if (!documents) {
        return <div>Loading...</div>; // Placeholder for loading state
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] overflow-x-hidden w-[50rem]
         items-center justify-center shadow-[-1px_4px_4px_4px_#5D0096] text-3xl p-6 h-[30rem] 
         resize overflow-y-auto rounded-lg">
            {documents.map((document) => (
                <div
                key={document._id}
                role="button" onClick={() => onRedirect(document._id)} 
                className="flex flex-col h-full items-center justify-center 
                hover:shadow-[-1px_4px_4px_4px_#5D0096] m-2 rounded-full"
                >
                    {document.icon ? (
                            <div className="w-full h-full flex items-center justify-center">
                                {document.icon}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <FileIcon />
                            </div>
                            )}
                    <h3 className=" m-2 font-bold text-center text-foreground">{document.title}</h3>
                </div>
            ))}
        </div>
    );
};

export const ChildDocumentGrid = ({
    parentDocumentId,
    level = 0,
    
}: DocumentListProps ) => {
    const router = useRouter();
    const params = useParams();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    //const [childDocuments, setChildDocuments] = useState<Record<string, Doc<"documents">[]>>({});

    // const documents = useQuery(api.documents.getSidebar, {
    //     parentDocument: parentDocumentId,
    // });

    // const chids = useQuery(
    //     api.documents.getChildDocuments,
    //     { documentId: parentDocumentId }
    // );

    const document = useQuery(api.documents.getById, {
        documentId: params.documentId as Id<"documents">
    });

    if (!parentDocumentId){
        return <div>Loading...</div>
    }

    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };
    
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId],
        }));
    };
    
    // useEffect(() => {
    //     const fetchChildDocuments = async (documentId: Id<"documents">) => {
    //         const childDocs = await useQuery(api.documents.getChildDocuments, { documentId });
    //         setChildDocuments(prevChildDocs => ({
    //             ...prevChildDocs,
    //             [documentId]: childDocs ? childDocs : [],
    //         }));
    //     };

    // }, [expanded]);

    // if (!documents) {
    //     return <div>Loading...</div>; // Placeholder for loading state
    // }
       
    //const childDocuments = documents.filter(document => document.parentDocument === document._id);

    //const documentsWithParents = documents?.filter(document => document.parentDocument !== null);

    // console.log("docs",childDocuments);
    // console.log("childs",documentsWithParents);

    return (
        <div
         className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] overflow-x-hidden w-[50rem]
         items-center justify-center shadow-[-1px_4px_4px_4px_#5D0096] text-3xl p-6 h-[30rem] 
         resize overflow-y-auto rounded-lg"
        >
            {/* {document?.parentDocument === document?._id ? ( */}
{/* 
                {chids?.map((document) => (
                    <div
                    key={document._id}
                    role="button" onClick={() => onRedirect(document._id)} 
                    className="flex flex-col h-full items-center justify-center 
                    hover:shadow-[-1px_4px_4px_4px_#5D0096] m-2 rounded-full"
                    >
                    {document.icon ? (
                        <div className="w-full h-full flex items-center justify-center">
                        {document.icon}
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                                <FileIcon />
                            </div>
                            )}
                            <h3 className=" m-2 font-bold text-center text-foreground">{document.title}</h3>
                        </div>
                    
                    ))
                } */}

            {/* ) : (
                <div className="w-full h-full flex items-center justify-center">
                    no docuemns inside
                </div>
            )
            } */}
       </div>
    );

};