'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface FiltersProps {
  services: string[]
  initialService?: string
  initialMin?: number
  initialMax?: number
  onApply: (filters: { service?: string; minPrice?: number; maxPrice?: number }) => void
}

export default function Filters({ services, initialService, initialMin, initialMax, onApply }: FiltersProps) {
  const [service, setService] = useState<string>(initialService ?? '')
  const [minInput, setMinInput] = useState<string>(initialMin !== undefined && initialMin !== null ? String(initialMin) : '')
  const [maxInput, setMaxInput] = useState<string>(initialMax !== undefined && initialMax !== null ? String(initialMax) : '')
  const [debouncedMin, setDebouncedMin] = useState<number | undefined>(initialMin ?? undefined)
  const [debouncedMax, setDebouncedMax] = useState<number | undefined>(initialMax ?? undefined)
  const minTimer = useRef<number | undefined>(undefined)
  const maxTimer = useRef<number | undefined>(undefined)
  const DEBOUNCE_MS = 300

  useEffect(() => setService(initialService ?? ''), [initialService])
  useEffect(() => { setMinInput(initialMin !== undefined && initialMin !== null ? String(initialMin) : ''); setDebouncedMin(initialMin ?? undefined) }, [initialMin])
  useEffect(() => { setMaxInput(initialMax !== undefined && initialMax !== null ? String(initialMax) : ''); setDebouncedMax(initialMax ?? undefined) }, [initialMax])

  useEffect(() => {
    window.clearTimeout(minTimer.current)
    minTimer.current = window.setTimeout(() => {
      const n = minInput.trim() === '' ? undefined : Number(minInput)
      setDebouncedMin(Number.isNaN(n as number) ? undefined : n)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(minTimer.current)
  }, [minInput])

  useEffect(() => {
    window.clearTimeout(maxTimer.current)
    maxTimer.current = window.setTimeout(() => {
      const n = maxInput.trim() === '' ? undefined : Number(maxInput)
      setDebouncedMax(Number.isNaN(n as number) ? undefined : n)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(maxTimer.current)
  }, [maxInput])

  const validationMsg = useMemo(() => debouncedMin !== undefined && debouncedMax !== undefined && debouncedMin > debouncedMax ? 'Minimum price should not be greater than maximum price.' : '', [debouncedMin, debouncedMax])

  const handleApply = () => {
    const immediateMin = minInput.trim() === '' ? undefined : Number(minInput)
    const immediateMax = maxInput.trim() === '' ? undefined : Number(maxInput)
    const minToSend = debouncedMin !== undefined ? debouncedMin : (Number.isNaN(immediateMin) ? undefined : immediateMin)
    const maxToSend = debouncedMax !== undefined ? debouncedMax : (Number.isNaN(immediateMax) ? undefined : immediateMax)
    onApply({ service: service || undefined, minPrice: minToSend, maxPrice: maxToSend })
  }

  const handleClear = () => {
    setService(''); setMinInput(''); setMaxInput(''); setDebouncedMin(undefined); setDebouncedMax(undefined)
    onApply({ service: undefined, minPrice: undefined, maxPrice: undefined })
  }

  const onKeyPressApply = (e: React.KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); handleApply() } }

  return (
    <form className="bg-white/3 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end" onSubmit={(e) => { e.preventDefault(); handleApply() }} aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="sr-only">Filter workers</h2>

      <div className="flex flex-col">
        <label htmlFor="service-select" className="text-sm text-gray-200 mb-1">Service</label>
        <select id="service-select" value={service} onChange={(e) => setService(e.target.value)} className="bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          <option value="">All services</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        
      </div>

      <div className="flex flex-col">
        <label htmlFor="min-price" className="text-sm text-gray-200 mb-1">Min price (₹)</label>
        <input id="min-price" name="minPrice" type="number" inputMode="numeric" value={minInput} onChange={(e) => setMinInput(e.target.value)} onKeyDown={onKeyPressApply} placeholder="e.g. 100" className="bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" aria-label="Minimum price" />
      </div>

      <div className="flex flex-col">
        <label htmlFor="max-price" className="text-sm text-gray-200 mb-1">Max price (₹)</label>
        <input id="max-price" name="maxPrice" type="number" inputMode="numeric" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} onKeyDown={onKeyPressApply} placeholder="e.g. 1000" className="bg-slate-800 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500" aria-label="Maximum price" />
      </div>

      <div className="sm:col-span-3 flex items-center justify-end gap-2">
        {validationMsg && <div role="alert" className="text-sm text-amber-300 mr-auto">{validationMsg}</div>}

        <button type="button" onClick={handleClear} className="px-3 py-2 rounded-md text-sm font-medium bg-slate-800 hover:bg-white/10 text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500">Clear</button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500">Apply</button>
      </div>
    </form>
  )
}
