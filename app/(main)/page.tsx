"use client"
import { Button } from "@/components/ui/button"
import Navbar from "../_components/Navbar"
import { ArrowRight } from "lucide-react"
import { FEATURES } from "@/lib/constant"
import { cn } from "@/lib/utils"
import Image from "next/image"
import dashboardImage from "@/public/dashboard.png"
import dashboardDarkImage from "@/public/dashboard-dark.png"
import { useTheme } from "next-themes"

export default function Page() {
  const { theme } = useTheme()
  return (
    <div className="h-screen w-full">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto h-full w-6xl border-r border-l">
        <div className="relative overflow-hidden border-b px-8 py-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]" />

          <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background" />

          {/* Content */}
          <div className="relative z-10">
            <h2 className="bg-linear-to-b from-black via-zinc-800 to-zinc-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-400 dark:to-zinc-700">
              Build Your Second Brain
            </h2>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
              Capture ideas, organize knowledge, collaborate with your team, and
              turn thoughts into action—all from one beautifully designed
              workspace.
            </p>
            <Button
              className="group mt-10 bg-white shadow hover:bg-primary hover:text-white"
              variant={"outline"}
              size={"sm"}
            >
              Start Building{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        {/* features */}
        <div className="grid grid-cols-2 border-b md:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "flex flex-col border-r border-border px-4 py-8 transition-all ease-in-out hover:bg-zinc-50 dark:hover:bg-zinc-900",
                index === FEATURES.length - 1 && "border-r-0"
              )}
            >
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Dashboard image */}
        <div className="px-2 pt-2 border-b">
          <div className="rounded-tl-xl rounded-tr-xl border-t border-x bg-zinc-100 pt-4 pr-4 pl-4 dark:bg-zinc-900">
            <Image
              src={theme === "dark" ? dashboardDarkImage : dashboardImage}
              alt="Dashboard"
              className="w-full rounded-tl-xl rounded-tr-xl"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
