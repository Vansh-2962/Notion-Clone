import Sidebar from "@/app/_components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex h-screen">
      <Sidebar />
      {children}
    </main>
  )
}
