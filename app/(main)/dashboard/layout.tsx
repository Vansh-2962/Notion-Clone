import Sidebar from "@/app/_components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </main>
  )
}
