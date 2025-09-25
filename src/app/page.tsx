import Link from 'next/link'
import React from 'react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0000000] text-white flex flex-col">
      {/* Centered hero */}
      <section className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Gigora</h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Find skilled local workers quickly — compare prices and services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/workers"
              className="inline-block px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 font-semibold transition"
            >
              Browse Workers
            </Link>

            <Link
              href="/services"
              className="inline-block px-6 py-3 rounded-2xl bg-white/6 hover:bg-white/10 font-medium transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

     
      <footer className="py-6 text-center border-t border-white/5">
        <div className="container mx-auto px-4">
          <span className="text-sm text-gray-400">© {new Date().getFullYear()} Gigora</span>
        </div>
      </footer>
    </main>
  )
}
