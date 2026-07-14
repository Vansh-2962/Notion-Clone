"use client"
import { timeAgo } from "@/lib/helper"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import {
  Images,
  Menu,
  MessageSquareMore,
  Smile,
  Sparkles,
  Star,
  Trash,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import Comment from "@/app/_components/Comment"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { Editor } from "@/app/_components/DynamicEditor"
import DocSkeleton from "@/app/_components/DocSkeleton"
import MenuButtons from "@/app/_components/MenuButtons"
import { useUploadThing } from "@/lib/uploadthing"
import Image from "next/image"
import { toast } from "sonner"
import { getUploadErrorMessage } from "@/lib/uploadThingError"
import AIDialog from "@/app/_components/AIDialog"
import { useSidebarStore } from "@/app/_store/useSidebarStore"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MoreVertical } from "lucide-react"

const Page = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const { toggle, isOpen } = useSidebarStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [emojiModal, setEmojiModal] = useState<boolean>(false)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)
  const [aiResponse, setAIResponse] = useState<string>("")

  const titleRef = useRef<HTMLHeadingElement>(null)

  const updateTitle = useMutation(api.document.updateTitle)
  const updateIcon = useMutation(api.document.updateIcon)
  const deleteComment = useMutation(api.document.deleteComment)
  const addCover = useMutation(api.document.addCover)
  const removeCover = useMutation(api.document.removeCover)

  const doc = useQuery(api.document.getDoc, {
    _id: id as string,
  })

  const { user } = useUser()
  const profileImg = user?.imageUrl

  useEffect(() => {
    if (titleRef.current && doc?.title) {
      titleRef.current.textContent = doc.title
    }
  }, [doc?.title])

  const onBlur = async (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent?.trim() || "Untitled"

    await updateTitle({
      _id: id as string,
      title: newTitle,
    })
  }

  const handleEmojiSelect = async (e: any) => {
    if (!e.imageUrl) return
    await updateIcon({
      _id: id as string,
      url: e.imageUrl,
    })
    setEmojiModal(false)
  }

  const handleDeleteComment = async () => {
    await deleteComment({
      _id: id as string,
    })
  }

  const handleRemoveCover = (_id: Id<"documents">) => {
    if (!_id) return
    removeCover({
      _id: _id,
    })
  }

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res: any) => {
      await addCover({
        _id: id as Id<"documents">,
        url: res?.[0]?.ufsUrl,
      })
    },
    onUploadError: (error: Error) => {
      toast.error(getUploadErrorMessage(error))
    },
  })

  if (doc === undefined) {
    return <DocSkeleton />
  }

  return (
    <main className="min-h-dvh w-full overflow-y-auto">
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
              <h1
                ref={titleRef}
                contentEditable
                suppressContentEditableWarning
                className="truncate text-lg font-semibold outline-none sm:text-xl"
                onBlur={onBlur}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }
                }}
              >
                {doc === undefined ? (
                  <Skeleton className="h-5 w-40" />
                ) : (
                  doc.title
                )}
              </h1>

              <small className="shrink-0 text-xs text-muted-foreground sm:text-sm">
                {doc === undefined ? (
                  <Skeleton className="h-3 w-16" />
                ) : (
                  timeAgo(new Date(doc._creationTime))
                )}
              </small>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden shrink-0 md:block">
          <MenuButtons
            id={id as Id<"documents">}
            title={doc.title}
            isFav={doc.isFavourite}
            isPub={doc.isPublished}
            isPriv={doc.isPrivate}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-56 p-2">
            <MenuButtons
              id={id as Id<"documents">}
              title={doc.title}
              isFav={doc.isFavourite}
              isPub={doc.isPublished}
              isPriv={doc.isPrivate}
            />
          </PopoverContent>
        </Popover>
      </header>

      <section className="group relative h-40 w-full sm:h-48 md:h-56 lg:h-64">
        {doc.coverImage ? (
          <Image
            src={doc.coverImage}
            alt="Document cover"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : isUploading ? (
          <Skeleton className="h-full w-full" />
        ) : null}

        <div className="absolute right-2 bottom-2 flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          {doc.coverImage && (
            <Button
              onClick={() => handleRemoveCover(doc._id as Id<"documents">)}
              size="xs"
              className="bg-white/60 px-2 py-1 text-xs backdrop-blur-sm sm:px-3 sm:text-sm"
            >
              Remove cover
            </Button>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="group py-5">
          <span>
            {doc?.icon && (
              <img
                src={doc.icon}
                alt="Document icon"
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
            )}
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              className="border-none text-muted-foreground outline-none focus:outline-0"
              onClick={() => setEmojiModal(!emojiModal)}
            >
              <Smile className="mr-1 h-4 w-4" />
              Add icon
            </Button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const files = e.target.files
                if (!files?.length) return

                await startUpload(Array.from(files))

                e.target.value = ""
              }}
            />

            {!doc.coverImage && (
              <Button
                disabled={isUploading}
                onClick={() => fileRef.current?.click()}
                size="sm"
                variant="ghost"
                className="border-none text-muted-foreground outline-none focus:outline-0"
              >
                <Images className="mr-1 h-4 w-4" />
                Add cover
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCommenting(!isCommenting)}
              className="border-none text-muted-foreground outline-none focus:outline-0"
            >
              <MessageSquareMore className="mr-1 h-4 w-4" />
              Add comment
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={onBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  e.currentTarget.blur()
                }
              }}
              className="min-w-0 text-3xl font-bold tracking-tight wrap-break-word text-muted-foreground outline-none sm:text-4xl dark:text-zinc-200"
            >
              {doc?.title ?? "Untitled"}
            </h1>

            <div className="shrink-0">
              <AIDialog setAIResponse={setAIResponse} />
            </div>
          </div>

          {doc?.comments && (
            <div className="group my-8 flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3 text-sm text-muted-foreground">
                <img
                  src={profileImg}
                  alt="profile"
                  className="h-5 w-5 shrink-0 rounded-full"
                />

                <div className="min-w-0">
                  <span className="text-sm font-medium">{user?.fullName}</span>

                  <p className="wrap-break-word text-white">{doc.comments}</p>
                </div>
              </div>

              <Button
                onClick={handleDeleteComment}
                size="icon-xs"
                variant="ghost"
                className="shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash />
              </Button>
            </div>
          )}

          <Comment
            id={id as Id<"documents">}
            setIsCommenting={setIsCommenting}
            isCommenting={isCommenting}
          />
        </div>

        <EmojiPicker
          open={emojiModal}
          emojiStyle={EmojiStyle.FACEBOOK}
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiSelect}
          className="max-w-full"
        />

        <Editor doc={doc as Doc<"documents">} aiResponse={aiResponse} />
      </section>
    </main>
  )
}

export default Page
