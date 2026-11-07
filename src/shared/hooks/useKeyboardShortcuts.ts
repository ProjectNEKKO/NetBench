import { useEffect } from 'react'

export interface ShortcutHandlers {
  onEnter?: () => void
  onSpace?: () => void
  onEscape?: () => void
}

/**
 * Global keyboard shortcuts listener for ergonomic drill flow.
 */
export function useKeyboardShortcuts({ onEnter, onSpace, onEscape }: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in a text/number input unless it's Enter
      const target = e.target as HTMLElement
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')

      if (e.key === 'Enter') {
        onEnter?.()
      } else if (e.key === ' ' && !isInput) {
        e.preventDefault()
        onSpace?.()
      } else if (e.key === 'Escape') {
        onEscape?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEnter, onSpace, onEscape])
}
