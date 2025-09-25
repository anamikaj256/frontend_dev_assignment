import React from 'react'
import ContactForm from './components/ContactForm'
import Link from 'next/link'

export const metadata = {
  title: 'Contact — Gigora',
  description: 'Contact page for Gigora - get in touch',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#000000] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Contact Us</h1>
            <p className="mt-2 text-gray-300">
              Have a question, feedback or want to hire a worker? Send us a message and we&apos;ll get back to you.
            </p>
          </header>

          <div className="bg-gray-700 rounded-2xl p-6 shadow-sm">
            <ContactForm />
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Prefer direct contact? Email us at{' '}
            <a href="mailto:hello@gigora.example" className="text-sky-400 hover:underline">
              hello@gigora.example
            </a>
            {' '}or call <a href="tel:+911234567890" className="text-sky-400 hover:underline">+91 12345 67890</a>.
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-300 hover:text-white">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
