import { Geist_Mono, Inter } from "next/font/google"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "../_components/Navbar"
import ConvexClientProvider from "@/app/providers/ConvexClientProvider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ClerkProvider>
          <main>
            <ConvexClientProvider>
              {/* <Navbar /> */}
              <Toaster />
              <ThemeProvider>{children}</ThemeProvider>
            </ConvexClientProvider>
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
