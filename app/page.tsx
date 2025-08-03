"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, ExternalLink } from "lucide-react"
import { motion, useScroll, useInView } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PortfolioData {
  personal: {
    name: string
    title: string
    bio: string
    location: string
    email: string
    github: string
    linkedin: string
    website: string
    avatar: string
  }
  hero: {
    greeting: string
    headline: string
    description: string
    cta: string
  }
  about: {
    title: string
    description: string
    highlights: string[]
  }
  skills: {
    title: string
    categories: Array<{
      name: string
      skills: string[]
    }>
  }
  projects: Array<{
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    github: string
    demo: string
    featured: boolean
  }>
  contact: {
    title: string
    description: string
    cta: string
  }
}

// Grid background component
const GridBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
    </div>
  )
}

// Animated counter component
const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const end = value
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref} className="font-bold text-2xl">
      {count}
      {suffix}
    </span>
  )
}

// Bento box component
const BentoBox = ({
  children,
  className = "",
  span = "col-span-1",
}: {
  children: React.ReactNode
  className?: string
  span?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`${span} p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Project card with minimal design
const MinimalProjectCard = ({ project, index }: { project: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl">
        <div className="relative overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0 backdrop-blur-md bg-white/90"
              asChild
            >
              <Link href={project.github} target="_blank">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0 backdrop-blur-md bg-white/90"
              asChild
            >
              <Link href={project.demo} target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 rounded-full px-3 py-1 text-xs font-medium"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Portfolio() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const { scrollYProgress } = useScroll()
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    import("@/data/portfolio.json").then((module) => {
      setData(module.default as PortfolioData)
    })
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "projects", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-600 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    )
  }

  const featuredProjects = data.projects.filter((project) => project.featured)
  const otherProjects = data.projects.filter((project) => !project.featured)

  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />

      {/* Minimal Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {data.personal.name}
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: "Home", id: "home" },
                { name: "About", id: "about" },
                { name: "Work", id: "projects" },
                { name: "Contact", id: "contact" },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`text-sm font-medium transition-colors relative ${activeSection === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href={data.personal.github} target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={data.personal.linkedin} target="_blank">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Minimal and Clean */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6"
              >
                Available for work
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight"
              >
                {data.hero.greeting.split(" ")[0]}{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  {data.hero.greeting.split(" ").slice(1).join(" ")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg"
              >
                {data.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                  <Link href="#projects">
                    View My Work
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-slate-300 dark:border-slate-600 bg-transparent"
                  asChild
                >
                  <Link href={`mailto:${data.personal.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Get in touch
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl -rotate-6 opacity-20" />
                <Image
                  src={data.personal.avatar || "/placeholder.svg"}
                  alt={data.personal.name}
                  width={320}
                  height={320}
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Bento Grid Layout */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">About Me</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{data.about.description}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats */}
            <BentoBox span="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="text-center">
                <AnimatedCounter value={10} suffix="+" />
                <p className="text-slate-600 dark:text-slate-400 mt-2">Projects Completed</p>
              </div>
            </BentoBox>


            {/* Skills */}
            <BentoBox span="col-span-1 md:col-span-2 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Technologies I Love</h3>
              <div className="grid grid-cols-2 gap-4">
                {data.skills.categories.map((category) => (
                  <div key={category.name}>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{category.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </BentoBox>

            {/* Location */}
            <BentoBox span="col-span-1 md:col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Based in</p>
                  <p className="text-slate-600 dark:text-slate-400">{data.personal.location}</p>
                </div>
              </div>
            </BentoBox>

            {/* Highlights */}
            <BentoBox span="col-span-1 md:col-span-2 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">What I Bring</h3>
              <div className="space-y-3">
                {data.about.highlights.slice(0, 3).map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{highlight}</p>
                  </div>
                ))}
              </div>
            </BentoBox>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Selected Work</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">A collection of projects I'm proud of</p>
          </motion.div>

          {/* Featured Projects */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredProjects.map((project, index) => (
              <MinimalProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <>
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center"
              >
                More Projects
              </motion.h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherProjects.map((project, index) => (
                  <MinimalProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">Let's Work Together</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
              {data.contact.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8" asChild>
                <Link href={`mailto:${data.personal.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  Send me an email
                </Link>
              </Button>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="lg" className="rounded-full bg-transparent" asChild>
                  <Link href={data.personal.github} target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full bg-transparent" asChild>
                  <Link href={data.personal.linkedin} target="_blank">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2024 {data.personal.name}. Crafted with care.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link
                href={data.personal.email}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm transition-colors"
              >
                {data.personal.email}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
