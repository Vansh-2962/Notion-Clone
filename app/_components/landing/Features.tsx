"use client"
import { FEATURES } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

const Features = () => {
  return (
    <div className="grid grid-cols-2 border-b md:grid-cols-3 xl:grid-cols-5">
      {FEATURES.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            "flex flex-col border-r border-border px-4 py-8 transition-all ease-in-out hover:bg-zinc-50 dark:hover:bg-zinc-900",
            index === FEATURES.length - 1 && "border-r-0"
          )}
        >
          <motion.h3
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}

            className="text-sm font-semibold"
          >
            {feature.title}
          </motion.h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Features
