"use client"
import { UserButton, useUser } from "@clerk/nextjs"
import { sidebarItems, SidebarItemsType } from "../../lib/sidebarItems"
import { cn } from "@/lib/utils"
import { ChevronsLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import DocsList from "./DocsList"
import { useRouter } from "next/navigation"
import { Doc } from "@/convex/_generated/dataModel"
import { Badge } from "@/components/ui/badge"
import { SearchModal } from "../_modals/SearchModal"
import { Skeleton } from "@/components/ui/skeleton"
import { Kbd } from "@/components/ui/kbd"
import FavDocsList from "./FavDocsList"
import PrivateDocsList from "./PrivateDocsList"
import { useTheme } from "next-themes"

const Sidebar = () => {
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const docs = useQuery(api.document.getDocs)
  const createDoc = useMutation(api.document.createDocument)
  const router = useRouter()

  const auth = useUser()
  const username = auth.user?.fullName

  const trashCount =
    (docs && docs.filter((doc: Doc<"documents">) => doc.isArchived).length) ?? 0

  const handleClick = (type: string) => {
    if (type.toLowerCase() === "new page") {
      createDoc({ title: "Untitled" })
    } else if (type.toLowerCase() === "trash") {
      router.push("/dashboard/trash")
    } else if (type.toLowerCase() === "search") {
      setOpen(true)
    } else if (type.toLowerCase() === "settings") {
      router.push("/dashboard/settings")
    } else if (type.toLowerCase() === "draw") {
      router.push("/dashboard/draw")
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <aside
      className={cn(
        "overflow-hidden border-r transition-all duration-300 ease-in-out",
        "bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_2px,transparent_2px,transparent_8px)]",
        "dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]",
        isSidebarOpen ? "w-0" : "w-80"
      )}
    >
      <div className="h-full w-[calc(100%-2rem)] border-r bg-white dark:bg-black">
        <div className="flex items-center justify-between border-b px-2 py-3 text-sm font-medium">
          <div className="flex w-full items-center gap-2 rounded-full border px-1 py-1 shadow backdrop-blur-sm dark:bg-white/10">
            <UserButton />
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-xs">{username}</p>

              {/* <Button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                variant={"ghost"}
                size={"icon-sm"}
                className="rounded-md"
              >
                <ChevronsLeft className="h-6 w-6 text-muted-foreground" />
              </Button> */}
            </div>
          </div>
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            size={"icon-xs"}
            variant={"ghost"}
            className="ml-1 rounded-full"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>

        <div className="py-3">
          {sidebarItems.map((item: SidebarItemsType) => (
            <div
              onClick={() => handleClick(item.label)}
              role="button"
              key={item.id}
              className={cn(
                `my-1 flex cursor-pointer items-center justify-between px-5 py-1 text-sm text-muted-foreground hover:bg-primary-foreground hover:text-primary hover:dark:bg-zinc-900 hover:dark:text-white`,
                item.label === "Trash" && "mt-3 dark:hover:text-red-500"
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
              {item.label.toLowerCase() === "search" && <Kbd>⌘ K</Kbd>}
            </div>
          ))}
        </div>

        {/* Rendering the docs list */}
        <div className="py-3">
          {docs && docs.length > 0 && (
            <span className="px-5 text-xs font-bold">RECENTS</span>
          )}

          <div className="py-3">
            {docs === undefined ? (
              <div className="px-5 py-3">
                <div className="flex w-fit items-center gap-4">
                  <div className="grid gap-2">
                    <Skeleton className="h-4 w-39" />
                    <Skeleton className="ml-12 h-4 w-39" />
                  </div>
                </div>
              </div>
            ) : (
              <DocsList docs={docs as Doc<"documents">[]} />
            )}
          </div>
        </div>
        <FavDocsList docs={docs as Doc<"documents">[]} />
        <PrivateDocsList docs={docs as Doc<"documents">[]} />

        {/* Search Command modal */}
        <SearchModal open={open} setOpen={setOpen} />
      </div>
    </aside>
  )
}

export default Sidebar
