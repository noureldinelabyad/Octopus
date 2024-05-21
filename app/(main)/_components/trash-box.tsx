"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useDeleteCoverImage } from "@/hooks/remove-cover-image";

//interface TrashBoxProps{
    //documentId: Id<"documents">;
//};

export const TrashBox = (
   // documentId,
) => {
    const documentId = useParams().documentId as Id<"documents">;
    // const document = documentId ? useQuery(api.documents.getById, {
    //     documentId
    // }) : null;
 
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);
    
    const [search, setSearch] = useState("");

    //const urlToDelete = document?.coverImage;
    //const deleteCoverImage = useDeleteCoverImage(urlToDelete ); // Use the utility function
    
    const filteredDocuments = documents?.filter((document) => {              // to filter out the documents using the search state 
        return document.title.toLowerCase().includes(search.toLowerCase());
    });
    
    const onRestore = (
        event : React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId : Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({  id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    };


    const onRemove = async (
        documentId : Id<"documents">
    ) => {
        //console.log("url is",urlToDelete);
  
        // await deleteCoverImage();
        
        // if (urlToDelete) {
        // }

        const promise = remove({  id: documentId });

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });

        if (params.documentId == documentId) {
        }
    };

    if (documents === undefined) {      // undifined means its still loading 
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4 " />
                <Input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                 placeholder="Filter by page title..."
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                 <p className="hidden last:block text-xs text-center   
                text-muted-foreground pb-2"
                >  {/* here show it only whe it the last item so means the page it empty css trick  */}
                    No documemts found.
                </p>
                {filteredDocuments?.map((document) => (
                    <div
                     key={document._id}
                     role="button"
                     onClick={() => onClick(document._id)}  // the onClick is defined and when click will be redirect to it
                     className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
                    >
                        <span className="truncate pl-2">
                            {document.title}
                        </span>
                        <div className="flex items-center">
                            <div
                             onClick={(e) => onRestore(e, document._id)}
                             role="button"
                             className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600" 
                            >
                                <Undo className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {/* <ConfirmModal onConfirm={() => onRemove(document._id)}>
                                <div
                                role="button"
                                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                                >
                                 <Trash className="h-4 w-4 text-muted-foreground"/>
                                </div>
                            </ConfirmModal> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};