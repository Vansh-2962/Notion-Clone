import { Doc } from "./_generated/dataModel"
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getDocs = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error("Unauthorized")
    }

    const userId = identity.subject
    const queryResult = await ctx.db
      .query("documents")
      .withIndex("by_userid", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10)

    const docs = queryResult.map((doc: Doc<"documents">) => {
      return {
        _id: doc._id,
        createdAt: doc._creationTime,
        title: doc.title,
        parentId: doc.parentId,
      }
    })

    return docs
  },
})

export const createDocument = mutation({
  args: { title: v.string(), parentId: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error("Unauthorized")
    }

    const user = identity.subject
    const doc = await ctx.db.insert("documents", {
      title: args.title,
      isArchived: false,
      isPublished: false,
      isPrivate: false,
      isFavourite: false,
      content: "",
      userId: user,
    })

    return doc
  },
})
