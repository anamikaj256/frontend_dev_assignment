'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-block w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600" aria-hidden />
            <span className="text-black font-extrabold text-lg">Gigora</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4" aria-label="Main navigation">
            <Link href="/workers" className="text-sm font-bold px-3 py-2 text-gray-100 hover:text-white rounded-md">Workers</Link>
            <Link href="/services" className="text-sm font-bold px-3 py-2 text-gray-100 hover:text-white rounded-md">Services</Link>
            <Link href="/contact" className="text-sm font-bold px-3 py-2 text-gray-100 hover:text-white rounded-md">Contact</Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-md text-gray-100 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {open ? (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-200 ${open ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 space-y-1">
          <Link href="/workers" className="block text-gray-100 px-3 py-2 rounded-md" onClick={() => setOpen(false)}>Workers</Link>
          <Link href="/services" className="block text-gray-100 px-3 py-2 rounded-md" onClick={() => setOpen(false)}>Services</Link>
          <Link href="/contact" className="block text-gray-100 px-3 py-2 rounded-md" onClick={() => setOpen(false)}>Contact</Link>
        </div>
      </div>
    </header>
  )
}
