import useSWR from 'swr'
import { useMemo } from 'react'
import type { WorkerType } from '../../../types/workers'

type Params = {
  page?: number
  pageSize?: number
  service?: string
  minPrice?: number
  maxPrice?: number
}

type Meta = {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface ApiResponse {
  success: true
  data: WorkerType[]
  meta: Meta
  timestamp?: string
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Network error: ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'API error')
  return json as ApiResponse
}

export default function useWorkers(params: Params = {}) {
  const { page = 1, pageSize = 12, service, minPrice, maxPrice } = params

  const query = useMemo(() => {
    const qp = new URLSearchParams()
    qp.set('page', String(page))
    qp.set('pageSize', String(pageSize))
    if (service) qp.set('service', service)
    if (minPrice !== undefined && minPrice !== null) qp.set('minPrice', String(minPrice))
    if (maxPrice !== undefined && maxPrice !== null) qp.set('maxPrice', String(maxPrice))
    return qp.toString()
  }, [page, pageSize, service, minPrice, maxPrice])

  const url = `/api/workers${query ? `?${query}` : ''}`

  const { data, error, mutate } = useSWR<ApiResponse>(url, fetcher, { revalidateOnFocus: false })

  return {
    data: data?.data ?? null,
    meta: data?.meta ?? null,
    isLoading: !error && !data,
    error: error as Error | undefined,
    mutate,
  }
}
