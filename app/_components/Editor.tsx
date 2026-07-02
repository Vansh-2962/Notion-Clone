"use client"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core"
import { codeBlockOptions } from "@blocknote/code-block"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/mantine/style.css"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { FONT_CLASS_MAP, FONT_SIZE_MAP } from "@/lib/constant"

interface EditorProps {
  doc: Doc<"documents">
  isView?: boolean
}

export default function Editor({ doc, isView }: EditorProps) {
  const updateContent = useMutation(api.document.addContent)
  const settings = useQuery(api.document.getSettings)

  const { resolvedTheme } = useTheme()

  const fontClass =
    FONT_CLASS_MAP[(settings?.font as keyof typeof FONT_CLASS_MAP) ?? "inter"]

  const fontSize =
    FONT_SIZE_MAP[
      (settings?.fontSize as keyof typeof FONT_SIZE_MAP) ?? "medium"
    ]

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
    <div
      style={
        {
          "--editor-font-size": fontSize,
        } as React.CSSProperties
      }
      className={fontClass}
    >
      <BlockNoteView
        key={doc._id}
        editor={editor}
        editable={!isView}
        className="-ml-13"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  )
}
