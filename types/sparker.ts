// types/sparker.ts
export type Letter = 'S' | 'P' | 'A' | 'R' | 'K' | 'E' | 'R'

export interface SPARKERSection {
  letter: Letter
  name: string
  technique: string
  icon: string
  ideas: string[]
  explanation: string
  benefits: string
  risks: string
}

export interface Session {
  id: string
  date: string
  challenge: string
  results: SPARKERSection[]
}

export type AIModelKey = 'byok_groq' | 'byok_openrouter' | 'mock'