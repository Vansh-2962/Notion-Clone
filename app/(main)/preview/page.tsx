"use client"
import { timeAgo } from "@/lib/helper"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Images, MessageSquareMore, Smile, Trash } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"
import Comment from "@/app/_components/Comment"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { Editor } from "@/app/_components/DynamicEditor"
import DocSkeleton from "@/app/_components/DocSkeleton"
import MenuButtons from "@/app/_components/MenuButtons"
import PrivatePage from "@/app/_components/PrivatePage"
import Image from "next/image"

const Page = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const reason = searchParams.get("r")

  const { theme } = useTheme()
  const [emojiModal, setEmojiModal] = useState<boolean>(false)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)
  const { user } = useUser()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const doc = useQuery(api.document.getDoc, {
    _id: id as string,
  })

  const isPrivate = doc?.isPrivate
  const isOwner = doc?.userId === user?.id
  const canView = !isPrivate || isOwner

  const profileImg = user?.imageUrl
  useEffect(() => {
    if (titleRef.current && doc?.title) {
      titleRef.current.textContent = doc.title
    }
  }, [doc?.title])

  if (doc === undefined) {
    return <DocSkeleton />
  }

  if (!canView) {
    return <PrivatePage />
  }

  return (
    <main className="h-screen w-full overflow-y-auto">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-end gap-3 text-nowrap">
          <h1 ref={titleRef} className="text-xl outline-none">
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

        {reason !== "view" && (
          <MenuButtons
            id={id as Id<"documents">}
            title={doc.title}
            isFav={doc.isFavourite}
            isPub={doc.isPublished}
            isPriv={doc.isPrivate}
          />
        )}
      </header>

      <section className="relative h-64 w-full">
        {doc.coverImage && (
          <Image
            src={doc.coverImage}
            alt="Document cover"
            fill
            className="object-cover"
            priority
          />
        )}
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="group py-5">
          <span className="">{doc?.icon && <img src={doc?.icon} />}</span>
          {reason !== "view" && (
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
          )}

          <h1
            ref={titleRef}
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
          className="bg-black"
        />

        <Editor
          doc={doc as Doc<"documents">}
          isView={reason === "view" ? true : false}
        />
      </section>
    </main>
  )
}

export default Page
