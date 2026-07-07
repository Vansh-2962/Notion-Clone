"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "motion/react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Engineer",
    company: "Vercel",
    quote:
      "MindDock has completely replaced my scattered notes. Everything feels organized and incredibly fast.",
  },
  {
    name: "Sarah Chen",
    role: "Product Designer",
    company: "Figma",
    quote:
      "The editor feels polished, and the whiteboard integration is something I use every single day.",
  },
  {
    name: "Michael Brown",
    role: "Founder",
    company: "Indie Hacker",
    quote:
      "Simple, clean, and distraction-free. Exactly what I was looking for in a workspace.",
  },
  {
    name: "Emily Davis",
    role: "Software Engineer",
    company: "GitHub",
    quote:
      "Nested pages, fast search, and beautiful writing experience. It just gets out of the way.",
  },
  {
    name: "David Wilson",
    role: "Tech Lead",
    company: "Google",
    quote:
      "The interface is minimal, yet surprisingly powerful. My team adopted it within a day.",
  },
]

export function Testimonials() {
  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  )

  return (
    <section className="border-b">
      <div className="border-b px-6 py-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}

          className="mb-3 text-xs tracking-[0.35em] text-zinc-500 uppercase"
        >
          Testimonials
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { delay: 0.2, duration: 0.5 },
          }}
          className="text-3xl font-semibold tracking-tight"
        >
          Loved by developers and teams.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.4, duration: 0.7 },
          }}

          className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500"
        >
          Thousands of ideas, notes, and projects organized inside one
          distraction-free workspace.
        </motion.p>
      </div>

      <div className="relative px-10 py-12">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index: number) => (
              <CarouselItem
                key={testimonial.name}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  whileInView={{
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: { delay: 0.2 + index * 0.1, duration: 0.8 },
                  }}

                  className="h-full border bg-background p-8 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <p className="text-sm leading-7 text-zinc-500 dark:text-zinc-200">
                    "{testimonial.quote}"
                  </p>

                  <div className="mt-8 border-t pt-5">
                    <h4 className="font-medium">{testimonial.name}</h4>

                    <p className="mt-1 text-sm text-zinc-500">
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </section>
  )
}
