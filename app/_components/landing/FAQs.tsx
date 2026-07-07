"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "motion/react"

const faqs = [
  {
    question: "What is MindDock?",
    answer:
      "MindDock is an all-in-one workspace for writing, organizing knowledge, sketching ideas, and collaborating with your team.",
  },
  {
    question: "Is MindDock free to use?",
    answer:
      "Yes. You can get started for free, with premium features available for power users and teams.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Absolutely. Share documents, collaborate in real time, and keep everyone aligned in one workspace.",
  },
  {
    question: "Can I upload images and files?",
    answer:
      "Yes. MindDock supports media uploads, allowing you to embed images and files directly inside your documents.",
  },
  {
    question: "Does MindDock support nested pages?",
    answer:
      "Yes. Organize your workspace with unlimited nested pages to keep everything structured and easy to find.",
  },
  {
    question: "Can I publish my documents?",
    answer:
      "Yes. Publish documents to the web and share them with anyone using a public link.",
  },
]

const FAQs = () => {
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
          Frequently Asked Questions
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
          Everything you need to know.
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
          Still have questions? We've answered the ones we hear most often.
        </motion.p>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              whileInView={{
                opacity: 1,
                filter: "blur(0px)",
                transition: { delay: 0.2 + index * 0.1, duration: 0.8 },
              }}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent className="text-sm leading-7 text-zinc-500">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQs
