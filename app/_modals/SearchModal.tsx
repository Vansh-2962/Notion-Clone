"use client"

import {
  BellIcon,
  CalculatorIcon,
  CalendarIcon,
  ClipboardPasteIcon,
  CodeIcon,
  CopyIcon,
  CreditCardIcon,
  FileTextIcon,
  FileTypeCorner,
  FolderIcon,
  FolderPlusIcon,
  HelpCircleIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  LayoutGridIcon,
  ListIcon,
  PlusIcon,
  ScissorsIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { timeAgo } from "../../lib/helper"
import Link from "next/link"

interface SearchModalProps {
  open: boolean
  setOpen: (val: boolean) => void
}

export function SearchModal({ open, setOpen }: SearchModalProps) {
  const docs = useQuery(api.document.getDocs)

  const unarchivedDocs = docs?.length
    ? docs.filter((doc: Doc<"documents">) => !doc.isArchived)
    : []

  const handleRemoveModal = () => {
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandGroup heading="PAGES">
              {unarchivedDocs.map((doc: Doc<"documents">) => (
                <Link
                  key={doc._id}
                  href={`/dashboard/doc/${doc._id}`}
                  onClick={handleRemoveModal}
                >
                  <CommandItem className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary">
                    <FileTypeCorner />
                    <span>{doc.title}</span>
                    <CommandShortcut>
                      <span className="text-muted-foreground">
                        {timeAgo(new Date(doc._creationTime))}
                      </span>
                    </CommandShortcut>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandEmpty>No results found.</CommandEmpty>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
