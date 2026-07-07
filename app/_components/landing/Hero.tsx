"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

const Hero = () => {
  return (
    <div className="relative overflow-hidden border-b px-8 py-20">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.03)_0px,rgba(0,0,0,0.03)_2px,transparent_2px,transparent_8px)] dark:bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_8px)]" />

      <div className="absolute inset-0 bg-radial from-transparent via-background/40 to-background" />

      {/* Content */}
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-linear-to-b from-black via-zinc-800 to-zinc-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-400 dark:to-zinc-700"
        >
          Build Your Second Brain
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-sm text-zinc-600 dark:text-zinc-300"
        >
          Capture ideas, organize knowledge, collaborate with your team, and
          turn thoughts into action—all from one beautifully designed workspace.
        </motion.p>
        <Button
          className="group mt-10 bg-white shadow hover:bg-primary hover:text-white"
          variant={"outline"}
          size={"sm"}
        >
          Start Building{" "}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  )
}

export default Hero
