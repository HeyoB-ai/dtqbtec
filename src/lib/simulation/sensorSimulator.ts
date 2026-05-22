import type { FactoryReading, Alert, AlertNiveau } from "@/lib/types";
import { clamp } from "@/lib/utils";

function noise(amp: number): number {
  return (Math.random() - 0.5) * 2 * amp;
}

/** Pull a value gently back toward a base target with bounded noise. */
function wander(prev: number | undefined, base: number, amp: number, min: number, max: number, decimals = 0): number {
  const start = prev ?? base;
  const next = start + (base - start) * 0.15 + noise(amp);
  const f = Math.pow(10, decimals);
  return Math.round(clamp(next, min, max) * f) / f;
}

/** Daytime factor 0..1 (used for the diurnal outdoor-temperature curve). */
function dayFactor(hour: number): number {
  return clamp(0.4 + 0.6 * Math.sin(((hour - 6) / 24) * Math.PI * 2), 0, 1);
}

/**
 * Generate a live factory KPI reading. Values wander around realistic base
 * levels so the dashboard feels alive without drifting away from the demo story.
 */
export function generateReading(prev: FactoryReading | null, now: Date): FactoryReading {
  const hour = now.getHours();
  const day = dayFactor(hour);

  return {
    timestamp: now.getTime(),
    ordersInProductie: wander(prev?.ordersInProductie, 12, 0.4, 11, 13),
    gereedVandaag: wander(prev?.gereedVandaag, 3, 0.2, 2, 5),
    grondstofDekking: wander(prev?.grondstofDekking, 94, 0.6, 90, 97),
    monteursOnderweg: wander(prev?.monteursOnderweg, 7, 0.4, 6, 9),
    monteursTotaal: 12,
    openMeldingen: wander(prev?.openMeldingen, 4, 0.5, 3, 7),
    kritiekeMeldingen: wander(prev?.kritiekeMeldingen, 1, 0.3, 0, 2),
    bezetting: wander(prev?.bezetting, 87, 1.2, 80, 94),
    levertijd: wander(prev?.levertijd, 18, 0.3, 16, 21),
    kwaliteitGeslaagd: wander(prev?.kwaliteitGeslaagd, 96.2, 0.25, 94.5, 98.5, 1),
    servicelijnActief: wander(prev?.servicelijnActief, 2, 0.8, 0, 4),
    servicelijnWacht: Math.random() > 0.78 ? 1 : 0,
    verkoopActief: wander(prev?.verkoopActief, 1, 0.7, 0, 3),
    gemiddeldeWachttijd: wander(prev?.gemiddeldeWachttijd, 42, 4, 22, 78),
    gemisteOproepen: wander(prev?.gemisteOproepen, 2, 0.2, 1, 4),
    parkeerBezet: wander(prev?.parkeerBezet, 31, 1.2, 26, 38),
    werkbussenAanwezig: wander(prev?.werkbussenAanwezig, 5, 0.4, 4, 7),
    aanwezigPersoneel: wander(prev?.aanwezigPersoneel, 67, 0.6, 64, 71),
    buitenTemp: wander(prev?.buitenTemp, 14 + day * 6, 0.4, 8, 26, 1),
  };
}

// ── Live alert ticker events ────────────────────────────────────────────────

interface AlertTemplate {
  bericht: string;
  niveau: AlertNiveau;
}

const ALERT_POOL: AlertTemplate[] = [
  { bericht: "Laser cutter 2 — gereed met batch RVS platen Kiremko order K-2847", niveau: "succes" },
  { bericht: "Servicemonteur J. van den Berg — aankomst bij klant Rotterdam 14:23", niveau: "info" },
  { bericht: "Nieuwe order ontvangen: Perfecta bakwand maatwerk — Amsterdam", niveau: "info" },
  { bericht: "Bending systeem Safan Darley — 98% bezetting", niveau: "info" },
  { bericht: "Lasstation 4 — storing draadaanvoer gemeld, monteur onderweg", niveau: "kritiek" },
  { bericht: "Aluminium 1,5mm — voorraad kritiek (156 kg), nabestelling geplaatst", niveau: "waarschuwing" },
  { bericht: "Thermostaten — voorraad onder minimum (8/15), levering Elektrotherm di", niveau: "waarschuwing" },
  { bericht: "Order S-0847 Smitto — kwaliteitskeuring geslaagd, klaar voor expeditie", niveau: "succes" },
  { bericht: "Remote diagnostics — Kiremko K600 Rotterdam: temperatuurafwijking +8°C", niveau: "kritiek" },
  { bericht: "Spoed callout Breda — A. Visser onderweg, ETA 12 min", niveau: "waarschuwing" },
  { bericht: "Assemblagelijn 1 — Kiremko bakwand K-2847 naar 65% voltooid", niveau: "info" },
  { bericht: "Levering Van Loon Staal (RVS 400 kg) bevestigd — maandag 08:00", niveau: "info" },
  { bericht: "Eindtest gas/elektra — order P-1918 Perfecta geslaagd", niveau: "succes" },
  { bericht: "Florigo nieuwe productlijn — opleiding monteur L. Bos gestart", niveau: "info" },
  { bericht: "Laaddok 2 — transport 13:30 naar Scheveningen ingepland", niveau: "info" },
];

let alertSeq = 0;

export function initAlerts(count = 8): Alert[] {
  const now = Date.now();
  return ALERT_POOL.slice(0, count).map((t, i) => ({
    id: `alert-${alertSeq++}`,
    bericht: t.bericht,
    niveau: t.niveau,
    tijd: now - i * 45000,
  }));
}

/** Occasionally returns a fresh alert to prepend to the ticker (else null). */
export function maybeNewAlert(): Alert | null {
  if (Math.random() > 0.35) return null;
  const t = ALERT_POOL[Math.floor(Math.random() * ALERT_POOL.length)];
  return { id: `alert-${alertSeq++}`, bericht: t.bericht, niveau: t.niveau, tijd: Date.now() };
}
