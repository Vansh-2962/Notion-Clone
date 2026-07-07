import Navbar from "../_components/Navbar"
import DashboardImage from "../_components/landing/DashboardImage"
import Features from "../_components/landing/Features"
import Hero from "../_components/landing/Hero"
import { Testimonials } from "../_components/landing/Testimonials"
import TrustedBy from "../_components/landing/TrustedBy"

export default function Page() {
  return (
    <div className="h-full w-full">
      <Navbar />
      <section className="mx-auto h-full w-6xl border-r border-l">
        {/* Hero */}
        <Hero />
        {/* features */}
        <Features />

        {/* Dashboard image */}
        <DashboardImage />

        {/* Trusted by */}
        <TrustedBy />

        {/* Testimonials */}
        <Testimonials />
      </section>
    </div>
  )
}
