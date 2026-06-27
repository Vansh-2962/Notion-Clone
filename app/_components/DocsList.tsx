import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { cn } from "@/lib/utils"
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
import { Doc, Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const DocsList = ({ docs }: { docs: Doc<"documents">[] }) => {
  const [expanded, setExpanded] = useState<Record<Id<"documents">, boolean>>({})
  const moveToTrash = useMutation(api.document.moveToTrash)
  const createDoc = useMutation(api.document.createDocument)

  function onDelete(id: Id<"documents">) {
    const promise = moveToTrash({ _id: id })
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Moved to trash",
      error: "Oops! Something went wrong",
    })
  }

  const handleCreate = (parentId: Id<"documents">) => {
    if (!parentId) return
    createDoc({ title: "Untitled", parentId })
  }

  const unArchivedDocs =
    (docs &&
      docs.length > 0 &&
      docs.filter((doc: Doc<"documents">) => !doc.isArchived)) ||
    []

  const renderDocuments = (parentId?: Id<"documents">, level = 0) => {
    const children = unArchivedDocs.filter((doc) => doc.parentId === parentId)

    return children.map((item) => {
      const hasChildren = unArchivedDocs.some(
        (doc) => doc.parentId === item._id
      )

      return (
        <div key={item._id}>
          <div
            role="button"
            className="group my-1 flex cursor-pointer items-center justify-between gap-3 py-1 text-muted-foreground hover:bg-primary-foreground hover:text-primary hover:dark:bg-zinc-900 hover:dark:text-white"
            style={{
              paddingLeft: `${20 + level * 20}px`,
              paddingRight: "20px",
            }}
          >
            <Link
              href={`/dashboard/doc/${item._id}`}
              className="flex items-center gap-3"
            >
              <div className="relative h-4 w-4">
                {item.icon ? (
                  <span
                    className={cn(
                      "absolute inset-0 h-4 w-4 transition-opacity",
                      hasChildren && "group-hover:opacity-0"
                    )}
                  >
                    <img src={item.icon} />
                  </span>
                ) : (
                  <FileTypeCorner
                    className={cn(
                      "absolute inset-0 h-4 w-4 transition-opacity",
                      hasChildren && "group-hover:opacity-0"
                    )}
                  />
                )}

                {hasChildren && (
                  <ChevronRight
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setExpanded((prev) => ({
                        ...prev,
                        [item._id]: !prev[item._id],
                      }))
                    }}
                    className={cn(
                      "absolute inset-0 h-4 w-4 transition-all group-hover:opacity-100",
                      expanded[item._id] ? "rotate-90 opacity-100" : "opacity-0"
                    )}
                  />
                )}
              </div>

              <p className="max-w-30 truncate">{item.title}</p>
            </Link>

            <div className="flex items-center opacity-0 group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded p-1 hover:bg-primary/10 dark:hover:bg-zinc-700">
                    <Ellipsis className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{item.title}</DropdownMenuLabel>

                    <DropdownMenuItem>
                      <Copy className="h-3 w-3" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => onDelete(item._id as Id<"documents">)}
                    >
                      <Trash className="h-3 w-3" />
                      Move to Trash
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => handleCreate(item._id as Id<"documents">)}
                className="rounded p-1 hover:bg-primary/10 dark:hover:bg-zinc-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {expanded[item._id] &&
            renderDocuments(item._id as Id<"documents">, level + 1)}
        </div>
      )
    })
  }

  return (
    <>
      <div className="py-3">{renderDocuments(undefined)}</div>
    </>
  )
}

export default DocsList
