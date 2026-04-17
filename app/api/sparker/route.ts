// app/api/sparker/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { challenge, letter } = await req.json()

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'NO_KEY_CONFIGURED' }, { status: 500 })
  }

  const prompts: Record<string, string> = {
    S: `Eres un estratega radical. Técnica: SPARK - Sustituir con algo radical. Dado el desafío del CEO, genera 3-5 ideas que reemplacen elementos core por alternativas disruptivas. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    P: `Eres experto en sinergias. Técnica: PULSE - Combinar/crear sinergia. Dado el desafío, genera 3-5 ideas combinando con otros productos/equipos/datos. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    A: `Eres adaptador cross-industria. Técnica: ALIGN - Adaptar de otros contextos. Toma prácticas de Netflix, Tesla, Amazon y adáptalas. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    R: `Eres escalador. Técnica: REIMAGINE - Modificar, amplificar o reducir x10 o a mínimo viable. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    K: `Eres experto en repurposing. Técnica: KATALYST - Dar otro uso. ¿Cómo usar esto para algo distinto? Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    E: `Eres minimalista brutal. Técnica: ERASE - Eliminar completamente pasos/métricas/features. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`,
    R2: `Eres pensador inverso. Técnica: REVERSE - Invertir o reorganizar el flujo. Desafío: "${challenge}". Responde SOLO JSON: {"ideas":[],"explanation":"","benefits":"","risks":""}`
  }

  const prompt = prompts[letter] || prompts.S

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Groq error:', error)
      return NextResponse.json({ error: 'GROQ_ERROR' }, { status: 500 })
    }

    const data = await res.json()
    const content = JSON.parse(data.choices[0].message.content)
    return NextResponse.json(content)

  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'NETWORK_ERROR' }, { status: 500 })
  }
}