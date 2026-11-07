import { Flame, Layers, Network } from 'lucide-react'

interface AppHeaderProps {
  streak: number
  bestStreak: number
}

export function AppHeader({ streak, bestStreak }: AppHeaderProps) {
  return (
    <header className="w-full border-b border-slate-800 bg-[#090D16]/90 backdrop-blur-md px-6 py-3.5 sticky top-0 z-50 flex items-center justify-between">
      {/* Brand & Active Module */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg text-slate-100 tracking-tight">NetBench</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono border border-slate-700">v0.1.0</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Modular Network Engineering Workbench</p>
        </div>
      </div>

      {/* Module Selector & Gamification Streaks */}
      <div className="flex items-center gap-4">
        {/* Active Module Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Subnet Drill & Slicer</span>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs">
          <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <span>Streak: <strong className="text-slate-100">{streak}</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Best: {bestStreak}</span>
        </div>
      </div>
    </header>
  )
}
