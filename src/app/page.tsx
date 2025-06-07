"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, SignUpButton, SignInButton, useAuth } from "@clerk/nextjs";
import {
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRegFileAlt, FaRobot, FaPalette, FaDownload } from "react-icons/fa";
import {
  MdDashboardCustomize,
  MdOutlineDesignServices,
  MdOutlineTranslate,
  MdShare,
} from "react-icons/md";
import { TbStars } from "react-icons/tb";
import { FiClock } from "react-icons/fi";
import { RiShieldCheckLine } from "react-icons/ri";
export default function Home() {
  const { userId } = useAuth();
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const templates = [
    { name: "Minimal", color: "bg-blue-500" },
    { name: "Professional", color: "bg-emerald-500" },
    { name: "Creative", color: "bg-purple-500" },
    { name: "Modern", color: "bg-rose-500" },
  ];

  const features = [
    {
      icon: <FiClock className="w-5 h-5" />,
      title: "60-Second Creation",
      desc: "Professional resume ready in under a minute",
      color: "text-blue-400",
    },
    {
      icon: <FaRobot className="w-5 h-5" />,
      title: "AI-Powered",
      desc: "Smart suggestions and content optimization",
      color: "text-purple-400",
    },
    {
      icon: <MdOutlineDesignServices className="w-5 h-5" />,
      title: "20+ Templates",
      desc: "Designer-crafted professional templates",
      color: "text-rose-400",
    },
    {
      icon: <MdOutlineTranslate className="w-5 h-5" />,
      title: "Multi-Language",
      desc: "Automatic translations for global jobs",
      color: "text-emerald-400",
    },
    {
      icon: <RiShieldCheckLine className="w-5 h-5" />,
      title: "ATS Friendly",
      desc: "Optimized for applicant tracking systems",
      color: "text-amber-400",
    },
    {
      icon: <FaDownload className="w-5 h-5" />,
      title: "Instant PDF",
      desc: "Download or share online with a link",
      color: "text-cyan-400",
    },
  ];

  const steps = [
    {
      title: "Select Template",
      description: "Choose from our premium designed templates",
      icon: <FaPalette className="w-6 h-6" />,
    },
    {
      title: "Fill Information",
      description: "Our AI helps auto-fill relevant sections",
      icon: <FaRobot className="w-6 h-6" />,
    },
    {
      title: "Customize Design",
      description: "Adjust colors, fonts and layout to your taste",
      icon: <MdOutlineDesignServices className="w-6 h-6" />,
    },
    {
      title: "Download & Share",
      description: "Export as PDF or share online portfolio",
      icon: <MdShare className="w-6 h-6" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        >
          <FaRegFileAlt className="text-white text-2xl" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/20 to-black"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <FaRegFileAlt className="text-white text-sm" />
            </motion.div>
            <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ResumeCraft
            </span>
          </div>

          <div className="h-6 w-px bg-white/20 mx-2"></div>

          <div className="flex items-center gap-2">
            {!userId && (
              <>
                <SignUpButton mode="modal">
                  <button className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all">
                    Sign Up Free
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-4 py-1.5 text-sm rounded-full bg-white/10 hover:bg-white/20 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </>
            )}
            {userId && (
              <>
                <Link prefetch href="/builder">
                  <button className="px-4 py-1.5 text-sm rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-1">
                    <MdDashboardCustomize className="w-4 h-4" /> Dashboard
                  </button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center pt-20 pb-32 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">
                  AI-Powered Resume Builder
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Craft Your Perfect
                </span>
                <br />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Resume in Minutes
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                Create a professional resume that stands out with our AI-powered
                builder. Get hired faster with optimized content and beautiful
                designs.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link prefetch href={userId ? "/builder" : "/sign-up"}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    Start Building Free <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-lg font-semibold flex items-center gap-2 transition-all"
                >
                  See Templates
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="w-8 h-8 rounded-full bg-white/10 border-2 border-black"
                      ></div>
                    ))}
                  </div>
                  <span className="text-white/70">10,000+ Happy Users</span>
                </div>

                <div className="flex items-center gap-2 text-white/70">
                  <TbStars className="w-5 h-5 text-yellow-400" />
                  <span>Rated 4.9/5 by Professionals</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-10"></div>

                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>

                      <div className="flex items-center gap-2 text-xs bg-white/5 rounded-full px-3 py-1">
                        <FiClock className="w-3 h-3" />
                        <span>Auto-Saving</span>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl border border-white/10 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Resume Preview</h3>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                            <ComputerDesktopIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                            <DevicePhoneMobileIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border border-white/10 flex items-center justify-center">
                        <div className="text-center p-4">
                          <FaRegFileAlt className="w-10 h-10 mx-auto text-blue-400 mb-3" />
                          <h4 className="font-bold text-lg mb-1">
                            Your Resume
                          </h4>
                          <p className="text-sm text-white/70">
                            Start building to see preview
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {templates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentTemplate(index)}
                            className={`w-6 h-6 rounded-full ${
                              template.color
                            } ${
                              currentTemplate === index
                                ? "ring-2 ring-white"
                                : "opacity-50"
                            }`}
                          />
                        ))}
                      </div>

                      <button className="text-xs bg-white/5 hover:bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-1">
                        <MdOutlineDesignServices className="w-3 h-3" />
                        <span>Change Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-4">
              <BoltIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Why Choose Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                For Your Dream Job
              </span>
            </h2>

            <p className="text-lg text-white/70 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with beautiful
              design to help you create the perfect resume.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${feature.color.replace(
                    "text",
                    "bg"
                  )}/10 group-hover:bg-white/5 transition-all`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 sm:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-4">
                <FiClock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Simple Process</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Create Your Resume
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  In 4 Easy Steps
                </span>
              </h2>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                      <p className="text-white/70">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-8">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-10"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">
                      Resume Builder Interface
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs">AI Assistant Active</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-800/50 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Personal Information</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-400 rounded-full px-2 py-1">
                          Auto-filled
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-8 bg-gray-700/50 rounded"></div>
                        <div className="h-8 bg-gray-700/50 rounded"></div>
                        <div className="h-8 bg-gray-700/50 rounded"></div>
                        <div className="h-8 bg-gray-700/50 rounded"></div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Work Experience</h4>
                        <button className="text-xs bg-white/5 hover:bg-white/10 rounded-full px-2 py-1 flex items-center gap-1">
                          <FaRobot className="w-3 h-3" />
                          <span>AI Suggest</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div className="h-8 bg-gray-700/50 rounded"></div>
                        <div className="h-8 bg-gray-700/50 rounded w-3/4"></div>
                        <div className="h-16 bg-gray-700/50 rounded"></div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Skills</h4>
                        <button className="text-xs bg-white/5 hover:bg-white/10 rounded-full px-2 py-1">
                          + Add Skill
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "React",
                          "Node.js",
                          "UI/UX",
                          "Project Management",
                        ].map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/5 rounded-full px-3 py-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <button className="text-sm bg-white/5 hover:bg-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                      <MdOutlineDesignServices className="w-4 h-4" />
                      <span>Change Design</span>
                    </button>

                    <button className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full px-6 py-2 font-medium">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 -z-10"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-10 -z-10"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Ready to Build Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Professional Resume?
              </span>
            </h2>

            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who landed their dream jobs with
              our resume builder.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href={userId ? "/dashboard" : "/sign-up"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg font-semibold flex items-center gap-2 transition-all"
                >
                  Start Building Free <ArrowRightIcon className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-lg font-semibold flex items-center gap-2 transition-all"
              >
                See Example Resumes
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FaRegFileAlt className="text-white text-lg" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ResumeCraft
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="https://ruxshod.netlify.app"
                className="text-white/70 hover:text-white transition"
              >
                Features
              </Link>
              <Link
                href="https://ruxshod.netlify.app"
                className="text-white/70 hover:text-white transition"
              >
                Templates
              </Link>
              <Link
                href="https://ruxshod.netlify.app"
                className="text-white/70 hover:text-white transition"
              >
                Pricing
              </Link>
              <Link
                href="https://ruxshod.netlify.app"
                className="text-white/70 hover:text-white transition"
              >
                Blog
              </Link>
              <Link
                href="https://ruxshod.netlify.app"
                className="text-white/70 hover:text-white transition"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/account/access"
                className="text-white/70 hover:text-white transition"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link
                href="https://github.com/Ruxshod1511"
                className="text-white/70 hover:text-white transition"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/_ruxshodbek_?igsh=MXZ1bHM4eDVlNzFiYg%3D%3D"
                className="text-white/70 hover:text-white transition"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50">
            <p>
              &copy; {new Date().getFullYear()} ResumeCraft. All rights
              reserved.
            </p>
            <p className="mt-2">
              Made with ❤️ by Ruxshod Nutfullayev | Next.js, Tailwind, Framer
              Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
