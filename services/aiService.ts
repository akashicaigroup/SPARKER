// services/aiService.ts
import type { SPARKERSection, Letter } from '@/types/sparker'

async function callServerRoute(challenge: string, letter: Letter): Promise<any> {
  const res = await fetch('/api/sparker', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge, letter }), // sin userKey
  })

  if (!res.ok) throw new Error('API_ERROR')
  return res.json()
}

export async function callAI(
  challenge: string,
  options: { letter: Letter }
): Promise<SPARKERSection> {
  const result = await callServerRoute(challenge, options.letter)

  return {
    letter: options.letter,
    name: options.letter,
    technique: '',
    icon: '',
   ...result
  } as SPARKERSection
}