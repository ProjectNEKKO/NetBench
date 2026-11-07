import { OctetInput } from '@/shared/components/OctetInput'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { UserAnswers, ValidationStatus } from '../store/useDrillStore'

interface AnswerFormProps {
  answers: UserAnswers
  validation: ValidationStatus
  onChange: (field: keyof UserAnswers, value: string) => void
  disabled?: boolean
}

export function AnswerForm({ answers, validation, onChange, disabled = false }: AnswerFormProps) {
  const renderValidationIcon = (isValid: boolean | null) => {
    if (isValid === null) return null
    if (isValid) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    }
    return <XCircle className="w-4 h-4 text-rose-500" />
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
        <span>Subnet Parameters</span>
        <span className="text-xs text-slate-500 lowercase">use &apos;.&apos; or tab to advance octet</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Subnet Mask */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>1. Subnet Mask (Dotted Decimal)</span>
            {renderValidationIcon(validation.subnetMask)}
          </div>
          <OctetInput
            value={answers.subnetMask}
            onChange={(val) => onChange('subnetMask', val)}
            disabled={disabled}
            hasError={validation.subnetMask === false}
            isCorrect={validation.subnetMask === true}
            autoFocus
          />
        </div>

        {/* 2. Wildcard Mask */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>2. Wildcard Mask (Cisco / Inverse)</span>
            {renderValidationIcon(validation.wildcardMask)}
          </div>
          <OctetInput
            value={answers.wildcardMask}
            onChange={(val) => onChange('wildcardMask', val)}
            disabled={disabled}
            hasError={validation.wildcardMask === false}
            isCorrect={validation.wildcardMask === true}
          />
        </div>

        {/* 3. Network ID */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>3. Network ID (Subnet Address)</span>
            {renderValidationIcon(validation.networkId)}
          </div>
          <OctetInput
            value={answers.networkId}
            onChange={(val) => onChange('networkId', val)}
            disabled={disabled}
            hasError={validation.networkId === false}
            isCorrect={validation.networkId === true}
          />
        </div>

        {/* 4. Broadcast Address */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>4. Broadcast Address</span>
            {renderValidationIcon(validation.broadcastAddress)}
          </div>
          <OctetInput
            value={answers.broadcastAddress}
            onChange={(val) => onChange('broadcastAddress', val)}
            disabled={disabled}
            hasError={validation.broadcastAddress === false}
            isCorrect={validation.broadcastAddress === true}
          />
        </div>

        {/* 5. Usable Host Range (First & Last) */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>5. Usable Host Range</span>
            <div className="flex items-center gap-2">
              {renderValidationIcon(validation.firstUsableHost)}
              {renderValidationIcon(validation.lastUsableHost)}
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <OctetInput
              value={answers.firstUsableHost}
              onChange={(val) => onChange('firstUsableHost', val)}
              disabled={disabled}
              hasError={validation.firstUsableHost === false}
              isCorrect={validation.firstUsableHost === true}
              className="flex-1"
            />
            <span className="text-slate-500 font-mono text-sm px-1">to</span>
            <OctetInput
              value={answers.lastUsableHost}
              onChange={(val) => onChange('lastUsableHost', val)}
              disabled={disabled}
              hasError={validation.lastUsableHost === false}
              isCorrect={validation.lastUsableHost === true}
              className="flex-1"
            />
          </div>
        </div>

        {/* 6. Total Usable Hosts */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>6. Total Usable Hosts</span>
            {renderValidationIcon(validation.usableHosts)}
          </div>
          <div className="relative">
            <input
              type="text"
              value={answers.usableHosts}
              onChange={(e) => onChange('usableHosts', e.target.value)}
              disabled={disabled}
              placeholder="e.g. 254"
              className={`w-full bg-slate-900 border rounded-lg px-3 py-2 font-mono text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all ${
                validation.usableHosts === false
                  ? 'border-rose-500 ring-1 ring-rose-500/40 bg-rose-950/20'
                  : validation.usableHosts === true
                  ? 'border-emerald-500 ring-1 ring-emerald-500/40 bg-emerald-950/20'
                  : 'border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
