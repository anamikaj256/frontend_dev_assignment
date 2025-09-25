import { NextRequest, NextResponse } from 'next/server'
import workersData from '../../../../workers.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '12', 10))
    const service = searchParams.get('service') || undefined
    const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const servicesOnly = searchParams.get('services') === 'true'

    // Return just the unique services if requested
    if (servicesOnly) {
      const services = Array.from(new Set(workersData.map((w) => w.service)))
      return NextResponse.json(
        {
          success: true,
          data: services,
          metadata: { count: services.length },
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=60',
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Filter
    let filtered = workersData.slice()
    if (service) filtered = filtered.filter((w) => w.service === service)
    if (minPrice !== undefined && !Number.isNaN(minPrice)) filtered = filtered.filter((w) => w.pricePerDay >= minPrice)
    if (maxPrice !== undefined && !Number.isNaN(maxPrice)) filtered = filtered.filter((w) => w.pricePerDay <= maxPrice)

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const paged = filtered.slice(start, start + pageSize)

    return NextResponse.json(
      {
        success: true,
        data: paged,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err: unknown) {
  console.error('[Contact] error:', err);

  let message = 'Internal Server Error';
  if (err instanceof Error) {
    message = err.message;
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}
}
