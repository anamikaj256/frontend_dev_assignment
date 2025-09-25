'use client'

import React from 'react'
import type { ServiceStat } from './ServiceCard'
import ServiceCard from './ServiceCard'

interface Props {
  stats: ServiceStat[]
}

export default function ServicesGrid({ stats }: Props) {
  return (
    <section aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <ServiceCard key={s.name} stat={s} />
        ))}
      </div>
    </section>
  )
}
