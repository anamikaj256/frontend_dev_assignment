'use client'
import React, { useMemo } from 'react'
import type { WorkerType } from '../../../types/workers'
import WorkerCard from './WorkerCard'

interface Props { workers: WorkerType[] }

const WorkersGrid: React.FC<Props> = ({ workers }) => {
  const items = useMemo(() => workers ?? [], [workers])

  return (
    <section aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((w) => <WorkerCard key={w.id ?? w.name} worker={w} />)}
      </div>
    </section>
  )
}

export default React.memo(WorkersGrid)
