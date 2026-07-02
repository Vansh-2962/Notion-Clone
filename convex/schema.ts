import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    isPrivate: v.boolean(),
    isFavourite: v.boolean(),
    parentId: v.optional(v.id("documents")),
    userId: v.string(),
    icon: v.optional(v.string()),
    comments: v.optional(v.string()),
  })
    .index("by_title", ["title"])
    .index("by_userid", ["userId"])
    .index("by_parentId", ["parentId"])
    .index("by_user_parent", ["userId", "parentId"]),

  settings: defineTable({
    font: v.optional(v.string()),
    fontSize: v.optional(v.string()),
    userId: v.string(),
  }).index("by_userId", ["userId"]),

  diagrams: defineTable({
    snapshot: v.string(),
    updatedAt: v.number(),
  }).index("by_snapshot", ["snapshot"]),
})
