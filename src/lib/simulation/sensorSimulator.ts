import type {
  FactoryReading, Alert, AlertNiveau,
  AanwezigheidSummary, AanwezigheidRecord, AanwezigheidCategorie,
} from "@/lib/types";
import { AFDELINGEN, EXTERN_TYPES, BEZOEKER_TYPES, AANWEZIGHEID_CAP } from "@/lib/data/facilities";
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

// ── Aanwezigheid (presence) live events ──────────────────────────────────────

const MEDEWERKER_NAMEN = [
  "J. van Dijk", "M. de Vries", "S. Bakker", "R. Jansen", "K. Visser", "T. Smit",
  "A. Meijer", "P. Mulder", "L. de Boer", "H. Bos", "E. Peters", "D. Hendriks", "F. van Leeuwen",
];

let aanwSeq = 0;

function fmtHM(d: Date): string {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam",
  }).format(d);
}

/** Probability that an event is a check-IN, by time of day. */
function inBias(hour: number): number {
  if (hour >= 7 && hour < 9) return 0.85; // ochtend: instroom medewerkers
  if (hour >= 16 && hour < 18) return 0.2; // einde dag: uitstroom
  if (hour >= 12 && hour < 13) return 0.45; // lunchpiek: lichte beweging
  return 0.5;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Produce the next presence state after a simulated check-in/out. Returns the
 * previous summary unchanged when the event would breach a soft cap or floor,
 * keeping counts realistic and bounded.
 */
export function nextAanwezigheidEvent(prev: AanwezigheidSummary, now: Date): AanwezigheidSummary {
  const r = Math.random();
  const categorie: AanwezigheidCategorie = r < 0.7 ? "medewerker" : r < 0.9 ? "extern" : "bezoeker";
  const actie: "in" | "uit" = Math.random() < inBias(now.getHours()) ? "in" : "uit";
  const delta = actie === "in" ? 1 : -1;

  const next: AanwezigheidSummary = {
    ...prev,
    medewerkers: { totaal: prev.medewerkers.totaal, perAfdeling: { ...prev.medewerkers.perAfdeling } },
    externen: { totaal: prev.externen.totaal, perType: { ...prev.externen.perType } },
    bezoekers: { totaal: prev.bezoekers.totaal, perType: { ...prev.bezoekers.perType } },
    log: prev.log,
  };

  let naam = "";
  let afdeling: string | undefined;
  let type: string | undefined;

  if (categorie === "medewerker") {
    if (delta > 0 && next.medewerkers.totaal >= AANWEZIGHEID_CAP.medewerker) return prev;
    const key = pick(AFDELINGEN);
    const cur = next.medewerkers.perAfdeling[key] ?? 0;
    if (delta < 0 && cur <= 0) return prev;
    next.medewerkers.perAfdeling[key] = Math.max(0, cur + delta);
    next.medewerkers.totaal = Math.max(0, next.medewerkers.totaal + delta);
    afdeling = key;
    naam = pick(MEDEWERKER_NAMEN);
  } else if (categorie === "extern") {
    if (delta > 0 && next.externen.totaal >= AANWEZIGHEID_CAP.extern) return prev;
    const key = pick(EXTERN_TYPES);
    const cur = next.externen.perType[key] ?? 0;
    if (delta < 0 && cur <= 0) return prev;
    next.externen.perType[key] = Math.max(0, cur + delta);
    next.externen.totaal = Math.max(0, next.externen.totaal + delta);
    type = key;
    naam = key.startsWith("Uitzend")
      ? `Uitzendkracht #${1 + Math.floor(Math.random() * 8)}`
      : key.startsWith("ZZP")
        ? `ZZP monteur ${pick(["A.", "B.", "C."])}`
        : "Aannemer hal C";
  } else {
    if (delta > 0 && next.bezoekers.totaal >= AANWEZIGHEID_CAP.bezoeker) return prev;
    const key = pick(BEZOEKER_TYPES);
    const cur = next.bezoekers.perType[key] ?? 0;
    if (delta < 0 && cur <= 0) return prev;
    next.bezoekers.perType[key] = Math.max(0, cur + delta);
    next.bezoekers.totaal = Math.max(0, next.bezoekers.totaal + delta);
    type = key;
    naam = key.startsWith("Klant")
      ? "Klant (showroom)"
      : key.startsWith("Leverancier")
        ? "Leverancier"
        : "Sollicitant";
  }

  next.totaalOpLocatie = next.medewerkers.totaal + next.externen.totaal + next.bezoekers.totaal;

  const record: AanwezigheidRecord = {
    id: `aanw-${aanwSeq++}`,
    categorie,
    naam,
    afdeling,
    type,
    tijdstip: fmtHM(now),
    actie,
  };
  next.log = [record, ...prev.log].slice(0, 12);
  return next;
}
