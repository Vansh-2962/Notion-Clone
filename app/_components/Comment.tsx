"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { SendHorizontal, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface CommentProps {
  id: Id<"documents">
  isCommenting: boolean
  setIsCommenting: (val: boolean) => void
}

const Comment = ({ id, isCommenting, setIsCommenting }: CommentProps) => {
  const { user } = useUser()
  const image = user?.imageUrl
  const [val, setVal] = useState<string>("")
  const addComment = useMutation(api.document.addComment)

  const handleComment = async () => {
    if (!val || val.length === 0) {
      toast.error("Please add a comment.")
      return
    }
    await addComment({
      _id: id,
      comment: val,
    })
    setVal("")
    setIsCommenting(false)
  }

  return (
    <div className="mt-10">
      {isCommenting && (
        <div className="flex items-start gap-1">
          <img src={image} alt="profile" className="h-6 w-6 rounded-full" />
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleComment()
              }
            }}
            className="ml-3 w-full border-b outline-none"
            placeholder="Add a comment"
          />
          <Button
            onClick={() => setIsCommenting(false)}
            size={"icon-sm"}
            variant={"ghost"}
          >
            <X className="text-muted-foreground" />
          </Button>
          <Button onClick={handleComment} size={"icon-sm"} variant={"ghost"}>
            <SendHorizontal className="text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Comment
