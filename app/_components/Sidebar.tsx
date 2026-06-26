"use client"
import { UserButton, useUser } from "@clerk/nextjs"
import { sidebarItems, SidebarItemsType } from "../lib/sidebarItems"
import { cn } from "@/lib/utils"
import { ChevronsLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import DocsList from "./DocsList"
import { useRouter } from "next/navigation"
import { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { SearchModal } from "../_modals/SearchModal"

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const docs = useQuery(api.document.getDocs)
  const createDoc = useMutation(api.document.createDocument)
  const router = useRouter()

  const auth = useUser()
  const username = auth.user?.fullName
  const imgURL = auth.user?.imageUrl

  const trashCount =
    (docs && docs.filter((doc: Doc<"documents">) => doc.isArchived).length) ?? 0

  const handleClick = (type: string) => {
    if (type.toLowerCase() === "new page") {
      createDoc({ title: "Untitled" })
    } else if (type.toLowerCase() === "trash") {
      router.push("/dashboard/trash")
    } else if (type.toLowerCase() === "search") {
      setOpen(true)
    }
  }

  return (
    <aside
      className={cn(
        `h-full w-1/8 border-x border-border bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.06)_0px,rgba(0,0,0,0.06)_2px,transparent_2px,transparent_8px)] transition-transform duration-300 ease-in-out dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]`,
        isSidebarOpen ? "-translate-x-full" : "translate-x-0"
      )}
    >
      <div className="mr-8 h-full border-r bg-muted dark:bg-black">
        <h2 className="flex items-center justify-between p-5 text-sm font-medium">
          <UserButton />
          <div className="flex items-center gap-2">
            <p>{username}</p>
            <Button
              onClick={() => setIsSidebarOpen(true)}
              variant={"ghost"}
              size={"icon"}
              className="rounded-md p-1 hover:bg-zinc-200 hover:dark:bg-zinc-800"
            >
              <ChevronsLeft className="h-6 w-6 text-muted-foreground" />
            </Button>
          </div>
        </h2>

        <div className="py-3">
          {sidebarItems.map((item: SidebarItemsType) => (
            <div
              onClick={() => handleClick(item.label)}
              role="button"
              key={item.id}
              className={cn(
                `my-1 flex cursor-pointer items-center justify-between px-5 py-1 text-muted-foreground hover:bg-primary-foreground hover:text-primary hover:dark:bg-zinc-900 hover:dark:text-white`,
                item.label === "Trash" && "mt-3"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} />
                <p>{item.label}</p>
              </div>
              {item.label.toLowerCase() === "trash" && trashCount > 0 && (
                <Badge variant={"destructive"} className="h-5 w-5 rounded-full">
                  {trashCount}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Rendering the docs list */}
        <div className="py-3">
          <span className="px-5 text-xs font-bold">RECENTS</span>
          <div className="py-3">
            <DocsList docs={docs as Doc<"documents">[]} />
          </div>
        </div>

        {/* Search Command modal */}
        <SearchModal open={open} setOpen={setOpen} />
      </div>
    </aside>
  )
}

export default Sidebar
