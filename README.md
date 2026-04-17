# SPARKER™

**Strategic Ideation Engine**  
Transforms any unstructured business challenge into a powerful 7-vector ideation matrix using the SPARKER framework.

### Portfolio Project — 2026

Part of my **quick-ship SaaS experiments** series.  

Goal: Demonstrate clear product vision, fast execution using AI as a multiplier, and delivery of premium interfaces with clean, resilient code.

**Built in one focused vibecoding session** (~1.5–2 hours of active development).

### Core Concept

**Input**: Unstructured business challenge  

**Output**: 7 SPARKER cards (Spark • Pulse • Align • Reimagine • Katalyst • Erase • Reverse)

Each card delivers 4–5 concrete ideas + powerful rationale + benefits & risks.

### Technical Highlights

- **LLM-agnostic architecture** — Easy to switch between mock, Groq, Claude, Gemini, etc.
- **Schema-resilient parsing** — Handles any LLM output shape without crashing
- **Parallel generation** — All 7 techniques generated simultaneously
- **Atomic regeneration** — Regenerate a single card without re-running everything
- **Zero heavy state dependencies** — Only React hooks + localStorage

### Tech Stack

- **Framework**: Next.js 14/15 App Router + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Layer**: Configurable service (mock by default)

### Quick Start

```bash

git clone https://github.com/akashicaigroup/SPARKER.git
cd SPARKER
npm install
npm run dev
