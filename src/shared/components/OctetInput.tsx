import React, { useRef } from 'react'

export interface OctetInputProps {
  value: string // e.g. "192.168.1.1" or partial ""
  onChange: (value: string) => void
  disabled?: boolean
  hasError?: boolean
  isCorrect?: boolean
  placeholder?: string
  id?: string
  className?: string
  autoFocus?: boolean
}

export function OctetInput({
  value,
  onChange,
  disabled = false,
  hasError = false,
  isCorrect = false,
  className = '',
  autoFocus = false,
}: OctetInputProps) {
  // Parse incoming value into 4 octet strings
  const octets = React.useMemo(() => {
    if (!value) return ['', '', '', '']
    const parts = value.split('.')
    return [
      parts[0] ?? '',
      parts[1] ?? '',
      parts[2] ?? '',
      parts[3] ?? '',
    ]
  }, [value])

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const updateOctet = (index: number, newOctetVal: string) => {
    // Only allow digits
    const cleaned = newOctetVal.replace(/\D/g, '').slice(0, 3)
    const num = Number(cleaned)
    if (cleaned !== '' && num > 255) {
      return // Disallow values over 255
    }

    const updated = [...octets]
    updated[index] = cleaned
    onChange(updated.join('.'))

    // Auto-advance if 3 digits entered or value >= 100
    if (cleaned.length === 3 || (cleaned.length > 0 && num > 25)) {
      if (index < 3) {
        inputRefs[index + 1].current?.focus()
        inputRefs[index + 1].current?.select()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Advance on period or space
    if (e.key === '.' || e.key === 'Decimal') {
      e.preventDefault()
      if (index < 3) {
        inputRefs[index + 1].current?.focus()
        inputRefs[index + 1].current?.select()
      }
      return
    }

    // Backspace to previous octet if current octet is empty
    if (e.key === 'Backspace' && octets[index] === '' && index > 0) {
      e.preventDefault()
      inputRefs[index - 1].current?.focus()
      return
    }

    // Left/Right arrow navigation
    if (e.key === 'ArrowRight' && index < 3) {
      const input = inputRefs[index].current
      if (input && input.selectionStart === input.value.length) {
        e.preventDefault()
        inputRefs[index + 1].current?.focus()
        inputRefs[index + 1].current?.setSelectionRange(0, 0)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const input = inputRefs[index].current
      if (input && input.selectionStart === 0) {
        e.preventDefault()
        inputRefs[index - 1].current?.focus()
        const prevLen = inputRefs[index - 1].current?.value.length || 0
        inputRefs[index - 1].current?.setSelectionRange(prevLen, prevLen)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text').trim()
    const parts = pastedText.split('.')

    if (parts.length === 4) {
      const sanitized = parts.map((p) => {
        const n = Number(p.replace(/\D/g, ''))
        return isNaN(n) ? '0' : String(Math.min(255, Math.max(0, n)))
      })
      onChange(sanitized.join('.'))
      inputRefs[3].current?.focus()
    } else {
      // If just a number, put in current octet
      const cleaned = pastedText.replace(/\D/g, '').slice(0, 3)
      if (cleaned) {
        updateOctet(0, cleaned)
      }
    }
  }

  // Determine dynamic border and background styles
  let stateBorder = 'border-slate-700 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/50'
  if (hasError) {
    stateBorder = 'border-rose-500 ring-1 ring-rose-500/40 bg-rose-950/20'
  } else if (isCorrect) {
    stateBorder = 'border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-950/20'
  }

  return (
    <div
      className={`inline-flex items-center bg-slate-900 border rounded-lg px-2.5 py-1.5 transition-all font-mono text-sm ${stateBorder} ${className}`}
    >
      {[0, 1, 2, 3].map((idx) => (
        <React.Fragment key={idx}>
          <input
            ref={inputRefs[idx]}
            type="text"
            inputMode="numeric"
            maxLength={3}
            disabled={disabled}
            autoFocus={autoFocus && idx === 0}
            value={octets[idx]}
            onChange={(e) => updateOctet(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={idx === 0 ? handlePaste : undefined}
            placeholder="0"
            className="w-8 text-center bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none focus:text-cyan-300 disabled:opacity-50 select-text"
          />
          {idx < 3 && <span className="text-slate-600 font-bold select-none px-0.5">.</span>}
        </React.Fragment>
      ))}
    </div>
  )
}
