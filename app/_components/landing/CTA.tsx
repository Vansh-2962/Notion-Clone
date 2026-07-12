"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

const CTA = () => {
  return (
    <section className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.2, duration: 0.5 },
          }}

          className="mb-3 text-xs tracking-[0.35em] text-zinc-500 uppercase"
        >
          Start Today
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { delay: 0.2, duration: 0.5 },
          }}
          className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Organize your ideas, documents, and projects in one workspace.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.4, duration: 0.7 },
          }}
          className="mt-6 max-w-2xl text-base leading-8 text-zinc-500"
        >
          Write beautifully, collaborate effortlessly, and turn scattered notes
          into structured knowledge. Everything you need, all in one place.
        </motion.p>

        <motion.div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/80 dark:bg-primary dark:text-white dark:hover:bg-primary/80"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="#features"
            className="inline-flex items-center justify-center border px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Explore Features
          </Link>
        </motion.div>

        <p className="mt-8 text-sm text-zinc-500">
          No credit card required • Free forever plan
        </p>
      </div>
    </section>
  )
}

export default CTA
