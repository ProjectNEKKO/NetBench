import type { SubnetCalculationResult } from '@/shared/lib/ip-types'
import { BookOpen, Lightbulb } from 'lucide-react'

interface StepExplainerProps {
  result: SubnetCalculationResult
}

export function StepExplainer({ result }: StepExplainerProps) {
  const { breakdown, cidr, ip, subnetMask, networkId, broadcastAddress, firstUsableHost, lastUsableHost, usableHosts } = result

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-semibold">
        <Lightbulb className="w-5 h-5" />
        <span>Step-by-Step Pedagogical Diagnostic</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Step 1: Significant Octet & Magic Number */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>1. Significant Octet & Magic Number</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            For CIDR <strong className="text-cyan-400">/{cidr}</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Working Octet: Octet <strong className="text-slate-200">#{breakdown.significantOctet}</strong></li>
            <li>Subnet Mask: <strong className="text-slate-200">{subnetMask}</strong></li>
            <li>Magic Number / Block Size: <strong className="text-emerald-400">{breakdown.blockSize}</strong></li>
          </ul>
        </div>

        {/* Step 2: Range & Boundaries */}
        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>2. Subnet Boundaries</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Counting in multiples of <strong className="text-emerald-400">{breakdown.blockSize}</strong> for target IP <strong className="text-slate-200">{ip}</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Network ID: <strong className="text-emerald-400">{networkId}</strong></li>
            <li>Broadcast: <strong className="text-rose-400">{broadcastAddress}</strong></li>
            <li>Usable Hosts: <strong className="text-cyan-400">{firstUsableHost}</strong> &rarr; <strong className="text-cyan-400">{lastUsableHost}</strong> ({usableHosts} hosts)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
