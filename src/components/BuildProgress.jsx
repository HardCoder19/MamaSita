const STEPS = [
  { number: 1, label: 'BASE' },
  { number: 2, label: 'PROTEIN' },
  { number: 3, label: 'SAUCE' },
]

/**
 * BuildProgress - consistent 3-step progress bar for the taco builder flow.
 * @param {number} currentStep - 1, 2, or 3
 */
const BuildProgress = ({ currentStep = 1 }) => {
  return (
    <div className="mb-10">
      {/* Step label row */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-headline font-bold text-sm tracking-widest uppercase">
          Step {String(currentStep).padStart(2, '0')}/03
        </span>
        <span className="font-headline font-bold text-xs bg-secondary text-on-secondary px-3 py-1 border-2 border-outline rotate-[-2deg] neo-shadow-sm uppercase">
          Selection: {STEPS[currentStep - 1].label}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-2 h-4 border-[3px] border-outline bg-surface-container-low p-1 neo-shadow-sm">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className={`flex-1 transition-colors duration-300 ${
              step.number < currentStep
                ? 'bg-outline'                   /* completed – dark */
                : step.number === currentStep
                ? 'bg-secondary'                 /* active – cyan */
                : 'bg-surface-dim opacity-30'    /* upcoming – muted */
            } ${step.number < 3 ? 'border-r-[2px] border-outline' : ''}`}
          />
        ))}
      </div>

      {/* Step name labels below bar */}
      <div className="flex justify-between mt-1.5">
        {STEPS.map((step) => (
          <span
            key={step.number}
            className={`font-headline font-bold text-[10px] uppercase tracking-widest ${
              step.number === currentStep
                ? 'text-on-background'
                : 'text-on-background opacity-40'
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default BuildProgress
