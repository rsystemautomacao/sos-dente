interface StepperProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  onStepClick?: (stepIndex: number) => void
}

const Stepper = ({ currentStep, totalSteps: _totalSteps, steps, onStepClick }: StepperProps) => {
  const handleStepClick = (stepIndex: number) => {
    // Só permite navegar para etapas já preenchidas (anteriores à atual)
    if (stepIndex < currentStep && onStepClick) {
      onStepClick(stepIndex)
    }
  }

  const progressPercent = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0

  return (
    <div className="wizard-stepper">
      <div className="wizard-stepper-info">
        <span className="wizard-stepper-label">{steps[currentStep]}</span>
        <span className="wizard-stepper-count">
          Passo {currentStep + 1} de {steps.length}
        </span>
      </div>

      <div className="wizard-stepper-track">
        <div className="wizard-stepper-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="wizard-stepper-dots">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isClickable = isCompleted && !!onStepClick

          return (
            <button
              key={index}
              type="button"
              className={`wizard-stepper-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => handleStepClick(index)}
              disabled={!isClickable}
              aria-label={`${step}${isCompleted ? ' (concluído)' : isActive ? ' (etapa atual)' : ''}`}
              aria-current={isActive ? 'step' : undefined}
              title={step}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
