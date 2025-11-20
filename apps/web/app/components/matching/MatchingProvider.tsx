'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface MatchingContextType {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined)

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <MatchingContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </MatchingContext.Provider>
  )
}

export function useMatching() {
  const context = useContext(MatchingContext)
  if (!context) {
    throw new Error('useMatching must be used within MatchingProvider')
  }
  return context
}
