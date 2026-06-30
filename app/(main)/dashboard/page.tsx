"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"

export default function Page() {
  const createDoc = useMutation(api.document.createDocument)

  return (
    <main className="mx-auto flex h-screen w-6xl max-w-6xl items-start justify-center border-dashed pt-44">
      <div className="flex flex-col">
        <h1 className="bg-linear-to-b from-zinc-950 via-zinc-700 to-zinc-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl dark:from-white dark:via-emerald-200 dark:to-emerald-600">
          Turn thoughts into action.
        </h1>
        <p className="mt-2 ml-3 text-lg text-muted-foreground">
          A beautiful workspace for your notes, documents, projects, and
          everything in between.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => createDoc({ title: "Untitled" })}
            className="group mt-5 w-fit hover:translate-x-1 hover:-translate-y-1"
          >
            <Plus className="transition-all ease-in-out group-hover:rotate-180" />{" "}
            Create Page
          </Button>
        </div>
      </div>
    </main>
  )
}
