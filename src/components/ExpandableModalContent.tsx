import { useState, useEffect, useRef } from 'react'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

interface ExpandableModalContentProps {
  children: React.ReactNode
  maxHeight?: string
  showExpandButton?: boolean
  expandButtonText?: string
  collapseButtonText?: string
}

const ExpandableModalContent = ({
  children,
  maxHeight = '300px',
  showExpandButton = true,
  expandButtonText = 'VER MAIS',
  collapseButtonText = 'VER MENOS'
}: ExpandableModalContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsExpansion, setNeedsExpansion] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIfNeedsExpansion = () => {
      if (contentRef.current) {
        const scrollHeight = contentRef.current.scrollHeight
        const clientHeight = contentRef.current.clientHeight
        setNeedsExpansion(scrollHeight > clientHeight)
      }
    }

    checkIfNeedsExpansion()
    
    // Recheck on window resize
    window.addEventListener('resize', checkIfNeedsExpansion)
    return () => window.removeEventListener('resize', checkIfNeedsExpansion)
  }, [])

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="expandable-modal-content">
      <div 
        ref={contentRef}
        className={`expandable-content ${isExpanded ? 'expanded' : 'collapsed'}`}
        style={{
          maxHeight: isExpanded ? 'none' : maxHeight,
          overflow: isExpanded ? 'visible' : 'hidden',
          position: 'relative'
        }}
      >
        {children}
        
        {/* Gradient overlay when collapsed */}
        {!isExpanded && needsExpansion && (
          <div className="expandable-gradient-overlay" />
        )}
      </div>
      
      {showExpandButton && needsExpansion && (
        <div className="expandable-button-container">
          <button 
            className="expandable-button"
            onClick={toggleExpansion}
            type="button"
          >
            {isExpanded ? (
              <>
                <IconChevronUp size={16} />
                {collapseButtonText}
              </>
            ) : (
              <>
                <IconChevronDown size={16} />
                {expandButtonText}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default ExpandableModalContent
