import { DashboardNav } from "@/components/dashboard-nav"
import { MainNav } from "@/components/main-nav"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <MainNav />
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
