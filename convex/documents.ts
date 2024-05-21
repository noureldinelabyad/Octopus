import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { useQuery } from "convex/react";
//import { useDeleteCoverImage } from "@/hooks/remove-cover-image";

import { deleteCoverImageUtil } from "@/hooks/newremove-cover-image"; // Import the utility function
import { useEdgeStore } from "@/lib/edgestore";
import { EdgeStoreType } from "@/lib/edgestore";




export const archive = mutation({
  args: { id: v.id("documents") }, // pass the documnent id
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // get the user idendity

    if (!identity) {   // if we dont have the user identitiy we cant fetch the documents
      throw new Error("Not authenticated");
    }

    const userId = identity.subject; // extract the user id from the identity

    const existingDocument = await ctx.db.get(args.id); // fetch the document using that id

    if (!existingDocument) {
      throw new Error("Not fond");
    }

    if (existingDocument?.userId !== userId) { // make sure the userID of the document match the userId that loged in
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {  // recurively arhcive or delting all the children of a documnt if i delete the parent document
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();


      for (const child of children) {
        // for loop to repeate the the same above with every  child of the document, and we dont use foreach or map becouse we are using a promise inside of that like asyne await

        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id); // re run the enteire function again
      }
    };

    const document = await ctx.db.patch(args.id, {
      // we archive that document using the pach function followed with the id we trying to modifiy // and modify the data insdie its object by putting it  to be archived
      isArchived: true,
    });

    recursiveArchive(args.id); // after we mofiy the main document to be dleted above we pass that id , it fetsh all the children that have that id as perant document
    // so we repeate the recurive func again to  make sure all childrens themself dont have othe rchildren and are archived too, to got the end of the nested child
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")), //check schema.ts to see all the  valid types
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity(); // get the user idendity

    if (!identity) {
      // if we dont have the user identitiy we cant fetch the documents
      throw new Error("Not authenticated");
    }

    const userId = identity.subject; // extract the user id from the identity

    const documents = await ctx.db
      .query("documents") // using fast queries becouse becouse  they are indexed in the schema.ta
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter(
        (q) => q.eq(q.field("isArchived"), false) // so we dont want to show any of the deleted or archived documents
      )
      .order("desc")
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")), // we are creating a document so evrer doc have to have a title but optional (nullable) to have perat doc
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // when not logedin user try to create a new doc we wont allow it!
      throw new Error("Not authenticated");
    }

    const userId = identity.subject; // extract the user id from the subject

    const document = await ctx.db.insert("documents", {
      // creating new doc and put in the documents table in the db
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getTrash =  query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents  = await ctx.db
     .query("documents")
     .withIndex("by_user", (q) => q.eq("userId",userId))
     .filter((q) => 
      q.eq(q.field("isArchived"), true),
    )
    .order("desc")
    .collect();

    return documents;
  }
});

export const restore = mutation({
  args: {id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error ("Not fond");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recuriveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) => (
        q
         .eq("userId", userId)
         .eq("parentDocument",  documentId)
      ))
      .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });

        await recuriveRestore(child._id);
      }
    }

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await  ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const documnent = await ctx.db.patch(args.id, options);

    recuriveRestore(args.id);

    return documnent;
  }
});


export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    //const deleteCoverImage = useDeleteCoverImage(); // Use the utility function

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id); // fetch the document that we want to remove

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("NOT  AUTHORIZED");
    }
    const { edgestore } = useEdgeStore(); // Ensure you can access edgestore here
    
    const recursiveDelete = async (documentId: Id<"documents">) =>{


      const children = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q)=>(
        q
          .eq("userId",userId)
          .eq("parentDocument",documentId)
      ))
      .collect();
      
      for (const child of children){
        const urlToDelete = child.coverImage;  

        await ctx.db.patch(child._id,{
         isArchived:true,
        });

        await deleteCoverImageUtil(urlToDelete);
        console.log("urlrec", urlToDelete);
       await recursiveDelete(child._id);
        await ctx.db.delete(child._id);
      }
   // await deleteCoverImage?.(urlToDelete); // Delete cover image of the child document
    }

    await recursiveDelete(args.id);
    const document = await ctx.db.delete(args.id);

    return document;
  }
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const  documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.eq(q.field("isArchived"), false),    // so we cant search for  archived docs
    )
    .order("desc")
    .collect()

    return  documents;
  }
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await  ctx.auth.getUserIdentity();      // we will not check if the user authored or not becouse we are using this for published docs too!

    const document = await ctx.db.get(args.documentId);  // fetch the document 

    if ( !document ) {
      throw new Error ("Not found")
    }

    if (document.isPublished && !document.isArchived) {  // check if we can show th doc to the user, even if loged in or not becouse its published and not archived or deleted 
      return document;
    }
  
    if (!identity) {
      throw new Error ("Not authenticated");
    }

    const userId  = identity.subject;

    if (document.userId !== userId) {
      throw new Error ("Unathorized to view this")
    }

    return document;
  }
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished:  v.optional(v.boolean())
  },
  handler: async (ctx,args) => {
    const idendity = await ctx.auth.getUserIdentity();

    if (!idendity) {
      throw new Error ("Unauthenticated");
    }

    const userId = idendity.subject;

    const { id, ...rest } = args;  // destructring evrything in the argumnt (upadate) exept the id becouse we never send the id to be updated

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument){
      throw new Error ("Not found")
    }

    if  (existingDocument.userId != userId ) {
      throw new Error ("Unauthorized")
    }

    const document = await ctx.db.patch(args.id, {
      ...rest,
    });

    return document;
  },
});

export const removeIcon = mutation ({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const idendity = await ctx.auth.getUserIdentity();

    if (!idendity) {
      throw new Error ("Unauthenticated");
    }

    const userId = idendity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
    throw new Error ("Not Found");
    }

    if (existingDocument.userId !== userId ) {
      throw new Error ("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    });

    return document;
  }
});

export const removeCoverImage = mutation ({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const idendity = await ctx.auth.getUserIdentity();

    if (!idendity) {
      throw new Error ("Unauthenticated");
    }

    const userId = idendity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error ("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error ("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });

    return document;
  }
});

export const getParentPath = query({
  args: {
     documentId: v.id("documents")
     },
     
  handler: async (ctx, args) => {
    let path = [];
    let currentDocumentId: Id<"documents"> | undefined = args.documentId;

    while (currentDocumentId) {
      const document: Doc<"documents"> | null | undefined = await ctx.db.get(currentDocumentId);
      if (!document) break; // Exit if the document is not found (null or undefined)
      
      let titleWithIcon = document.icon ? `${document.icon} ${document.title}` : document.title;
      path.unshift(titleWithIcon); // Add the formatted title and icon to the start of the path array
      
      currentDocumentId = document.parentDocument; // Move to the next parent
    }

    return path.join(' / '); // Join all titles with slashes and spaces to form the path
  }
});





