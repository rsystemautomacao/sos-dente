interface StepperProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

const Stepper = ({ currentStep, totalSteps, steps }: StepperProps) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isFuture = index > currentStep

        return (
          <div
            key={index}
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`}
          >
            <div className={`step-number ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`}>
              {isCompleted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''}`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className={`step-connector ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
