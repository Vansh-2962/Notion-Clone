"use client"
import Link from "next/link"
import GithubIcon from "../GithubIcon"
import TwitterIcon from "../TwitterIcon"
import LinkedInIcon from "../LinkedIn"
import MailIcon from "../MailIcon"
import Image from "next/image"
import lightLogo from "@/public/light.png"
import darkLogo from "@/public/dark.png"
import { useTheme } from "next-themes"

const Footer = () => {
  const { theme } = useTheme()
  return (
    <footer className="border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Logo */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src={theme === "dark" ? darkLogo : lightLogo}
                alt="Logo"
                className="h-5 w-5"
              />
              <h1 className="text-lg font-bold tracking-tighter">MindDock</h1>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-400">
              Organize your ideas, documents, notes and projects in one
              beautiful workspace. Built for individuals and teams.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="https://github.com/Vansh-2962/Notion-Clone.git"
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <GithubIcon />
              </Link>

              <Link
                href="#"
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <TwitterIcon />
              </Link>

              <Link
                href="#"
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <LinkedInIcon />
              </Link>

              <Link
                href="#"
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-black dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
              >
                <MailIcon />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
              Product
            </h3>

            <div className="space-y-3">
              <Link
                href="#features"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Features
              </Link>

              <Link
                href="#pricing"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Pricing
              </Link>

              <Link
                href="#faq"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                FAQs
              </Link>

              <Link
                href="/login"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
              Resources
            </h3>

            <div className="space-y-3">
              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Documentation
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Blog
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Changelog
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Roadmap
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-neutral-900 uppercase dark:text-white">
              Company
            </h3>

            <div className="space-y-3">
              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                About
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Contact
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                href="#"
                className="block text-sm text-neutral-600 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 text-sm text-neutral-500 md:flex-row dark:border-neutral-800 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} MindDock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
