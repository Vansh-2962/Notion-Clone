import { Button } from "@/components/ui/button"
import { Globe, Info, Lock, LockOpen, Moon, Star, Sun } from "lucide-react"
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
import { Input } from "@/components/ui/input"

interface MenuButtonsProps {
  id: Id<"documents">
  isFav: boolean
  isPub: boolean
  isPriv: boolean
}

const MenuButtons = ({ id, isFav, isPub, isPriv }: MenuButtonsProps) => {
  const { theme, setTheme } = useTheme()

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
    await publish({
      _id: id,
      val: isPub ? false : true,
    })
  }

  return (
    <div className="space-x-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <Globe className="h-4 w-4" /> Publish
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h2 className="text-md flex items-center gap-2 leading-none font-semibold">
                <Globe className="h-4 w-4" /> Publish to the web
              </h2>
              <p className="text-sm text-muted-foreground">
                Share this page with anyone using a public link.
              </p>
            </div>
          </div>
          <Button onClick={handlePublish}>Publish</Button>
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
