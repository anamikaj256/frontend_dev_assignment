'use client'

import React from 'react'
import useSWR from 'swr'
import ServicesGrid from './components/ServicesGrid'
import SkeletonGrid from '../workers/components/SkeletonGrid'
import ErrorBanner from '../workers/components/ErrorBanner'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ServicesPage() {
  // Use the stats=true query to retrieve detailed service stats from the API
  const { data, error } = useSWR('/api/services?stats=true', fetcher, {
    revalidateOnFocus: false,
  })

  const isLoading = !data && !error
  const serviceStats = Array.isArray(data?.data) ? data.data : []

  return (
    <main className="container mx-auto px-4 py-8 bg-[#000000] text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-6 text-center">Services</h1>

      {isLoading && (
        <div className="mb-6">
          <SkeletonGrid count={8} />
        </div>
      )}

      {error && (
        <div className="mb-6">
          <ErrorBanner message={error.message ?? 'Failed to load services'} />
        </div>
      )}

      {!isLoading && !error && serviceStats.length === 0 && (
        <div className="text-center text-gray-400">No services found.</div>
      )}

      {!isLoading && !error && serviceStats.length > 0 && (
        <div className="mb-6">
          <ServicesGrid stats={serviceStats} />
        </div>
      )}

      <div className="mt-8 text-sm text-gray-400 text-center">
        Click a service to view workers for that service.
      </div>
    </main>
  )
}
