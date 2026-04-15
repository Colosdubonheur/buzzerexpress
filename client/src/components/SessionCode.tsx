import { useState } from 'react'

interface Props {
  code: string
}

export function SessionCode({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/join/${code}`
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback pour HTTP ou navigateurs sans clipboard API
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Dernier recours : afficher l'URL pour copie manuelle
      prompt('Copie ce lien :', url)
    }
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
