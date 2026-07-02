import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef, useState } from "react"
import { Editor, Tldraw } from "tldraw"
import "tldraw/tldraw.css"

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

const TldrawComponent = () => {
  const [editor, setEditor] = useState<Editor | null>(null)

  const saveSnapshot = useMutation(api.document.saveSnapshot)
  const board = useQuery(api.document.getSnapshot)

  useEffect(() => {
    if (!editor || !board?.snapshot) return

    editor.loadSnapshot(JSON.parse(board.snapshot))
  }, [editor, board])

  useEffect(() => {
    if (!editor) return

    const save = debounce(async () => {
      await saveSnapshot({
        snapshot: JSON.stringify(editor.getSnapshot()),
      })
    }, 1000)

    const cleanup = editor.store.listen(() => {
      save()
    })

    return cleanup
  }, [editor])

  return (
    <div className="h-full w-full">
      <Tldraw
        onMount={(editor) => {
          setEditor(editor)
        }}
      />
    </div>
  )
}

export default TldrawComponent
