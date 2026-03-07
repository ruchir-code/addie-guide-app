import { useEffect, useRef, useState } from 'react'

/**
 * Lightweight scroll-reveal hook using native IntersectionObserver.
 * Returns { ref, isVisible } — attach ref to an element, toggle classes based on isVisible.
 * Fires once: after the element enters the viewport it stays visible permanently.
 */
export default function useScrollReveal({ threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
