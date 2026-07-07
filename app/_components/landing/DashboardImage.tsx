"use client"
import { useTheme } from "next-themes"
import Image from "next/image"
import dashboardImage from "@/public/dashboard.png"
import dashboardDarkImage from "@/public/dashboard-dark.png"

const DashboardImage = () => {
  const { theme } = useTheme()
  return (
    <div className="border-b px-2 pt-2">
      <div className="rounded-tl-xl rounded-tr-xl border-x border-t bg-linear-to-b from-zinc-50 to-zinc-200 pt-4 pr-4 pl-4 dark:bg-zinc-900 dark:from-zinc-900 dark:to-black">
        <Image
          src={theme === "dark" ? dashboardDarkImage : dashboardImage}
          alt="Dashboard"
          className="w-full rounded-tl-xl rounded-tr-xl"
        />
      </div>
    </div>
  )
}

export default DashboardImage
