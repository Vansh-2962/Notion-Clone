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

export const duplicate = mutation({
  args: {
    _id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    async function duplicateRecursively(
      originalId: Id<"documents">,
      newParentId: Id<"documents"> | undefined
    ): Promise<Id<"documents">> {
      const original = await ctx.db.get(originalId)

      if (!original) {
        throw new Error("Document not found")
      }

      const { _id, _creationTime, title, ...rest } = original

      const duplicatedId = await ctx.db.insert("documents", {
        ...rest,
        title: newParentId ? original.title : `${original.title} (Copy)`,
        parentId: newParentId,
        isArchived: false,
      })

      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", identity!.subject).eq("parentId", originalId)
        )
        .collect()

      for (const child of children) {
        await duplicateRecursively(child._id, duplicatedId)
      }

      return duplicatedId
    }

    return await duplicateRecursively(args._id, undefined)
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

export const updateIcon = mutation({
  args: { _id: v.string(), url: v.string() },
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

    const updatedIcon = ctx.db.patch(args._id as Id<"documents">, {
      icon: args.url,
    })

    return updatedIcon
  },
})

export const addComment = mutation({
  args: { _id: v.string(), comment: v.string() },
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

    const commentedDoc = ctx.db.patch(args._id as Id<"documents">, {
      comments: args.comment,
    })

    return commentedDoc
  },
})

export const deleteComment = mutation({
  args: { _id: v.string() },
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

    const result = ctx.db.patch(args._id as Id<"documents">, {
      comments: undefined,
    })

    return result
  },
})

export const addContent = mutation({
  args: { _id: v.string(), content: v.string() },
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

    const commentedDoc = ctx.db.patch(args._id as Id<"documents">, {
      content: args.content,
    })

    return commentedDoc
  },
})

export const addToFavourites = mutation({
  args: { _id: v.string(), val: v.boolean() },
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

    const favDoc = ctx.db.patch(args._id as Id<"documents">, {
      isFavourite: args.val,
    })

    return favDoc
  },
})

export const publishDoc = mutation({
  args: { _id: v.string(), val: v.boolean() },
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

    const favDoc = ctx.db.patch(args._id as Id<"documents">, {
      isFavourite: args.val,
    })

    return favDoc
  },
})

export const addToPrivate = mutation({
  args: { _id: v.string(), val: v.boolean() },
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

    const privDoc = ctx.db.patch(args._id as Id<"documents">, {
      isPrivate: args.val,
    })

    return privDoc
  },
})

export const deleteDoc = mutation({
  args: { _id: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Unauthorized")
    }

    const doc = await ctx.db.get(args._id as Id<"documents">)
    if (!doc) throw new Error("Document not found")

    if (doc.userId != identity.subject) {
      throw new Error("Unauthorized")
    }

    async function deleteRecursively(docId: Id<"documents">) {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_parentId", (q) => q.eq("parentId", docId))
        .collect()

      for (const child of children) {
        await deleteRecursively(child._id)
      }

      await ctx.db.delete(docId)
    }

    await deleteRecursively(args._id as Id<"documents">)

    return { success: true }
  },
})
