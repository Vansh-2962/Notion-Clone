import { Id } from "@/convex/_generated/dataModel"

export interface Document {
  _id?: Id<"documents">
  title: string
  content?: string
  coverImage?: string
  isArchived?: boolean
  isPublished?: boolean
  isPrivate?: boolean
  isFavourite?: boolean
  parentId?: Id<"documents">
  userId?: string
  icon?: string
  createdAt?: Date | number | string
}
