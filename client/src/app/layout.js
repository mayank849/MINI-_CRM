import React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/ui/theme-provider"
import "./globals.css"
import {Providers} from "./providers"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ClientNest - Campaign Manager",
  description: "Create and manage marketing campaigns for your customers",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Providers>
          {children}
          </Providers>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
