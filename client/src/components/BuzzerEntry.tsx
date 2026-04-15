import type { BuzzEntry } from '../types'

interface Props {
  entry: BuzzEntry
  firstTimestamp: number
}

const medals = ['🥇', '🥈', '🥉']

export function BuzzerEntry({ entry, firstTimestamp }: Props) {
  const delta = entry.rank === 1 ? null : ((entry.timestamp - firstTimestamp) / 1000).toFixed(2)

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
        entry.rank === 1
          ? 'bg-yellow-50 border-2 border-yellow-300 shadow-md'
          : 'bg-white border border-gray-200'
      }`}
    >
      <span className="text-2xl w-8 text-center">
        {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
      </span>
      <span className="flex-1 text-lg font-semibold text-gray-800 truncate">
        {entry.name}
      </span>
      {delta && (
        <span className="text-sm text-gray-400 font-mono">+{delta}s</span>
      )}
      {entry.rank === 1 && (
        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
          PREMIER !
        </span>
      )}
    </div>
  )
}
