import { Skeleton } from "@/components/ui/skeleton"

const DocSkeleton = () => {
  return (
    <main className="h-screen w-full">
      <Skeleton className="h-64 w-full" />
      <section className="mx-auto my-5 max-w-6xl">
        <div className="my-2 flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-20 w-20" />

        <Skeleton className="mt-8 h-20 w-48" />

        <Skeleton className="mt-8 h-40 w-full" />
      </section>
    </main>
  )
}

export default DocSkeleton
