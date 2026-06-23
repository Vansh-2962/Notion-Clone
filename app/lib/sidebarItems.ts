import { LucideIcon, Plus, Search, Settings, Trash } from "lucide-react"

export type SidebarItemsType = {
  id: number
  label: string
  href?: string
  icon: LucideIcon
}

export const sidebarItems: SidebarItemsType[] = [
  {
    id: 1,
    label: "Search",
    icon: Search,
  },
  {
    id: 2,
    label: "Settings",
    icon: Settings,
  },
  {
    id: 3,
    label: "New Page",
    icon: Plus,
  },
  {
    id: 4,
    label: "Trash",
    icon: Trash,
  },
]
