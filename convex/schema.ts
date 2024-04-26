import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema ({
    documents: defineTable ({
        title: v.string (),
        userId:  v.string (), // here pass the user ide from clerk 
        isArchived: v.boolean(), // to soft  delete a document
        parentDocument: v.optional(v.id("documents")),   // this will refer to documntes itself, creating a relation dpcument with the document itself so evry doc have option to have a parent doc
        content: v.optional(v.string()),  // the content inside the doc 
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.boolean(),   // the abilty ton share url for geustes
    })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"])
});
