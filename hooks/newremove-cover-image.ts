import { useEdgeStore, EdgeStoreType} from "@/lib/edgestore";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";


const { edgestore } = useEdgeStore(); // Ensure you can access edgestore here

const params = useParams();
    const documentId = params.documentId as Id<"documents">;

    const document = useQuery(api.documents.getById, {
        documentId
    });

export const deleteCoverImageUtil = async ( urlToDelete: string | undefined) => {
  urlToDelete = document?.coverImage;

    if (urlToDelete) {
      await edgestore.publicFiles.delete({ url: urlToDelete });
      console.log("lölllCover image deleted:", urlToDelete);
    } else {
      console.log("Error: No cover image to delete");
    }
  };