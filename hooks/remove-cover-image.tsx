import { useEdgeStore } from "@/lib/edgestore";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

import { v } from "convex/values";

import { mutation, query } from "@/convex/_generated/server";

// Function to delete cover image
export const useDeleteCoverImage = (
    //urlToDelete: string | undefined
   // documentId: Id<"documents">
) => {
    const params = useParams();
    const { edgestore } = useEdgeStore();
    const documentId = params.documentId as Id<"documents">;

    const document = useQuery(api.documents.getById, {
        documentId
    });
    
    if (!document) {
        console.log("No document found for ID:", documentId);
        return;
    }
    return async (urlToDelete?: string) => {
        
        urlToDelete = document?.coverImage;
        if (urlToDelete) {
            try {
                await edgestore.publicFiles.delete({ url: urlToDelete });
                return urlToDelete;
                console.log("Cover image deleted:", urlToDelete);
            } catch (error) {
                console.error("Error deleting cover image:", error);
            }
        } else {
            console.log("Error: No cover image to delete");
        }
    };
};