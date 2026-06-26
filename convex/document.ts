import { Id } from "./_generated/dataModel"
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
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_userid", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10)

    return docs
  },
})

export const getDoc = query({
  args: { _id: v.string() },
  handler: async (ctx, args) => {
    const identity = ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const doc = await ctx.db
      .query("documents")
      .withIndex("by_id", (q) => q.eq("_id", args._id as Id<"documents">))
      .collect()

    if (!doc) {
      throw new Error("Doc not found")
    }

    return doc[0]
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
      parentId: args.parentId,
    })

    return doc
  },
})

export const moveToTrash = mutation({
  args: { _id: v.id("documents") },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const archiveChildren = async (documentId: Id<"documents">) => {
      await ctx.db.patch(documentId, {
        isArchived: true,
      })

      const children = await ctx.db
        .query("documents")
        .filter((q) => q.eq(q.field("parentId"), documentId))
        .collect()

      for (const child of children) {
        await archiveChildren(child._id)
      }
    }

    await archiveChildren(args._id)

    return true
  },
})

export const restoreDoc = mutation({
  args: { _id: v.id("documents") },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const doc = await ctx.db.get(args._id)

    if (!doc) {
      throw new Error("Document not found")
    }

    let parentId = doc.parentId

    if (parentId) {
      const parent = await ctx.db.get(parentId)

      if (!parent || parent.isArchived) {
        parentId = undefined
      }
    }

    await ctx.db.patch(args._id, {
      isArchived: false,
      parentId,
    })

    return true
  },
})

export const clearTrash = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const userId = identity.subject

    const trashedDocs = await ctx.db
      .query("documents")
      .withIndex("by_userid", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect()

    for (const doc of trashedDocs) {
      await ctx.db.delete(doc._id)
    }

    return {
      deletedCount: trashedDocs.length,
    }
  },
})

export const updateTitle = mutation({
  args: { _id: v.string(), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const doc = ctx.db
      .query("documents")
      .withIndex("by_id", (q) => q.eq("_id", args._id as Id<"documents">))
      .collect()

    if (!doc) {
      throw new Error("Doc not found")
    }

    const updatedTitle = ctx.db.patch(args._id as Id<"documents">, {
      title: args.title,
    })

    return updatedTitle
  },
})
