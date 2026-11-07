import type { DifficultyTier } from '@/shared/lib/ip-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type DrillProblem, generateProblem } from '../core/generator'

export interface UserAnswers {
  subnetMask: string
  wildcardMask: string
  networkId: string
  broadcastAddress: string
  firstUsableHost: string
  lastUsableHost: string
  usableHosts: string
}

export interface ValidationStatus {
  subnetMask: boolean | null
  wildcardMask: boolean | null
  networkId: boolean | null
  broadcastAddress: boolean | null
  firstUsableHost: boolean | null
  lastUsableHost: boolean | null
  usableHosts: boolean | null
}

export type DrillStatus = 'idle' | 'correct' | 'incorrect' | 'revealed'

interface DrillState {
  tier: DifficultyTier
  problem: DrillProblem
  answers: UserAnswers
  validation: ValidationStatus
  status: DrillStatus
  revealed: boolean
  streak: number
  bestStreak: number
  totalSolved: number
  totalAttempted: number

  // Actions
  setTier: (tier: DifficultyTier) => void
  setAnswer: (field: keyof UserAnswers, value: string) => void
  checkAnswers: () => boolean
  revealSolution: () => void
  nextProblem: () => void
  resetStats: () => void
}

const initialAnswers: UserAnswers = {
  subnetMask: '',
  wildcardMask: '',
  networkId: '',
  broadcastAddress: '',
  firstUsableHost: '',
  lastUsableHost: '',
  usableHosts: '',
}

const initialValidation: ValidationStatus = {
  subnetMask: null,
  wildcardMask: null,
  networkId: null,
  broadcastAddress: null,
  firstUsableHost: null,
  lastUsableHost: null,
  usableHosts: null,
}

export const useDrillStore = create<DrillState>()(
  persist(
    (set, get) => ({
      tier: 'tier1',
      problem: generateProblem('tier1'),
      answers: initialAnswers,
      validation: initialValidation,
      status: 'idle',
      revealed: false,
      streak: 0,
      bestStreak: 0,
      totalSolved: 0,
      totalAttempted: 0,

      setTier: (tier) => {
        set({
          tier,
          problem: generateProblem(tier),
          answers: initialAnswers,
          validation: initialValidation,
          status: 'idle',
          revealed: false,
        })
      },

      setAnswer: (field, value) => {
        set((state) => ({
          answers: { ...state.answers, [field]: value },
        }))
      },

      checkAnswers: () => {
        const { problem, answers, streak, bestStreak, totalSolved, totalAttempted } = get()
        const expected = problem.expected

        const vMask = answers.subnetMask.trim() === expected.subnetMask
        const vWild = answers.wildcardMask.trim() === expected.wildcardMask
        const vNet = answers.networkId.trim() === expected.networkId
        const vBcast = answers.broadcastAddress.trim() === expected.broadcastAddress
        const vFirst = answers.firstUsableHost.trim() === expected.firstUsableHost
        const vLast = answers.lastUsableHost.trim() === expected.lastUsableHost
        const vHosts = answers.usableHosts.trim().replace(/,/g, '') === String(expected.usableHosts)

        const isAllCorrect = vMask && vWild && vNet && vBcast && vFirst && vLast && vHosts

        const newStreak = isAllCorrect ? streak + 1 : 0
        const newBestStreak = Math.max(bestStreak, newStreak)

        set({
          validation: {
            subnetMask: vMask,
            wildcardMask: vWild,
            networkId: vNet,
            broadcastAddress: vBcast,
            firstUsableHost: vFirst,
            lastUsableHost: vLast,
            usableHosts: vHosts,
          },
          status: isAllCorrect ? 'correct' : 'incorrect',
          streak: newStreak,
          bestStreak: newBestStreak,
          totalSolved: isAllCorrect ? totalSolved + 1 : totalSolved,
          totalAttempted: totalAttempted + 1,
        })

        return isAllCorrect
      },

      revealSolution: () => {
        const { problem } = get()
        const exp = problem.expected

        set({
          revealed: true,
          status: 'revealed',
          streak: 0,
          answers: {
            subnetMask: exp.subnetMask,
            wildcardMask: exp.wildcardMask,
            networkId: exp.networkId,
            broadcastAddress: exp.broadcastAddress,
            firstUsableHost: exp.firstUsableHost,
            lastUsableHost: exp.lastUsableHost,
            usableHosts: String(exp.usableHosts),
          },
          validation: {
            subnetMask: true,
            wildcardMask: true,
            networkId: true,
            broadcastAddress: true,
            firstUsableHost: true,
            lastUsableHost: true,
            usableHosts: true,
          },
        })
      },

      nextProblem: () => {
        const { tier } = get()
        set({
          problem: generateProblem(tier),
          answers: initialAnswers,
          validation: initialValidation,
          status: 'idle',
          revealed: false,
        })
      },

      resetStats: () => {
        set({
          streak: 0,
          bestStreak: 0,
          totalSolved: 0,
          totalAttempted: 0,
        })
      },
    }),
    {
      name: 'netbench-subnet-drill-storage',
      partialize: (state) => ({
        tier: state.tier,
        streak: state.streak,
        bestStreak: state.bestStreak,
        totalSolved: state.totalSolved,
        totalAttempted: state.totalAttempted,
      }),
    },
  ),
)
