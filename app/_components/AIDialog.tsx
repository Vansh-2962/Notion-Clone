import { Button } from "@/components/ui/button"
import { AlertTriangle, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import axios from "axios"

const AIDialog = ({
  setAIResponse,
}: {
  setAIResponse: (val: string) => void
}) => {
  const [prompt, setPrompt] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const [open, setOpen] = useState<boolean>(false)

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt) {
      toast.error("Please provide your prompt")
      return
    }
    try {
      setLoading(true)
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullText += chunk
        setAIResponse(fullText)
      }
      setOpen(false)
    } catch (error) {
      setError(true)
    } finally {
      setLoading(false)
      setPrompt("")
    }
  }

  return (
    <main>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant={"outline"} onClick={() => setOpen(true)}>
          <Sparkles /> Write with AI
        </Button>

        <DialogContent className="sm:max-w-75 md:max-w-100 lg:max-w-125">
          <DialogHeader>
            <DialogTitle>Write with AI</DialogTitle>
            <DialogDescription>
              Enhance your writing with the power of AI. Get suggestions,
              improve clarity, and generate content effortlessly.
            </DialogDescription>
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-red-600 dark:text-red-400">
                      Generation Failed
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      We couldn't generate your document right now. This could
                      be caused by a temporary AI service issue, an invalid API
                      key, or a network problem.
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <Button variant="ghost" onClick={() => setError(false)}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleGenerate} className="mt-4 w-full space-y-2">
              <Textarea
                placeholder="What would you like to write about?"

                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Generating content..." : "Generate"}
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default AIDialog
