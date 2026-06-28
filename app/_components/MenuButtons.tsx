import { Button } from "@/components/ui/button"
import {
  Check,
  Globe,
  Info,
  Lock,
  LockOpen,
  Moon,
  Star,
  Sun,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { toast } from "sonner"
import { useOrigin } from "@/hooks/use-origin"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface MenuButtonsProps {
  id: Id<"documents">
  title: string
  isFav: boolean
  isPub: boolean
  isPriv: boolean
}

const MenuButtons = ({ id, title, isFav, isPub, isPriv }: MenuButtonsProps) => {
  const { theme, setTheme } = useTheme()
  const [publishing, setPublishing] = useState(false)
  const [copied, setCopied] = useState(false)
  const origin = useOrigin()

  const link = `${origin}/preview?id=${id}&r=view`

  const addToFav = useMutation(api.document.addToFavourites)
  const addToPrivate = useMutation(api.document.addToPrivate)
  const publish = useMutation(api.document.publishDoc)

  const handlePrivate = async () => {
    await addToPrivate({
      _id: id,
      val: isPriv ? false : true,
    })
  }

  const handleFav = async () => {
    await addToFav({
      _id: id,
      val: isFav ? false : true,
    })
  }

  const handlePublish = async () => {
    try {
      setPublishing(true)
      await publish({
        _id: id,
        val: isPub ? false : true,
      })
    } catch (error) {
      toast.error("Oops! Something went wrong")
    } finally {
      setPublishing(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="space-x-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <Globe className="h-4 w-4" />
            {isPub ? "Published" : "Publish"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h2 className="text-md flex items-center gap-2 leading-none font-semibold">
                <Globe className="h-4 w-4" />
                {isPub ? "Unpublish from the web" : "Publish to the web"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isPub
                  ? "This page will no longer be accessible through its public link."
                  : "Share this page with anyone using a public link."}
              </p>
            </div>
          </div>

          {isPub ? (
            <div className="space-y-2">
              <Input value={link} contentEditable={false} readOnly />
              <div className="flex justify-end gap-2">
                <Button onClick={copyLink} variant={"outline"} size={"sm"}>
                  {copied ? (
                    <>
                      Copied <Check />
                    </>
                  ) : (
                    <>Copy link</>
                  )}
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  size={"sm"}
                >
                  {publishing ? "Unpublishing..." : "Unpublish"}
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handlePublish} disabled={publishing}>
              {publishing ? "Publishing..." : "Publish"}
            </Button>
          )}

          <small className="my-4 flex items-center gap-1 text-muted-foreground">
            <Info className="h-6 w-6 text-xs" /> When published to web, anyone
            with the link can view this page’s content and see contributor
            names.
          </small>
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger onClick={handleFav}>
          <Star
            className={cn(
              `h-4 w-4`,
              isFav && "fill-amber-500 stroke-amber-500"
            )}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFav ? "Remove from" : "Add to"} favourites</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger onClick={handlePrivate}>
          {isPriv ? (
            <Lock className="h-4 w-4" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to {isPriv ? "Public" : "Private"}</p>
        </TooltipContent>
      </Tooltip>
      <Button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        variant={"outline"}
        size={"icon-sm"}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </div>
  )
}

export default MenuButtons
