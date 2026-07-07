"use client"
import { Button } from "@/components/ui/button"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import GithubIcon from "./GithubIcon"
import lightLogo from "@/public/light.png"
import darkLogo from "@/public/dark.png"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const Navbar = () => {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <header>
      <nav className="border-b px-5 py-3">
        <div className="mx-auto flex w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={theme === "dark" ? darkLogo : lightLogo}
              alt="Logo"
              className="h-5 w-5"
            />
            <h1 className="text-lg font-bold tracking-tighter">MindDock</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              size={"icon-sm"}
              variant={"ghost"}
              className="text-zinc-500 dark:text-white/70"
            >
              {theme == "dark" ? <Sun /> : <Moon />}
            </Button>

            <Button
              size={"icon-sm"}
              onClick={() =>
                window.open(
                  `https://github.com/Vansh-2962/Notion-Clone.git`,
                  "_blank"
                )
              }
              variant={"ghost"}
            >
              <GithubIcon />
            </Button>
            <Authenticated>
              <Button
                variant={"outline"}
                onClick={() => router.push("/dashboard")}
                size={"xs"}
                className="text-zinc-600 shadow-sm hover:bg-zinc-100 dark:text-zinc-200"
              >
                Dashboard
              </Button>
            </Authenticated>

            <Unauthenticated>
              <SignInButton>
                <Button>Login</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
