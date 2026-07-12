import {
  Globe,
  PenSquare,
  Users,
  FolderTree,
  BrainCircuit,
  Paintbrush,
} from "lucide-react"

const features = [
  {
    title: "Rich Text Editor",
    description:
      "Write beautifully with markdown support, slash commands, and distraction-free editing.",
    icon: PenSquare,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Real-time Collaboration",
    description:
      "Edit documents together with live cursors and instant updates.",
    icon: Users,
    className: "",
  },
  {
    title: "Nested Pages",
    description:
      "Keep everything organized using unlimited folders and subpages.",
    icon: FolderTree,
    className: "",
  },
  {
    title: "Whiteboard",
    description: "Sketch ideas and diagrams alongside your notes.",
    icon: Paintbrush,
    className: "",
  },
  {
    title: "AI Assistant",
    description: "Generate content, summarize notes, and brainstorm ideas.",
    icon: BrainCircuit,
    className: "",
  },
  {
    title: "Publish to Web",
    description: "Share documents instantly with a public link.",
    icon: Globe,
    className: "md:col-span-2",
  },
]

const BentoGrid = () => {
  return (
    <section className="border-t">
      <div className="border-b px-6 py-16 text-center">
        <p className="mb-3 text-xs tracking-[0.35em] text-zinc-500 uppercase">
          Features
        </p>

        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need in one workspace.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
          Powerful tools designed for writing, collaboration, organization, and
          creativity.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px border-x bg-border md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <div
              key={feature.title}
              className={`group bg-background p-8 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${feature.className}`}
            >
              <div className="flex h-12 w-12 items-center justify-center border">
                <Icon className="h-5 w-5 text-zinc-500" />
              </div>

              <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>

              <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-500">
                {feature.description}
              </p>

              {/* Screenshot Placeholder */}
              <div className="mt-8 flex h-44 items-center justify-center border bg-zinc-50 text-sm text-zinc-400 dark:bg-zinc-950">
                Screenshot
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BentoGrid
