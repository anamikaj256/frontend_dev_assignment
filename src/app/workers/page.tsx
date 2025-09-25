'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import useWorkers from './hooks/useWorkers'
import Filters from './components/Filters'
import WorkersGrid from './components/WorkersGrid'
import Pagination from './components/Pagination'
import SkeletonGrid from './components/SkeletonGrid'
import ErrorBanner from './components/ErrorBanner'

const PAGE_SIZE = 12
const fetcher = (url: string) => fetch(url).then((r) => r.json())
const GST_RATE = 0.18

function displayedToBaseMin(displayed?: number | undefined): number | undefined {
  if (displayed === undefined || displayed === null || Number.isNaN(displayed)) return undefined
  return Math.ceil(displayed / (1 + GST_RATE))
}
function displayedToBaseMax(displayed?: number | undefined): number | undefined {
  if (displayed === undefined || displayed === null || Number.isNaN(displayed)) return undefined
  return Math.floor(displayed / (1 + GST_RATE))
}
function baseToDisplayed(base?: number | undefined): number | undefined {
  if (base === undefined || base === null || Number.isNaN(base)) return undefined
  return Math.round(base * (1 + GST_RATE))
}

export default function WorkersPage() {
  const searchParams = useSearchParams()
  const urlService = searchParams?.get('service') ?? undefined
  const urlMin = searchParams?.get('minPrice')
  const urlMax = searchParams?.get('maxPrice')

  const [page, setPage] = useState<number>(1)
  const [service, setService] = useState<string | undefined>(undefined)
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined) // base prices for API
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)

  // when URL query changes (e.g., user clicked from services page), sync states
  useEffect(() => {
    if (urlService) {
      setService(urlService)
      setPage(1)
    }
    // parse min/max from URL as displayed numbers and convert to base for API
    const parsedMinDisplayed = urlMin ? Number(urlMin) : undefined
    const parsedMaxDisplayed = urlMax ? Number(urlMax) : undefined

    const baseMin = parsedMinDisplayed !== undefined && !Number.isNaN(parsedMinDisplayed) ? displayedToBaseMin(parsedMinDisplayed) : undefined
    const baseMax = parsedMaxDisplayed !== undefined && !Number.isNaN(parsedMaxDisplayed) ? displayedToBaseMax(parsedMaxDisplayed) : undefined

    setMinPrice(baseMin)
    setMaxPrice(baseMax)
    // reset page when url filters change
    setPage(1)
  }, [urlService, urlMin, urlMax])

  // fetch workers with current filters & pagination (minPrice/maxPrice are base)
  const { data, meta, isLoading, error } = useWorkers({
    page,
    pageSize: PAGE_SIZE,
    service,
    minPrice,
    maxPrice,
  })

  // fetch services list for Filters dropdown
  const { data: servicesResp } = useSWR('/api/services', fetcher, { revalidateOnFocus: false })
  const servicesList: string[] = Array.isArray(servicesResp?.data) ? servicesResp.data : []

  // Called by Filters (filters supply displayed numbers). Convert to base prices for API.
  const handleApplyFilters = (filters: { service?: string; minPrice?: number; maxPrice?: number }) => {
    setService(filters.service)
    setMinPrice(displayedToBaseMin(filters.minPrice))
    setMaxPrice(displayedToBaseMax(filters.maxPrice))
    setPage(1)
  }

  // seed filter inputs with displayed values (convert stored base -> displayed)
  const initialDisplayedMin = baseToDisplayed(minPrice)
  const initialDisplayedMax = baseToDisplayed(maxPrice)

  return (
    <main className="container mx-auto px-4 py-8 bg-[#000000] text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Workers</h1>

      <div className="mb-6 shadow-lg shadow-blue-500/50">
        <Filters
          services={servicesList}
          initialService={service}
          initialMin={initialDisplayedMin}
          initialMax={initialDisplayedMax}
          onApply={handleApplyFilters}
        />
      </div>

      {isLoading && <SkeletonGrid count={PAGE_SIZE} />}

      {error && <div className="my-6"><ErrorBanner message={error.message ?? 'Failed to load workers'} /></div>}

      {!isLoading && !error && data && data.length > 0 && (
        <>
          <WorkersGrid workers={data} />
          {meta?.totalPages && meta.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination page={page} totalPages={meta.totalPages} onPageChange={(p) => setPage(p)} isLoading={isLoading} />
            </div>
          )}
        </>
      )}

      {!isLoading && !error && data && data.length === 0 && (
        <div className="text-center text-gray-400 my-8">No workers found for the selected filters.</div>
      )}
    </main>
  )
}
