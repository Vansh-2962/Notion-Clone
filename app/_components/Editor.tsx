"use client"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core"
import { codeBlockOptions } from "@blocknote/code-block"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useEffect } from "react"
import { useTheme } from "next-themes"

interface EditorProps {
  doc: Doc<"documents">
  isView?: boolean
}

export default function Editor({ doc, isView }: EditorProps) {
  const updateContent = useMutation(api.document.addContent)
  const { resolvedTheme } = useTheme()

  const editor = useCreateBlockNote({
    initialContent: doc?.content ? JSON.parse(doc.content) : undefined,
    schema: BlockNoteSchema.create().extend({
      blockSpecs: {
        codeBlock: createCodeBlockSpec(codeBlockOptions),
      },
    }),
  })

  useEffect(() => {
    if (!doc) return

    return editor.onChange(() => {
      updateContent({
        _id: doc._id,
        content: JSON.stringify(editor.document),
      })
    })
  }, [editor, doc, updateContent])

  if (!doc) {
    return <>Loading...</>
  }

  return (
    <BlockNoteView
      key={doc._id}
      editor={editor}
      editable={!isView}
      className="-ml-13"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}
