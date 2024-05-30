"use client"

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

import { useDeleteCoverImage } from "@/hooks/remove-cover-image";
import { useEdgeStore } from "@/lib/edgestore";


interface BannerPops {
    documentId: Id<"documents">;
   // url: string;
};

export const Banner = ({
    documentId,
   // url
}: BannerPops) => {
     const document = useQuery(api.documents.getById, {
        documentId
    });
    
    const router = useRouter();
    const remove = useMutation(api.documents.remove);
    const restore = useMutation(api.documents.restore);
    
    const urlToDelete = document?.coverImage;  
    const deleteCoverImage = useDeleteCoverImage(); // Use the utility function

    const onRemove = async () => {

        if(urlToDelete ){
           await deleteCoverImage?.(urlToDelete);
        } else {
            console.log("No cover image to delete");
        }

        console.log("url is",urlToDelete);

        const promise = remove({ id: documentId });  // Remove the document from the database

        toast.promise(promise, {
            loading: "Deleting note...",
            success: "Note deleted!",
            error: "Failed to delete note."
        });
        router.push("/documents");   // redirect to documents page
    };

    const onRestore = () => {
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Restoring note...",
            success: "Note restored!",
            error: "Failed to restore note."
        });
    };

    return (
        <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
            <p>
                this page is in the Trash.
            </p>
            <Button
             size="sm"
             onClick={onRestore}
             variant="outline"
             className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                size="sm"
                variant="outline"
                className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
                >
                    Delete forever
                </Button>
            </ConfirmModal>
        </div>
    )
}
