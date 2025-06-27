"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

const CallToActionSection = () => {
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover object-center z-0"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-20 max-w-4xl xl:max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-12"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <h2 className="text-2xl font-bold text-white">
            Find your dream rental property
          </h2>
          <p className="text-white max-w-xl">
            Discover a wide range of rental properties
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-primary-700 bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-500 hover:text-white transition"
            >
              Search
            </button>
            <Link
              href="/signup"
              scroll={false}
              className="text-white bg-secondary-500 rounded-lg px-6 py-3 font-semibold hover:bg-secondary-600 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CallToActionSection
