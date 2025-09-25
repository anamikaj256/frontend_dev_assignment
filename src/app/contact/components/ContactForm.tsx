'use client'

import React, { useState } from 'react'

type FormState = {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const update = (k: keyof FormState, v: string) => {
    setForm((s) => ({ ...s, [k]: v }))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!form.email.trim()) return 'Please enter your email.'
    // basic email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(form.email)) return 'Please enter a valid email address.'
    if (!form.message.trim()) return 'Please enter a message.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json?.error || 'Failed to send message. Please try again later.')
      } else {
        setSuccess('Message sent — we will get back to you soon.')
        setForm({ name: '', email: '', message: '' })
      }
    } catch (err) {
      // network / unexpected
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="contact-form-heading" className="space-y-4">
      <h2 id="contact-form-heading" className="sr-only">Contact form</h2>

      {error && (
        <div role="alert" className="rounded-md bg-red-900/50 border border-red-700 text-red-200 px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="rounded-md bg-green-900/50 border border-green-700 text-green-200 px-4 py-3">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-200 mb-1">Your name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="John Doe"
            required
            className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Your name"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-200 mb-1">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
            required
            className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Your email"
          />
        </label>
      </div>

      <label className="flex flex-col">
        <span className="text-sm text-gray-200 mb-1">Message</span>
        <textarea
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          rows={6}
          placeholder="Tell us about your request..."
          required
          className="px-3 py-2 rounded-md bg-transparent border border-white/10 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          aria-label="Message"
        />
      </label>

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send message'}
        </button>

        <div className="text-sm text-gray-400">
          Or email us at{' '}
          <a href="mailto:hello@gigora.example" className="text-sky-400 hover:underline">
            hello@gigora.example
          </a>
        </div>
      </div>
    </form>
  )
}
