// app/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { RefreshCw, Plus, Key, ExternalLink, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { callAI } from '@/services/aiService'
import { AI_MODELS, DEFAULT_MODEL, setUserApiKey } from '@/config/ai'
import type { SPARKERSection, Session, AIModelKey, Letter } from '@/types/sparker'

function ApiKeyModal({
  open,
  onClose,
  provider
}: {
  open: boolean
  onClose: () => void
  provider: 'groq' | 'openrouter'
}) {
  const [key, setKey] = useState('')

  const links = {
    groq: 'https://console.groq.com/keys',
    openrouter: 'https://openrouter.ai/keys'
  }

  const saveKey = () => {
    if (!key.trim()) return
    setUserApiKey(provider, key.trim())
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black border-neutral-800 rounded-none max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] font-normal">
            <Key className="w-4 h-4" />
            CONNECT "{provider}" KEY
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-8 pt-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider leading-relaxed">
            "API KEY" REQUIRED.<br />STORED LOCALLY ONLY.
          </p>
          <Input
            type="password"
            placeholder="PASTE_KEY_HERE"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-black border-neutral-800 rounded-none h-14 text-sm uppercase tracking-wider"
          />
          <div className="flex items-center justify-between">
            <a
              href={links[provider]}
              target="_blank"
              className="text- text-neutral-400 hover:text-white uppercase tracking-[0.3em] flex items-center gap-1"
            >
              GET KEY <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              onClick={saveKey}
              disabled={!key}
              className="bg-white text-black hover:bg-neutral-200 rounded-none h-14 px-10 text-xs uppercase tracking-[0.4em]"
            >
              SAVE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const parseToString = (value: any): string => {
  if (!value) return ''

  if (typeof value === 'string') {
    let cleaned = value.replace(/^id:\s*\d+\s*concepto:\s*/i, '')
    cleaned = cleaned.replace(/^id:\s*\d+\s*/i, '')
    cleaned = cleaned.replace(/^concepto:\s*/i, '')
    cleaned = cleaned.replace(/^nombre:\s*/i, '')
    cleaned = cleaned.replace(/^title:\s*/i, '')

    if (cleaned.trim().startsWith('{') || cleaned.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(cleaned)
        return parseToString(parsed)
      } catch {
        return cleaned
      }
    }
    return cleaned
  }

  if (Array.isArray(value)) {
    return value.map(v => parseToString(v)).filter(Boolean).join('. ')
  }

  if (typeof value === 'object' && value!== null) {
    const result =
      value.description ||
      value.descripcion ||
      value.text ||
      value.content ||
      value.title ||
      value.name ||
      value.nombre ||
      value.idea ||
      value.concepto

    if (result) return parseToString(result)

    const values = Object.values(value)
   .map(v => parseToString(v))
   .filter(v => v && v.trim())

    if (values.length > 0) return values.join('. ')
    return ''
  }

  return String(value)
}

function SparkerCard({ section, onRegenerate }: { section: SPARKERSection, onRegenerate: () => void }) {
  const techniqueData = {
    S: { name: 'SPARK', desc: 'SUBSTITUTE', sub: 'REPLACE CORE ELEMENTS WITH RADICAL ALTERNATIVES' },
    P: { name: 'PULSE', desc: 'COMBINE', sub: 'MERGE WITH OTHER PRODUCTS, TEAMS OR DATA' },
    A: { name: 'ALIGN', desc: 'ADAPT', sub: 'BORROW FROM OTHER INDUSTRIES & CONTEXTS' },
    R: { name: 'REIMAGINE', desc: 'MODIFY', sub: 'SCALE UP X10 OR REDUCE TO MINIMUM VIABLE' },
    K: { name: 'KATALYST', desc: 'REPURPOSE', sub: 'FIND ALTERNATIVE USES FOR EXISTING ASSETS' },
    E: { name: 'ERASE', desc: 'ELIMINATE', sub: 'REMOVE STEPS, METRICS OR FEATURES ENTIRELY' },
  }

  const data = techniqueData[section.letter as keyof typeof techniqueData] || techniqueData.S

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-black"
    >
      <div className="p-12 space-y-10">
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <p className="text- text-neutral-800 uppercase tracking-[0.6em]">
              "{section.letter}"
            </p>
            <h3 className="text-6xl font-bold uppercase tracking-[-0.03em]">
              {data.name}
            </h3>
            <p className="text- text-neutral-700 uppercase tracking-[0.4em]">
              {data.desc}
            </p>
          </div>
          <button
            type="button"
            onClick={onRegenerate}
            className="text-neutral-900 hover:text-white transition-colors mt-2"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <p className="text- text-neutral-700 uppercase tracking-wider leading-relaxed pt-4 border-t border-neutral-950">
          {data.sub}
        </p>

        <div className="space-y-6 pt-8 border-t border-neutral-950">
          {section.ideas?.map((idea: any, i) => (
            <div key={i} className="flex gap-5">
              <span className="text-neutral-900 text-sm font-mono mt-1 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-base text-neutral-200 leading-relaxed">
                {parseToString(idea)}
              </p>
            </div>
          ))}
        </div>

        {section.explanation && (
          <div className="pt-10 border-t border-neutral-950 space-y-4">
            <p className="text- text-neutral-800 uppercase tracking-[0.5em]">
              "WHY IT WORKS"
            </p>
            <p className="text-base text-neutral-400 leading-relaxed">
              {parseToString(section.explanation)}
            </p>
          </div>
        )}

        {(section.benefits || section.risks) && (
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-950">
            {section.benefits && (
              <div className="space-y-3">
                <p className="text- text-neutral-800 uppercase tracking-[0.5em]">
                  "UPSIDE"
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {parseToString(section.benefits)}
                </p>
              </div>
            )}
            {section.risks && (
              <div className="space-y-3">
                <p className="text- text-neutral-800 uppercase tracking-[0.5em]">
                  "RISK"
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {parseToString(section.risks)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function SPARKERCommand() {
  const [challenge, setChallenge] = useState('')
  const [results, setResults] = useState<SPARKERSection[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState<AIModelKey>(DEFAULT_MODEL)
  const [sessions, setSessions] = useState<Session[]>([])
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<'groq' | 'openrouter'>('groq')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLoading(false)
    const saved = localStorage.getItem('sparker-sessions')
    if (saved) setSessions(JSON.parse(saved))
  }, [])

  const generateIdeas = () => {
    console.log('CLICKED')
    
    if (loading) {
      alert('ALREADY PROCESSING')
      return
    }

    if (!challenge || challenge.trim().length === 0) {
      alert('WRITE A CHALLENGE FIRST')
      return
    }

    setLoading(true)

    const letters: Letter[] = ['S', 'P', 'A', 'R', 'K', 'E', 'R']
    Promise.all(
      letters.map(letter => callAI(challenge, { letter }))
    )
   .then(data => {
      setResults(data as SPARKERSection[])
      const newSession: Session = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        challenge,
        results: data as SPARKERSection[],
      }
      const updated = [newSession,...sessions].slice(0, 8)
      setSessions(updated)
      localStorage.setItem('sparker-sessions', JSON.stringify(updated))
    })
   .catch((e: any) => {
      console.error('ERROR:', e)
      if (e.message === 'REQUIRES_KEY') {
        setSelectedProvider(AI_MODELS[model].provider as any)
        setKeyModalOpen(true)
      } else {
        alert(`ERROR: ${e.message}`)
      }
    })
   .finally(() => {
      setLoading(false)
    })
  }

  const regenerateLetter = (letter: Letter) => {
    if (!results ||!challenge || loading) return
    setLoading(true)
    callAI(challenge, { letter })
   .then(newSection => {
      const idx = results.findIndex(r => r.letter === letter)
      const updated = [...results]
      updated[idx] = newSection as SPARKERSection
      setResults(updated)
    })
   .catch((e: any) => {
      if (e.message === 'REQUIRES_KEY') setKeyModalOpen(true)
    })
   .finally(() => {
      setLoading(false)
    })
  }

  if (!mounted) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-neutral-950">
        <div className="max-w- mx-auto px-12 py-10 flex items-center justify-between">
          <div className="flex items-baseline gap-8">
            <h1 className="text-4xl font-bold tracking-[-0.06em]">SPARKER™</h1>
            <p className="text- text-neutral-900 uppercase tracking-[0.5em] hidden xl:block">
              "STRATEGIC IDEA ENGINE"
            </p>
          </div>
          <div className="flex items-center gap-10">
            <Select value={model} onValueChange={(v) => setModel(v as AIModelKey)}>
              <SelectTrigger className="w-64 bg-black border-neutral-950 rounded-none h-12 text-xs uppercase tracking-wider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-neutral-950 rounded-none">
                {Object.values(AI_MODELS).map(m => (
                  <SelectItem key={m.id} value={m.id} className="text-xs uppercase tracking-wider">
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => { setChallenge(''); setResults(null); setLoading(false) }}
              className="text- uppercase tracking-[0.5em] text-neutral-700 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Plus className="w-3 h-3" /> NEW
            </button>
          </div>
        </div>
      </header>

      <main className="max-w- mx-auto px-12">
        <div className="max-w-6xl mx-auto py-48">
          <p className="text- text-neutral-900 uppercase tracking-[0.6em] mb-12">
            "BRIEF"
          </p>
          <h2 className="text-9xl font-bold mb-24 tracking-[-0.07em] leading-[0.75]">
            WHAT IDEA<br />DO YOU WANT TO<br />TRANSFORM TODAY?
          </h2>
          <Textarea
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="DESCRIBE THE STRATEGIC CHALLENGE..."
            className="min-h-48 text-2xl bg-black border-neutral-950 focus:border-white rounded-none resize-none uppercase tracking-wide placeholder:text-neutral-950 p-10"
          />
          <button
            type="button"
            onClick={generateIdeas}
            className="w-full mt-12 h-28 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 transition-colors duration-300 flex items-center justify-center gap-5 text-sm uppercase tracking-[0.5em] font-medium"
          >
            {loading? (
              <>PROCESSING<RefreshCw className="animate-spin w-5 h-5" /></>
            ) : (
              <>GENERATE<ArrowUpRight className="w-5 h-5" /></>
            )}
          </button>
        </div>

        {results && (
          <div className="py-48 border-t border-neutral-950">
            <p className="text- text-neutral-900 uppercase tracking-[0.6em] mb-16">
              "OUTPUT"
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 border-t border-l border-neutral-950">
              {results.map((section, i) => (
                <div key={`${section.letter}-${i}`} className="border-r border-b border-neutral-950">
                  <SparkerCard
                    section={section}
                    onRegenerate={() => regenerateLetter(section.letter)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-950 py-16 mt-40">
        <div className="max-w- mx-auto px-12">
          <p className="text- text-neutral-950 uppercase tracking-[0.5em]">
            SPARKER™ {new Date().getFullYear()} "ALL RIGHTS RESERVED"
          </p>
        </div>
      </footer>

      <ApiKeyModal
        open={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        provider={selectedProvider}
      />
    </div>
  )
}