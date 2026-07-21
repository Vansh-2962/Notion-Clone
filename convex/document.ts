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
    const identity = await ctx.auth.getUserIdentity()
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

export const addCover = mutation({
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

    const imageDoc = ctx.db.patch(args._id as Id<"documents">, {
      coverImage: args.url,
    })

    return imageDoc
  },
})

export const removeCover = mutation({
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

    const imageDoc = ctx.db.patch(args._id as Id<"documents">, {
      coverImage: undefined,
    })

    return imageDoc
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

    const publishedDoc = ctx.db.patch(args._id as Id<"documents">, {
      isPublished: args.val,
    })

    return publishedDoc
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

// -----------------------------------------------------------------

export const updateFont = mutation({
  args: {
    font: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error("Unauthorized")

    const userId = identity.subject

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique()

    if (!settings) {
      return await ctx.db.insert("settings", {
        userId,
        font: args.font,
        fontSize: "medium",
      })
    }

    await ctx.db.patch(settings._id, {
      font: args.font,
    })

    return settings._id
  },
})

export const updateFontSize = mutation({
  args: {
    fontSize: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error("Unauthorized")

    const userId = identity.subject

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique()

    if (!settings) {
      return await ctx.db.insert("settings", {
        userId,
        fontSize: args.fontSize,
      })
    }

    await ctx.db.patch(settings._id, {
      fontSize: args.fontSize,
    })

    return settings._id
  },
})

export const getSettings = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }
    const userId = identity.subject

    const setting = await ctx.db
      .query("settings")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    return setting[0]
  },
})

// ------------------------------------------------------------------------

export const saveSnapshot = mutation({
  args: {
    snapshot: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    const existing = await ctx.db.query("diagrams").first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        snapshot: args.snapshot,
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("diagrams", {
        snapshot: args.snapshot,
        updatedAt: Date.now(),
      })
    }
  },
})

export const getSnapshot = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized")
    }

    return await ctx.db.query("diagrams").first()
  },
})

export const updateAnalytics = mutation({
  args: {
    documentId: v.id("documents"),
    visitorId: v.string(),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
    referrer: v.optional(v.string()),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    device: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("analytics")
      .withIndex("by_document_visitor", (q) =>
        q.eq("documentId", args.documentId).eq("visitorId", args.visitorId)
      )
      .first()

    if (existing && Date.now() - existing.viewedAt < 1000 * 60 * 30) {
      return existing._id
    }
    if (existing) {
      await ctx.db.patch(existing._id, {
        viewedAt: Date.now(),
        country: args.country,
        city: args.city,
        referrer: args.referrer,
        browser: args.browser,
        os: args.os,
        device: args.device,
      })

      return existing._id
    }

    return await ctx.db.insert("analytics", {
      documentId: args.documentId,
      visitorId: args.visitorId,
      viewedAt: Date.now(),
      country: args.country,
      city: args.city,
      referrer: args.referrer,
      browser: args.browser,
      os: args.os,
      device: args.device,
    })
  },
})

export const getAnalytics = query({
  args: {
    documentId: v.id("documents"),
  },

  handler: async (ctx, args) => {
    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect()

    const totalViews = analytics.length

    const uniqueVisitors = new Set(analytics.map((a) => a.visitorId)).size

    const countries = new Map<string, number>()
    const devices = new Map<string, number>()
    const browsers = new Map<string, number>()
    const referrers = new Map<string, number>()
    const views = new Map<string, number>()

    for (const item of analytics) {
      const country = item.country ?? "Unknown"
      countries.set(country, (countries.get(country) ?? 0) + 1)

      const device = item.device ?? "Unknown"
      devices.set(device, (devices.get(device) ?? 0) + 1)

      const browser = item.browser ?? "Unknown"
      browsers.set(browser, (browsers.get(browser) ?? 0) + 1)

      const referrer = item.referrer || "Direct"
      referrers.set(referrer, (referrers.get(referrer) ?? 0) + 1)

      const day = new Date(item.viewedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })

      views.set(day, (views.get(day) ?? 0) + 1)
    }

    return {
      totalViews,
      uniqueVisitors,

      countries: [...countries.entries()]
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views),

      devices: [...devices.entries()]
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views),

      browsers: [...browsers.entries()]
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views),

      referrers: [...referrers.entries()]
        .map(([name, views]) => ({ name, views }))
        .sort((a, b) => b.views - a.views),

      views: [...views.entries()].map(([date, views]) => ({
        date,
        views,
      })),
    }
  },
})
