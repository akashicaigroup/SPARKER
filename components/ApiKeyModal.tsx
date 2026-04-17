// components/api-key-modal.tsx
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { setUserApiKey } from '@/config/ai'
import { Key, ExternalLink } from 'lucide-react'

export default function ApiKeyModal({
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
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            Conecta tu API Key de {provider}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            SPARKER es 100% BYOK. Tu key se guarda solo en tu navegador. Nosotros no la vemos ni la guardamos.
          </p>
          <Input
            type="password"
            placeholder="gsk_xxx o sk-or-xxx"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-zinc-800 border-zinc-700"
          />
          <div className="flex items-center justify-between">
            <a
              href={links[provider]}
              target="_blank"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              Conseguir key gratis <ExternalLink className="w-3 h-3" />
            </a>
            <Button onClick={saveKey} disabled={!key}>
              Guardar y usar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}