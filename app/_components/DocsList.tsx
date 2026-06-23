import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { cn } from "@/lib/utils"
import { Document } from "../types/types"
import {
  ChevronRight,
  Copy,
  Ellipsis,
  FileTypeCorner,
  Plus,
  Trash,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const DocsList = () => {
  const docs = useQuery(api.document.getDocs)
  return (
    <>
      <div className="py-3">
        {docs?.length &&
          docs.map((item: Document) => (
            <div
              role="button"
              key={item._id}
              className={cn(
                `group my-1 flex cursor-pointer items-center justify-between gap-3 px-5 py-1 text-muted-foreground hover:bg-primary-foreground hover:text-primary hover:dark:bg-zinc-900 hover:dark:text-white`
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-4 w-4">
                  <FileTypeCorner className="absolute inset-0 h-4 w-4 transition-opacity group-hover:opacity-0" />
                  <ChevronRight className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p>{item.title}</p>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded p-1 outline-none hover:bg-primary/10 focus:outline-none dark:hover:bg-zinc-700">
                      <Ellipsis className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Copy className="h-3 w-3" /> Duplicate
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Trash className="h-3 w-3" /> Move to Trash
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button className="rounded p-1 outline-none hover:bg-primary/10 focus:outline-none dark:hover:bg-zinc-700">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default DocsList
