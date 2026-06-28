"use client"
import { timeAgo } from "@/app/lib/helper"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import {
  Globe,
  Images,
  MessageSquareMore,
  Smile,
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

const Page = () => {
  const { id } = useParams()
  const { theme } = useTheme()

  const [emojiModal, setEmojiModal] = useState<boolean>(false)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)

  const titleRef = useRef<HTMLHeadingElement>(null)

  const updateTitle = useMutation(api.document.updateTitle)
  const updateIcon = useMutation(api.document.updateIcon)
  const deleteComment = useMutation(api.document.deleteComment)

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

  if (doc === undefined) {
    return <DocSkeleton />
  }

  return (
    <main className="h-screen w-full overflow-y-auto">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-end gap-3 text-nowrap">
          <h1
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            className="text-xl outline-none"
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          >
            {doc == undefined ? (
              <Skeleton className="h-4 w-37.5" />
            ) : (
              doc?.title
            )}
          </h1>

          <small className="text-muted-foreground">
            {doc === undefined ? (
              <Skeleton className="h-3 w-16" />
            ) : (
              timeAgo(new Date(doc?._creationTime as number))
            )}
          </small>
        </div>

        <MenuButtons
          id={id as Id<"documents">}
          isFav={doc.isFavourite}
          isPub={doc.isPublished}
          isPriv={doc.isPrivate}
        />
      </header>

      <section className="h-64 w-full">{/* Banner Image */}</section>

      <section className="mx-auto max-w-6xl">
        <div className="group py-5">
          <span className="">{doc?.icon && <img src={doc?.icon} />}</span>
          <div className="mt-1 opacity-0 transition-all ease-in-out group-hover:opacity-100">
            <Button
              size={"sm"}
              variant={"ghost"}
              className="border-none text-muted-foreground outline-none focus:outline-0"
              onClick={() => setEmojiModal(!emojiModal)}
            >
              <Smile /> Add icon
            </Button>

            <Button
              size={"sm"}
              variant={"ghost"}
              className="border-none text-muted-foreground outline-none focus:outline-0"
            >
              <Images /> Add cover
            </Button>
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => setIsCommenting(!isCommenting)}
              className="border-none text-muted-foreground outline-none focus:outline-0"
            >
              <MessageSquareMore /> Add comment
            </Button>
          </div>
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
            className="mt-1 text-4xl font-bold tracking-tight text-muted-foreground outline-none dark:text-zinc-200"
          >
            {doc?.title ?? "Untitled"}
          </h1>
          {doc?.comments && (
            <div className="group my-8 flex items-center justify-between">
              <div className="flex gap-3 text-sm text-muted-foreground">
                <img
                  src={profileImg}
                  alt="profile"
                  className="h-5 w-5 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.fullName}</span>
                  <p className="text-white">{doc?.comments}</p>
                </div>
              </div>
              <Button
                onClick={handleDeleteComment}
                size={"icon-xs"}
                variant={"ghost"}
                className="opacity-0 group-hover:opacity-100"
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
          className="bg-black"
        />

        <Editor doc={doc as Doc<"documents">} />
      </section>
    </main>
  )
}

export default Page
