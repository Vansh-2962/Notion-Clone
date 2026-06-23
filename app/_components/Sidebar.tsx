"use client"
import { useUser } from "@clerk/nextjs"
import { sidebarItems, SidebarItemsType } from "../lib/sidebarItems"
import { cn } from "@/lib/utils"
import { ChevronsLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import DocsList from "./DocsList"

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const createDoc = useMutation(api.document.createDocument)

  const auth = useUser()
  const username = auth.user?.fullName
  const imgURL = auth.user?.imageUrl

  const handleClick = (type: string) => {
    if (type.toLowerCase() === "new page") {
      createDoc({ title: "Untitled" })
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
          <div className="h-6 w-6">
            <img src={imgURL} />
          </div>
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
                `my-1 flex cursor-pointer items-center gap-3 px-5 py-1 text-muted-foreground hover:bg-primary-foreground hover:text-primary hover:dark:bg-zinc-900 hover:dark:text-white`,
                item.label === "Trash" && "mt-3"
              )}
            >
              <item.icon size={16} />
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="py-3">
          <span className="px-5 text-xs font-bold">RECENTS</span>
          <div className="py-3">
            <DocsList />
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
