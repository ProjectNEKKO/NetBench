import { AppHeader } from '@/shared/components/AppHeader'
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { ActionControls } from './modules/subnet-drill/components/ActionControls'
import { AnswerForm } from './modules/subnet-drill/components/AnswerForm'
import { BitVisualizer } from './modules/subnet-drill/components/BitVisualizer'
import { ProblemCard } from './modules/subnet-drill/components/ProblemCard'
import { StepExplainer } from './modules/subnet-drill/components/StepExplainer'
import { useDrillStore } from './modules/subnet-drill/store/useDrillStore'

export function App() {
  const {
    tier,
    problem,
    answers,
    validation,
    status,
    streak,
    bestStreak,
    setTier,
    setAnswer,
    checkAnswers,
    revealSolution,
    nextProblem,
  } = useDrillStore()

  // Handle Enter and Space hotkeys
  useKeyboardShortcuts({
    onEnter: () => {
      if (status === 'correct' || status === 'revealed') {
        nextProblem()
      } else {
        const isCorrect = checkAnswers()
        if (isCorrect) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
          })
        }
      }
    },
    onSpace: () => {
      if (status !== 'correct' && status !== 'revealed') {
        revealSolution()
      }
    },
  })

  // Trigger celebration on correct check
  useEffect(() => {
    if (status === 'correct') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.75 },
      })
    }
  }, [status])

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <AppHeader streak={streak} bestStreak={bestStreak} />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <ProblemCard
          problem={problem}
          selectedTier={tier}
          onSelectTier={setTier}
        />

        <BitVisualizer ip={problem.ip} cidr={problem.cidr} />

        <AnswerForm
          answers={answers}
          validation={validation}
          onChange={setAnswer}
          disabled={status === 'correct' || status === 'revealed'}
        />

        {(status === 'revealed' || status === 'correct' || status === 'incorrect') && (
          <StepExplainer result={problem.expected} />
        )}

        <ActionControls
          status={status}
          onCheck={checkAnswers}
          onReveal={revealSolution}
          onNext={nextProblem}
        />
      </main>
    </div>
  )
}

export default App
