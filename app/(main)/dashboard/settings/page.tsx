"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { FONTS } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "convex/react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface fontType {
  id: string
  className: string
  name: string
}

const page = () => {
  const { theme, setTheme } = useTheme()
  const [selectedFont, setSelectedFont] = useState("inter")

  const settings = useQuery(api.document.getSettings)
  const updateFont = useMutation(api.document.updateFont)

  useEffect(() => {
    if (!settings) return
    setSelectedFont(settings?.font)
  }, [settings])

  const handleFontSelect = async (font: string) => {
    if (!font) return
    await updateFont({
      font: font,
    })
  }

  return (
    <main className="mx-auto w-6xl">
      <div className="mt-20 flex items-center justify-between border-b">
        <h1 className="pb-5 text-5xl font-bold tracking-tight">Settings</h1>
      </div>

      {/* THEME */}
      <div className="mt-5 space-y-2">
        <h3 className="font-medium text-muted-foreground dark:text-white">
          Theme
        </h3>
        <div>
          <Button
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
          >
            <Sun /> Light
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
          >
            <Moon /> Dark
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <h3 className="font-medium text-muted-foreground dark:text-white">
          Font
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {FONTS.map((font: fontType) => (
            <div
              onClick={() => handleFontSelect(font.id)}
              role="button"
              key={font.id}
              className={cn(
                `border p-3 shadow`,
                selectedFont === font.id && "border-primary"
              )}
            >
              <span className="font-bold text-primary">{font.name}</span>
              <p className={cn(`text-lg`, font.className)}>Hello World!</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default page
