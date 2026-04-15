import { useState } from 'react'

interface Props {
  code: string
}

export function SessionCode({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/join/${code}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">
        Code de session
      </p>
      <div className="flex gap-2">
        {code.split('').map((letter, i) => (
          <span
            key={i}
            className="flex items-center justify-center w-14 h-16 text-3xl font-black bg-white border-2 border-indigo-200 rounded-xl shadow-sm text-indigo-700"
          >
            {letter}
          </span>
        ))}
      </div>
      <button
        onClick={handleCopy}
        className="mt-1 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors"
      >
        {copied ? '✓ Lien copié !' : '📋 Copier le lien participants'}
      </button>
    </div>
  )
}
