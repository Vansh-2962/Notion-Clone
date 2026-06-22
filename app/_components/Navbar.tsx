"use client"
import { Button } from "@/components/ui/button"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const router = useRouter()
  return (
    <header>
      <nav className="flex items-center justify-between px-5 py-3">
        <h1 className="text-xl font-bold tracking-tighter">Notion</h1>
        <Authenticated>
          <Button variant={"ghost"} onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <UserButton />
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button>Login</Button>
          </SignInButton>
        </Unauthenticated>
      </nav>
    </header>
  )
}

export default Navbar
