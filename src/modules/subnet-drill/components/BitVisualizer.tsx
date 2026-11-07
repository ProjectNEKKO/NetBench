import { getBinarySlices } from '@/shared/lib/bitwise-formatter'

interface BitVisualizerProps {
  ip: string
  cidr: number
}

export function BitVisualizer({ ip, cidr }: BitVisualizerProps) {
  const slices = getBinarySlices(ip, cidr)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-3 font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-wider font-semibold">32-Bit Binary Allocation Ruler</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>Network ({slices.networkBits.length})</span>
          </span>
          {slices.subnetBits.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
              <span>Subnet ({slices.subnetBits.length})</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
            <span>Host ({slices.hostBits.length})</span>
          </span>
        </div>
      </div>

      {/* Segmented bit row */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center overflow-x-auto text-xs sm:text-sm tracking-widest justify-center">
        <span className="text-emerald-400 font-bold">{slices.networkBits}</span>
        {slices.subnetBits.length > 0 && (
          <span className="text-amber-400 font-bold">{slices.subnetBits}</span>
        )}
        <span className="text-cyan-400 font-bold">{slices.hostBits}</span>
      </div>
    </div>
  )
}
