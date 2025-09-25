import { NextRequest, NextResponse } from 'next/server'
import workersData from '../../../../workers.json'

const GST_RATE = 0.18

export async function GET(request: NextRequest) {
  try {
    // tiny optional delay for dev realism
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 80))

    const services = Array.from(new Set(workersData.map((w) => w.service)))

    const serviceStats = services.map((service) => {
      const workersInService = workersData.filter((w) => w.service === service)
      const prices = workersInService
        .map((w) => w.pricePerDay)
        .filter((p) => typeof p === 'number' && !Number.isNaN(p))

      const averageBase = prices.length ? prices.reduce((s, p) => s + p, 0) / prices.length : null
      const minBase = prices.length ? Math.min(...prices) : null
      const maxBase = prices.length ? Math.max(...prices) : null

      const averageDisplayed = averageBase !== null ? Math.round(averageBase * (1 + GST_RATE)) : null
      const minDisplayed = minBase !== null ? Math.round(minBase * (1 + GST_RATE)) : null
      const maxDisplayed = maxBase !== null ? Math.round(maxBase * (1 + GST_RATE)) : null

      return {
        name: service,
        count: workersInService.length,
        // keep both base and displayed values so consumers can choose
        averagePrice: averageBase !== null ? Math.round(averageBase) : null, // base (rounded)
        averageDisplayed, // GST-inclusive
        priceRange: {
          min: minBase !== null ? Math.round(minBase) : null,
          max: maxBase !== null ? Math.round(maxBase) : null,
        },
        priceRangeDisplayed: {
          min: minDisplayed,
          max: maxDisplayed,
        },
      }
    })

    serviceStats.sort((a, b) => b.count - a.count)

    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'

    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    }

    if (includeStats) {
      return NextResponse.json(
        {
          success: true,
          data: serviceStats,
          metadata: { totalServices: services.length, totalWorkers: workersData.length },
          timestamp: new Date().toISOString(),
        },
        { status: 200, headers }
      )
    }

    // default: return just service names
    return NextResponse.json(
      {
        success: true,
        data: services,
        metadata: { count: services.length },
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers }
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
