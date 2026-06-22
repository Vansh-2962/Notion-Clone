import Sidebar from "@/app/_components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-screen w-full flex">
      <Sidebar />
      {children}
    </main>
  )
}
