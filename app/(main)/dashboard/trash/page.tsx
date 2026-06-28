"use client"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Trash, Trash2, Undo2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const Page = () => {
  const [deletingTitle, setDeletingTitle] = useState("")

  const restoreDoc = useMutation(api.document.restoreDoc)
  const clearTrash = useMutation(api.document.clearTrash)
  const deleteDoc = useMutation(api.document.deleteDoc)

  const docs = useQuery(api.document.getDocs)
  const trashedDocs =
    (docs?.length && docs.filter((doc: Doc<"documents">) => doc.isArchived)) ||
    []

  const onRestore = (_id: Id<"documents">) => {
    if (!_id) return
    restoreDoc({ _id })
  }

  const deleteSingleDoc = (_id: Id<"documents">, title: string) => {
    if (!_id) return
    if (title.trim().toLowerCase() !== deletingTitle.trim().toLowerCase()) {
      toast.error("Confirmation failed. Please enter the exact page title.")
      return
    }
    deleteDoc({ _id })
  }

  const onClear = () => {
    const promise = clearTrash()
    toast.promise(promise, {
      loading: "Clearing trash...",
      success: "Trash cleared",
      error: "Failed to clear the trash.",
    })
  }

  return (
    <main className="mx-auto w-6xl">
      <div className="mt-20 flex items-center justify-between border-b">
        <h1 className="pb-5 text-5xl font-bold tracking-tight">Trash</h1>
        {trashedDocs.length > 0 && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Trash /> Clear Trash
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your documents.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onClear} variant={"destructive"}>
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {trashedDocs.length > 0 ? (
        <div className="mt-10">
          <Table>
            <TableCaption>
              {trashedDocs?.length ?? 0} archived documents.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trashedDocs.map((doc: Doc<"documents">, idx: number) => (
                <TableRow key={doc._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>
                    {new Date(doc._creationTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      onClick={() => onRestore(doc._id)}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <Undo2 />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size={"icon"} variant={"destructive"}>
                          <Trash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            This action cannot be undone. Enter{" "}
                            <span className="font-semibold text-foreground">
                              {doc.title}
                            </span>{" "}
                            to permanently delete this page and all of its
                            nested pages.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col">
                          <Input
                            value={deletingTitle}
                            onChange={(e) => setDeletingTitle(e.target.value)}
                            className="mb-3 w-full"
                            autoFocus
                          />
                          <AlertDialogFooter>
                            <div className="flex items-center gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                disabled={!deletingTitle}
                                onClick={() =>
                                  deleteSingleDoc(doc._id, doc.title)
                                }
                                variant={"destructive"}
                              >
                                Yes, Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogFooter>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 border border-sidebar-border bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.06)_0px,rgba(0,0,0,0.06)_2px,transparent_2px,transparent_8px)] p-5 dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]">
            <Trash2 className="h-12 w-12 text-muted-foreground" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight">
            Your trash is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Deleted documents will appear here. Restore them anytime before
            they're permanently removed.
          </p>
        </div>
      )}
    </main>
  )
}

export default Page
