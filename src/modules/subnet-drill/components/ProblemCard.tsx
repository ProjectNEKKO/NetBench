import type { DifficultyTier } from '@/shared/lib/ip-types'
import { DIFFICULTY_TIERS, type DrillProblem } from '../core/generator'

interface ProblemCardProps {
  problem: DrillProblem
  selectedTier: DifficultyTier
  onSelectTier: (tier: DifficultyTier) => void
}

export function ProblemCard({ problem, selectedTier, onSelectTier }: ProblemCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      {/* Tier Selector Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(DIFFICULTY_TIERS) as DifficultyTier[]).map((tierKey) => {
            const t = DIFFICULTY_TIERS[tierKey]
            const isActive = selectedTier === tierKey

            return (
              <button
                key={tierKey}
                onClick={() => onSelectTier(tierKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Target IP Challenge Display */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-lg border border-slate-800/60 text-center">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-1">Target IPv4 Address</span>
        <div className="flex items-baseline gap-2 font-mono">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">{problem.ip}</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">/{problem.cidr}</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Calculate the 6 parameters below for this subnet allocation.
        </p>
      </div>
    </div>
  )
}
