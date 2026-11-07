import { ArrowRight, Check, Eye } from 'lucide-react'
import type { DrillStatus } from '../store/useDrillStore'

interface ActionControlsProps {
  status: DrillStatus
  onCheck: () => void
  onReveal: () => void
  onNext: () => void
}

export function ActionControls({
  status,
  onCheck,
  onReveal,
  onNext,
}: ActionControlsProps) {
  const isDone = status === 'correct' || status === 'revealed'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <div className="flex items-center gap-2">
        {!isDone && (
          <button
            onClick={onReveal}
            type="button"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-sm border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Reveal Steps (Space)</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isDone ? (
          <button
            onClick={onCheck}
            type="button"
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Check Answer (Enter)</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            type="button"
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-sm transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer"
          >
            <span>Next Problem (Enter)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
