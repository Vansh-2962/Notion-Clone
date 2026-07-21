"use client"

import dynamic from "next/dynamic"

import "@excalidraw/excalidraw/index.css"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useEffect, useRef } from "react"

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((m) => m.Excalidraw),
  { ssr: false }
)

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export default function ExcalidrawComponent() {
  const excalidrawAPI = useRef<any>(null)
  const initialized = useRef(false)

  const board = useQuery(api.document.getSnapshot)
  const saveSnapshot = useMutation(api.document.saveSnapshot)

  
  useEffect(() => {
    if (!board?.snapshot || !excalidrawAPI.current) return

    try {
      const scene = JSON.parse(board.snapshot)

      excalidrawAPI.current.updateScene({
        elements: scene.elements ?? [],
        files: scene.files ?? {},
      })

      initialized.current = true
    } catch (err) {
      console.error(err)
    }
  }, [board])

  const save = useRef(
    debounce(async (elements: readonly any[], files: any) => {
      await saveSnapshot({
        snapshot: JSON.stringify({
          elements,
          files,
        }),
      })
    }, 1000)
  ).current

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api) => {
          excalidrawAPI.current = api
        }}
        onChange={(elements, _appState, files) => {
          if (!initialized.current) return

          save(elements, files)
        }}
      />
    </div>
  )
}
