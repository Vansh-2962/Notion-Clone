"use client"
import { useUser } from "@clerk/nextjs"
import { sidebarItems, SidebarItemsType } from "../lib/sidebarItems"
import Link from "next/link"

const Sidebar = () => {
  const auth = useUser()
  const username = auth.user?.fullName
  const imgURL = auth.user?.imageUrl
  return (
    <aside className="w-1/8 bg-muted text-muted-foreground">
      <h2 className="flex items-center justify-between p-5 text-sm font-medium">
        <div className="h-6 w-6">
          <img src={imgURL} />
        </div>
        {username}
      </h2>

      <div className="py-3">
        {sidebarItems.map((item: SidebarItemsType) => (
          <div
            key={item.id}
            className="my-1 flex cursor-pointer items-center gap-3 px-5 hover:bg-primary-foreground hover:text-primary"
          >
            <item.icon size={16} />
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
