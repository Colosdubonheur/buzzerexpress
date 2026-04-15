import type { BuzzEntry } from '../types'
import { BuzzerEntry } from './BuzzerEntry'

interface Props {
  buzzOrder: BuzzEntry[]
}

export function BuzzerList({ buzzOrder }: Props) {
  if (buzzOrder.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-5xl mb-4">🔔</span>
        <p className="text-lg font-medium">En attente des buzzers…</p>
        <p className="text-sm mt-1">Les participants vont apparaître ici</p>
      </div>
    )
  }

  const firstTimestamp = buzzOrder[0].timestamp

  return (
    <div className="flex flex-col gap-3">
      {buzzOrder.map((entry) => (
        <BuzzerEntry key={entry.participantId} entry={entry} firstTimestamp={firstTimestamp} />
      ))}
    </div>
  )
}
