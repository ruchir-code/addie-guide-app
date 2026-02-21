import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const LevelContext = createContext(null)

export function LevelProvider({ children }) {
  const [level, setLevel] = useLocalStorage('addie-level', 'beginner')

  const toggle = () =>
    setLevel((prev) => (prev === 'beginner' ? 'advanced' : 'beginner'))

  return (
    <LevelContext.Provider value={{ level, toggle }}>
      {children}
    </LevelContext.Provider>
  )
}

export function useLevel() {
  return useContext(LevelContext)
}
