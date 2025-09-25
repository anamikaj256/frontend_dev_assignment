'use client'
import React from 'react'
import Image from 'next/image'
import type { WorkerType } from '../../../types/workers'
interface Props { worker: WorkerType }

const GST_RATE = 0.18

const WorkerCard: React.FC<Props> = ({ worker }) => {
  const headingId = `worker-${worker.id ?? String(worker.name)}-name`
  const displayedPrice = Math.round(worker.pricePerDay * (1 + GST_RATE))

  return (
    <article
      tabIndex={0}
      aria-labelledby={headingId}
      className="bg-white/70 rounded-4xl overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image src={worker.image} alt={worker.name} fill className="object-cover "  loading="lazy" sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" />
      </div>


      <div className="p-4">
        <h3 id={headingId} className="text-lg font-semibold text-black truncate">{worker.name}</h3>
        <p className="text-sm text-gray-700 mt-1 truncate">{worker.service}</p>
        <div className="mt-3">
          <span className="text-md font-medium text-gray-900">₹{displayedPrice} / day</span>
        </div>
      </div>
    </article>
  )
}

export default React.memo(WorkerCard)
