import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { UAParser } from "ua-parser-js"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  try {
    const { documentId, visitorId } = await req.json()

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      ""

    const userAgent = req.headers.get("user-agent") || ""
    const referrer = req.headers.get("referer") || ""

    const parser = new UAParser(userAgent)

    const browser = parser.getBrowser().name || "Unknown"
    const os = parser.getOS().name || "Unknown"
    const device = parser.getDevice().type || "Desktop"

    let country = ""
    let city = ""

    if (ip) {
      const res = await fetch(`https://ipapi.co/${ip}/json/`)
      if (res.ok) {
        const data = await res.json()
        country = data.country_name
        city = data.city
      }
    }

    await convex.mutation(api.document.updateAnalytics, {
      documentId,
      visitorId,
      country,
      city,
      referrer,
      browser,
      os,
      device,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
