'use client'

import React from 'react'
import Link from 'next/link'

export type ServiceStat = {
  name: string
  count: number
  averagePrice: number | null // base
  averagePriceDisplayed?: number | null // GST-inclusive
  priceRange: { min: number | null; max: number | null } // base
  priceRangeDisplayed?: { min: number | null; max: number | null } // GST-inclusive
}

interface Props {
  stat: ServiceStat
}

export default function ServiceCard({ stat }: Props) {
  const { name, count, averagePriceDisplayed, averagePrice, priceRangeDisplayed, priceRange } = stat

  // prefer displayed (GST inclusive) values for the UI; fall back to converting base if missing
  const avgToShow = averagePriceDisplayed ?? (averagePrice !== null ? Math.round(averagePrice * 1.18) : null)
  const rangeToShow = priceRangeDisplayed ?? {
    min: priceRange.min !== null ? Math.round(priceRange.min * 1.18) : null,
    max: priceRange.max !== null ? Math.round(priceRange.max * 1.18) : null,
  }

  // Build link query params using displayed numbers (so user sees the same numbers)
  const queryParts: string[] = []
  queryParts.push(`service=${encodeURIComponent(name)}`)
  if (rangeToShow.min !== null && rangeToShow.min !== undefined) queryParts.push(`minPrice=${rangeToShow.min}`)
  if (rangeToShow.max !== null && rangeToShow.max !== undefined) queryParts.push(`maxPrice=${rangeToShow.max}`)
  const href = `/workers?${queryParts.join('&')}`

  return (
    <article className="bg-white/5 rounded-2xl p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{name}</h3>
          <p className="text-sm text-gray-300 mt-1">{count} worker{count !== 1 ? 's' : ''}</p>
        </div>

        <div className="text-right">
          {avgToShow !== null ? (
            <>
              <div className="text-sm text-gray-300">Avg</div>
              <div className="text-md font-medium text-white">₹{avgToShow}</div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No price data</div>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-300">
        {rangeToShow.min !== null && rangeToShow.max !== null ? (
          <>Range: ₹{rangeToShow.min} — ₹{rangeToShow.max}</>
        ) : (
          <>Price range not available</>
        )}
      </div>

      <div className="mt-4">
        <Link href={href} className="inline-block px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium">
          View {count} {count === 1 ? 'worker' : 'workers'}
        </Link>
      </div>
    </article>
  )
}
