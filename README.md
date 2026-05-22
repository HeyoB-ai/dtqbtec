# QBtec Operations Intelligence

Een interactieve **factory digital twin** demo voor **QBtec B.V.** in Woerden — Europa's grootste producent van professionele frituur- en kookinstallaties (merken: Kiremko, Perfecta, Smitto, Qook!, Florigo, De Kuiper, Adieu, HiFri).

> **DEMO DATA** — niet gekoppeld aan live systemen. Alle cijfers zijn realistische, gesimuleerde voorbeelddata.

![dark industrial dashboard](https://img.shields.io/badge/theme-dark%20industrial-E8650A) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Schermen

1. **Operations Dashboard** — 8 live KPI's, productie per merk, orders per fase, actieve orders.
2. **Productieoverzicht** — interactieve SVG-fabrieksvloer (zones A–E), machinestatus, order-tracking per fase.
3. **Voorraad & Inkoop** — 30 grondstoffen/componenten met status, inkomende leveringen, gereed product.
4. **Servicedienst Live** — MapLibre-kaart met 12 monteurs (live bewegend), servicemeldingen, KPI's, remote diagnostics.
5. **Geïnstalleerde Base** — Europa-kaart met installaties per land, top-klanten, installatie-lifecycle.
6. **Faciliteiten** — vergaderzalen, parkeren, telefoonlijnen, personeelsbezetting.
7. **AI Scenario Simulator** — beschrijf een scenario, krijg impact-analyse over 6 operationele domeinen (Claude API + lokale fallback).

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-stijl componenten
- **Recharts** voor grafieken
- **MapLibre GL** voor kaarten (OpenFreeMap dark — geen API key nodig)
- **@anthropic-ai/sdk** voor de AI scenario-analyse
- Live simulatie-engine ververst elke 3 seconden

## Lokaal draaien

```bash
npm install
npm run dev
# http://localhost:3000
```

### AI Scenario Simulator (optioneel)

De simulator werkt **out of the box** met een ingebouwd lokaal model. Voor rijkere analyses via de Claude API:

```bash
cp .env.example .env.local
# vul ANTHROPIC_API_KEY in
```

Zonder key valt `/api/scenario` automatisch terug op de deterministische lokale engine.

## Build & deploy

```bash
npm run build && npm start
```

Deploy-ready voor **Netlify** (zie `netlify.toml`, `@netlify/plugin-nextjs`). Zet `ANTHROPIC_API_KEY` als environment variable in het deploy-platform voor de live AI-analyse.

## Projectstructuur

```
src/
  app/                  # routes (dashboard, productie, voorraad, service, installaties, faciliteiten, scenarios)
    api/scenario/       # Claude API route + lokale fallback
  components/           # layout, ui, charts, map, dashboard, productie
  hooks/                # useLiveData (live simulatie context), useServiceMap
  lib/
    data/               # orders, monteurs, installaties, voorraad, machines, servicemeldingen, facilities, brands
    simulation/         # sensorSimulator (live KPI's), scenarioEngine (AI fallback)
    scenario/           # scenario types & presets
```

---

QBtec B.V. · Middellandse Zee 9, 3446 CG Woerden · opgericht 1944.
