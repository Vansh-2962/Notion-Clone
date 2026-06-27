"use client"
import { timeAgo } from "@/app/lib/helper"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { Globe, Images, MessageSquareMore, Smile } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react"
import { useTheme } from "next-themes"

const Page = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const [emojiModal, setEmojiModal] = useState<boolean>(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const updateTitle = useMutation(api.document.updateTitle)
  const updateIcon = useMutation(api.document.updateIcon)
  const doc = useQuery(api.document.getDoc, {
    _id: id as string,
  })

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

  return (
    <main className="w-full">
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
        <Button>
          <Globe className="h-4 w-4" /> Publish
        </Button>
      </header>

      <section className="h-64 w-full bg-black/40">
        {/* Banner Image */}
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="group py-5">
          <span className="">{doc?.icon && <img src={doc?.icon} />}</span>
          <div className="opacity-0 transition-all ease-in-out group-hover:opacity-100 mt-1">
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
              className="border-none text-muted-foreground outline-none focus:outline-0"
            >
              <MessageSquareMore /> Add comment
            </Button>
          </div>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-muted-foreground">
            Home Page
          </h1>
        </div>

        <EmojiPicker
          open={emojiModal}
          emojiStyle={EmojiStyle.FACEBOOK}
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiSelect}
          className="bg-black"
        />
      </section>
    </main>
  )
}

export default Page
