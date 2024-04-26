import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
    handler: async(ctx) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {                                    // when not logedin user try to create a new doc we wont allow it!
            throw new Error ("Not authenticated");
        }

        const documents = await ctx.db.query("documents").collect();    // loading  all documents (not only its own documents) and (.collect()) is giving the abilty to show the docs in api func

        return documents;
    }
});

export const create = mutation ({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))   // we are creating a document so evrer doc have to have a title but optional (nullable) to have perat doc
    },
    handler: async (ctx, args ) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {                                    // when not logedin user try to create a new doc we wont allow it!
            throw new Error ("Not authenticated");
        }

        const userId = identity.subject;        // extract the user id from the subject 

        const document =  await ctx.db.insert("documents", {                          // creating new doc and put in the documents table in the db 
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        return document;
    }
});