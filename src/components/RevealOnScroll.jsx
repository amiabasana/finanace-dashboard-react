import { useEffect, useRef, memo } from 'react'

export const RevealOnScroll = memo(function RevealOnScroll({ children, className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof window === 'undefined') return

    const elements = Array.from(container.querySelectorAll('[data-reveal]'))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${index * 90}ms`
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
})
