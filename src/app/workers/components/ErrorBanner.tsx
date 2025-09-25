'use client'
import React from 'react'

export default function ErrorBanner({ message = 'An error occurred' }: { message?: string }) {
  return (
    <div role="alert" className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-md">
      <strong className="font-semibold">Error: </strong>
      <span className="ml-2">{message}</span>
    </div>
  )
}
