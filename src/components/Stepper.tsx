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
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-number">
              {isCompleted ? '✓' : index + 1}
            </div>
            <span className="step-label">{step}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
