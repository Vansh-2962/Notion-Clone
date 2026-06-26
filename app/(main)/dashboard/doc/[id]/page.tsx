"use client"
import { timeAgo } from "@/app/lib/helper"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { Globe } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const Page = () => {
  const { id } = useParams()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const updateTitle = useMutation(api.document.updateTitle)
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

  return (
    <main className="w-full">
      <header className="flex items-center justify-between px-6 py-8">
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
            {doc?.title}
          </h1>

          <small className="text-muted-foreground">
            {timeAgo(new Date(doc?._creationTime as number))}
          </small>
        </div>
        <Button>
          <Globe className="h-4 w-4" /> Publish
        </Button>
      </header>

      <section className="h-64 w-full">{/* Banner Image */}</section>

      <section></section>
    </main>
  )
}

export default Page
