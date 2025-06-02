"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, LayoutDashboard, ListFilter, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Campaign",
    href: "/dashboard/campaigns/new",
    icon: PlusCircle,
  },
  {
    title: "Campaign History",
    href: "/dashboard/campaigns",
    icon: BarChart,
  },
  {
    title: "Rule Builder",
    href: "/dashboard/rule-builder",
    icon: ListFilter,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 p-4">
        <div className="flex-1">
          <div className="py-2">
            <h2 className="px-2 text-lg font-semibold tracking-tight">Campaign Manager</h2>
          </div>
          <div className="mt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
