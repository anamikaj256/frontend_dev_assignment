'use client'
import React, { useMemo } from 'react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
  isLoading?: boolean
}

type PageItem = number | 'ellipsis'

export default function Pagination({ page, totalPages, onPageChange, isLoading }: Props) {
  const current = Math.max(1, Math.min(page, totalPages || 1))

  const pageItems: PageItem[] = useMemo(() => {
    const pages: PageItem[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages
    }
    const leftWindow = Math.max(2, current - 1)
    const rightWindow = Math.min(totalPages - 1, current + 1)
    pages.push(1)
    if (leftWindow > 2) pages.push('ellipsis')
    else for (let i = 2; i < leftWindow; i++) pages.push(i)
    for (let i = leftWindow; i <= rightWindow; i++) pages.push(i)
    if (rightWindow < totalPages - 1) pages.push('ellipsis')
    else for (let i = rightWindow + 1; i < totalPages; i++) pages.push(i)
    pages.push(totalPages)
    return pages
  }, [current, totalPages])

  const handleChange = (p: number) => {
    if (isLoading) return
    if (p < 1 || p > totalPages) return
    if (p === current) return
    onPageChange(p)
  }

  if (!totalPages || totalPages <= 1) return null

  return (
    <nav className="inline-flex items-center gap-2" role="navigation" aria-label="Pagination Navigation">
      <button type="button" onClick={() => handleChange(current - 1)} disabled={isLoading || current === 1} aria-label="Go to previous page" className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${current === 1 || isLoading ? 'text-gray-500 cursor-not-allowed' : 'text-gray-100 hover:bg-white/5'}`}>Prev</button>

      <ul className="inline-flex items-center gap-1" role="list">
        {pageItems.map((item, idx) => item === 'ellipsis' ? <li key={`ell-${idx}`} className="px-2 text-gray-400 select-none" aria-hidden>&hellip;</li> : <li key={`p-${item}`}><button type="button" onClick={() => handleChange(item)} aria-label={`Go to page ${item}`} aria-current={item === current ? 'page' : undefined} className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${item === current ? 'bg-sky-600 text-white' : 'text-gray-100 hover:bg-white/5'}`}>{item}</button></li>)}
      </ul>

      <button type="button" onClick={() => handleChange(current + 1)} disabled={isLoading || current === totalPages} aria-label="Go to next page" className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${current === totalPages || isLoading ? 'text-gray-500 cursor-not-allowed' : 'text-gray-100 hover:bg-white/5'}`}>Next</button>
    </nav>
  )
}
