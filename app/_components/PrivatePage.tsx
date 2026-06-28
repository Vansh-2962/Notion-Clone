import { UserKey } from "lucide-react"

const PrivatePage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="mt-16 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 border border-sidebar-border bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.06)_0px,rgba(0,0,0,0.06)_2px,transparent_2px,transparent_8px)] p-5 dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]">
          <UserKey className="h-12 w-12 text-muted-foreground" />
        </div>

        <h2 className="text-xl font-semibold tracking-tight">
          Access restricted
        </h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          This page is private and can only be viewed by its owner or people
          with permission. Contact the owner if you need access.
        </p>
      </div>
    </main>
  )
}

export default PrivatePage
