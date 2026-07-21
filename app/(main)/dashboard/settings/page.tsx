"use client"
import { useSidebarStore } from "@/app/_store/useSidebarStore"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { FONT_SIZE_MAP, FONT_SIZES, FONTS } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface fontType {
  id: string
  className: string
  name: string
}

interface fontSizeType {
  id: string
  name: string
  value: string
}

export const FONT_SIZE_MAP_PREVIEW = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  xl: "text-xl",
} as const

const page = () => {
  const { theme, setTheme } = useTheme()
  const { toggle } = useSidebarStore()

  const settings = useQuery(api.document.getSettings)
  const updateFont = useMutation(api.document.updateFont)
  const updateFontSize = useMutation(api.document.updateFontSize)

  const handleFontSelect = async (font: string) => {
    if (!font) return
    await updateFont({
      font: font,
    })
  }

  const handleFontSizeSelect = async (fontSize: string) => {
    if (!fontSize) return
    await updateFontSize({
      fontSize: fontSize,
    })
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-end gap-3 px-1 py-4 sm:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="mt-20 flex items-center justify-between border-b">
        <h1 className="pb-5 text-5xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* THEME */}
      <div className="mt-5 space-y-3">
        <h3 className="font-medium text-muted-foreground dark:text-white">
          Theme
        </h3>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="w-full sm:w-auto"
          >
            <Sun className="mr-2 h-4 w-4" />
            Light
          </Button>

          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="w-full sm:w-auto"
          >
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </Button>
        </div>
      </div>

      {/* FONTS */}
      <div className="mt-8 space-y-2">
        <h3 className="font-medium text-muted-foreground dark:text-white">
          Font
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FONTS.map((font: fontType) => (
            <div
              key={font.id}
              role="button"
              onClick={() => handleFontSelect(font.id)}
              className={cn(
                "cursor-pointer border p-4 shadow-sm transition-colors hover:border-primary",
                settings?.font === font.id && "border-primary"
              )}
            >
              <span className="font-bold text-primary">{font.name}</span>
              <p className={cn("mt-2 text-lg", font.className)}>Hello World!</p>
            </div>
          ))}
        </div>
      </div>

      {/* FONT SIZE */}
      <div className="my-8 space-y-2">
        <h3 className="font-medium text-muted-foreground dark:text-white">
          Font Size
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FONT_SIZES.map((font: fontSizeType) => (
            <div
              key={font.id}
              role="button"
              onClick={() => handleFontSizeSelect(font.id)}
              className={cn(
                "cursor-pointer border p-4 shadow-sm transition-colors hover:border-primary",
                settings?.fontSize?.toLowerCase() === font.id.toLowerCase() &&
                  "border-primary"
              )}
            >
              <span className="font-bold text-primary">{font.name}</span>

              <p
                className={cn(
                  "mt-2",
                  FONT_SIZE_MAP_PREVIEW[
                    font.id as keyof typeof FONT_SIZE_MAP_PREVIEW
                  ]
                )}
              >
                Hello World!
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default page
