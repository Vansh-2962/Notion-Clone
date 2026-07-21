import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import ViewsChart from "./ViewsChart"

interface SheetProps {
  id: string
  open: boolean
  setOpen: (val: boolean) => void
}

const AnalyticsSheet = ({ id, open, setOpen }: SheetProps) => {
  const analytics = useQuery(api.document.getAnalytics, {
    documentId: id as Id<"documents">,
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full overflow-y-auto px-2 sm:max-w-xl">
        <SheetHeader className="border-b pb-5">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl font-bold">Analytics</SheetTitle>

              <SheetDescription className="mt-1">
                Insights for this published document.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-8 py-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border bg-card p-5">
              <p className="text-sm text-muted-foreground">Views</p>
              <h2 className="mt-2 text-3xl font-bold">
                {analytics?.totalViews ?? 0}
              </h2>
            </div>

            <div className="border bg-card p-5">
              <p className="text-sm text-muted-foreground">Visitors</p>
              <h2 className="mt-2 text-3xl font-bold">
                {analytics?.uniqueVisitors ?? 0}
              </h2>
            </div>

            <div className="border bg-card p-5">
              <p className="text-sm text-muted-foreground">Top Browser</p>
              <h2 className="mt-2 text-xl font-bold">
                {analytics?.browsers?.[0]?.name ?? "-"}
              </h2>
            </div>

            <div className="border bg-card p-5">
              <p className="text-sm text-muted-foreground">Countries</p>
              <h2 className="mt-2 text-3xl font-bold">
                {analytics?.countries?.length ?? 0}
              </h2>
            </div>
          </div>

          <ViewsChart data={analytics?.views} />

          <div className="border p-5">
            <div className="mb-4">
              <h3 className="font-semibold">Views (Last 30 Days)</h3>
              <p className="text-sm text-muted-foreground">Daily page views.</p>
            </div>

            <div className="space-y-2">
              {analytics?.views?.map((view) => (
                <div
                  key={view.date}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{view.date}</span>
                  <span>{view.views}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border p-5">
              <h3 className="mb-4 font-semibold">Top Countries</h3>

              <div className="space-y-3 text-sm">
                {analytics?.countries?.length ? (
                  analytics.countries.map((country) => (
                    <div key={country.name} className="flex justify-between">
                      <span>{country.name}</span>
                      <span>{country.views}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No data</p>
                )}
              </div>
            </div>

            <div className="border p-5">
              <h3 className="mb-4 font-semibold">Devices</h3>

              <div className="space-y-3 text-sm">
                {analytics?.devices?.length ? (
                  analytics.devices.map((device) => (
                    <div key={device.name} className="flex justify-between">
                      <span>{device.name}</span>
                      <span>{device.views}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No data</p>
                )}
              </div>
            </div>

            <div className="border p-5">
              <h3 className="mb-4 font-semibold">Browsers</h3>

              <div className="space-y-3 text-sm">
                {analytics?.browsers?.length ? (
                  analytics.browsers.map((browser) => (
                    <div key={browser.name} className="flex justify-between">
                      <span>{browser.name}</span>
                      <span>{browser.views}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No data</p>
                )}
              </div>
            </div>
          </div>

          {/* Referrers */}
          <div className="border p-5">
            <h3 className="mb-4 font-semibold">Traffic Sources</h3>

            <div className="space-y-3 text-sm">
              {analytics?.referrers?.length ? (
                analytics.referrers.map((referrer) => (
                  <div key={referrer.name} className="flex justify-between">
                    <span>{referrer.name}</span>
                    <span>{referrer.views}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default AnalyticsSheet
