import {
  Geist_Mono,
  Inter,
  Geist,
  Lora,
  Nunito,
  Playfair_Display,
  Caveat,
  JetBrains_Mono,
} from "next/font/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import localFont from "next/font/local"

import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "../_components/Navbar"
import ConvexClientProvider from "@/app/providers/ConvexClientProvider"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const virgil = localFont({
  src: "../fonts/Virgil.woff2",
  variable: "--font-virgil",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
})

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
        "font-sans",

        inter.variable,
        fontMono.variable,
        virgil.variable,
        geist.variable,
        lora.variable,
        nunito.variable,
        caveat.variable,
        playfair.variable,
        jetbrains.variable
      )}
    >
      <body>
        <ClerkProvider>
          <main>
            <ConvexClientProvider>
              {/* <Navbar /> */}
              <Toaster />
              <ThemeProvider>
                <TooltipProvider>
                  <NextSSRPlugin
                    /**
                     * The `extractRouterConfig` will extract **only** the route configs
                     * from the router to prevent additional information from being
                     * leaked to the client. The data passed to the client is the same
                     * as if you were to fetch `/api/uploadthing` directly.
                     */
                    routerConfig={extractRouterConfig(ourFileRouter)}
                  />
                  {children}
                </TooltipProvider>
              </ThemeProvider>
            </ConvexClientProvider>
          </main>
        </ClerkProvider>
      </body>
    </html>
  )
}
