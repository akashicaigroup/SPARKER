// config/ai.ts
export const AI_MODELS = {
  byok_groq: {
    id: 'byok_groq',
    name: 'Groq - Tu API Key',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    requiresKey: true,
  },
  byok_openrouter: {
    id: 'byok_openrouter',
    name: 'OpenRouter - Tu API Key',
    provider: 'openrouter',
    model: 'deepseek/deepseek-r1:free',
    requiresKey: true,
  },
  mock: {
    id: 'mock',
    name: 'Demo sin API Key',
    provider: 'mock',
    requiresKey: false,
  },
} as const

export type AIModelKey = keyof typeof AI_MODELS
export const DEFAULT_MODEL: AIModelKey = 'mock'

// Gestión de keys del usuario - ESTO FALTABA
export const getUserApiKey = (provider: string): string | null => {
  if (typeof window === 'undefined') return null
  const key = localStorage.getItem(`sparker_key_${provider}`)
  return key ? atob(key) : null
}

export const setUserApiKey = (provider: string, key: string) => {
  localStorage.setItem(`sparker_key_${provider}`, btoa(key))
}

export const hasUserKey = (provider: string): boolean => {
  return !!getUserApiKey(provider)
}