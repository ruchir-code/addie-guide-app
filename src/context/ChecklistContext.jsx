import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ChecklistContext = createContext(null)

export function ChecklistProvider({ children }) {
  const [checklists, setChecklists] = useLocalStorage('addie-checklists', {})

  function getChecklist(phase) {
    return checklists[phase] || {}
  }

  function toggleItem(phase, itemId) {
    setChecklists((prev) => ({
      ...prev,
      [phase]: {
        ...(prev[phase] || {}),
        [itemId]: !((prev[phase] || {})[itemId]),
      },
    }))
  }

  function resetPhase(phase) {
    setChecklists((prev) => ({
      ...prev,
      [phase]: {},
    }))
  }

  return (
    <ChecklistContext.Provider value={{ getChecklist, toggleItem, resetPhase }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  return useContext(ChecklistContext)
}
