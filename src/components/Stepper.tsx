interface StepperProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  onStepClick?: (stepIndex: number) => void
}

const Stepper = ({ currentStep, totalSteps, steps, onStepClick }: StepperProps) => {
  const handleStepClick = (stepIndex: number) => {
    // Só permite navegar para etapas já preenchidas (anteriores à atual)
    if (stepIndex < currentStep && onStepClick) {
      onStepClick(stepIndex)
    }
  }

  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isFuture = index > currentStep
        const isClickable = isCompleted && onStepClick

        return (
          <div
            key={index}
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isFuture ? 'future' : ''} ${isClickable ? 'clickable' : ''}`}
            onClick={() => handleStepClick(index)}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
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
