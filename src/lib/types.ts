// ── Core domain types for QBtec Operations Intelligence ─────────────────────

/** The 8 QBtec brands. */
export type Brand =
  | "Kiremko"
  | "Perfecta"
  | "Smitto"
  | "Qook!"
  | "Florigo"
  | "De Kuiper"
  | "Adieu"
  | "HiFri";

export const BRANDS: Brand[] = [
  "Kiremko",
  "Perfecta",
  "Smitto",
  "Qook!",
  "Florigo",
  "De Kuiper",
  "Adieu",
  "HiFri",
];

/** Production phases an order moves through, in order. */
export type OrderFase =
  | "Ontwerp"
  | "Inkoop"
  | "Plaatbewerking"
  | "Lassen"
  | "Assemblage"
  | "QC"
  | "Expeditie"
  | "Geleverd";

export const FASES: OrderFase[] = [
  "Ontwerp",
  "Inkoop",
  "Plaatbewerking",
  "Lassen",
  "Assemblage",
  "QC",
  "Expeditie",
  "Geleverd",
];

export interface Order {
  id: string;
  brand: Brand;
  product: string;
  klant: string;
  stad: string;
  land: string;
  fase: OrderFase;
  voortgang: number; // 0-100
  startdatum: string; // ISO
  leverdatum: string; // ISO (verwacht)
  waarde: number; // €
  maatwerk: string; // korte spec
  spoed?: boolean;
}

// ── Service technicians ──────────────────────────────────────────────────────

export type MonteurStatus =
  | "bij klant"
  | "onderweg"
  | "gereed"
  | "spoed"
  | "overnacht"
  | "beschikbaar"
  | "workshop"
  | "opleiding";

export interface Monteur {
  id: string;
  naam: string;
  expertise: string; // brand specialism of "Algemeen"
  /** [lng, lat] current position */
  center: [number, number];
  /** target [lng, lat] when underway (for live movement). */
  doel?: [number, number];
  status: MonteurStatus;
  stad: string;
  opdracht: string;
  werkbus: number; // % gevuld
  etaMin?: number; // ETA in minuten (indien onderweg/bij klant)
  reistijdTerug: number; // minuten naar Woerden
}

// ── Installed base ───────────────────────────────────────────────────────────

export interface Installatie {
  id: string;
  product: string;
  brand: Brand;
  klant: string;
  stad: string;
  land: string;
  /** [lng, lat] */
  center: [number, number];
  installDatum: string; // ISO
  servicecontract: boolean;
  contractType: string; // "Premium 24/7" | "Standaard" | "Geen"
  laatsteOnderhoud: string; // ISO
  volgendeOnderhoud: string; // ISO
  bezoeken: number;
  vervangenOnderdelen: { onderdeel: string; jaar: number }[];
  status: "operationeel" | "onderhoud" | "storing";
}

export interface LandData {
  land: string;
  code: string; // ISO-ish for label
  center: [number, number]; // [lng, lat]
  installaties: number;
}

// ── Inventory / procurement ──────────────────────────────────────────────────

export type VoorraadStatus = "OK" | "Laag" | "Kritiek";

export interface Materiaal {
  id: string;
  naam: string;
  voorraad: number;
  eenheid: string; // "kg" | "stuks" | "m"
  min: number;
  leverancier: string;
  altLeverancier: string;
  eta: string; // human readable
  prijs: string; // human readable
  categorie: "metaal" | "componenten" | "afwerking";
}

export interface Levering {
  dag: string; // "Ma" | "Di" ...
  materiaal: string;
  leverancier: string;
  hoeveelheid: string;
  tijd?: string;
  status: "verwacht" | "onderweg" | "geleverd";
}

export interface GereedProduct {
  id: string;
  omschrijving: string;
  aantal: number;
  brand: Brand;
  notitie: string;
}

// ── Factory floor / machines ─────────────────────────────────────────────────

export type MachineStatus = "actief" | "standby" | "vrij" | "storing" | "onderhoud";

export type ZoneId = "A" | "B" | "C" | "D" | "E";

export interface Machine {
  id: string;
  naam: string;
  zone: ZoneId;
  status: MachineStatus;
  bezetting: number; // %
  actieveJob: string;
  volgendeJob: string;
  outputVandaag: number;
  target: number;
}

export interface Zone {
  id: ZoneId;
  naam: string;
  omschrijving: string;
  /** SVG rect in the floor schematic viewBox (0..1000 x 0..560). */
  x: number;
  y: number;
  w: number;
  h: number;
  kleur: string;
  machineIds: string[];
}

// ── Service tickets ──────────────────────────────────────────────────────────

export type Prioriteit = "KRITIEK" | "Hoog" | "Normaal" | "Gepland";

export interface ServiceMelding {
  id: string;
  klant: string;
  stad: string;
  brand: Brand;
  probleem: string;
  prioriteit: Prioriteit;
  status: string;
}

// ── Facilities ───────────────────────────────────────────────────────────────

export interface Vergaderzaal {
  ruimte: string;
  capaciteit: number;
  bezet: boolean;
  aanwezig: number;
  tot: string; // "16:00" | "—"
  type: string;
}

// ── Alerts (ticker) ──────────────────────────────────────────────────────────

export type AlertNiveau = "info" | "waarschuwing" | "kritiek" | "succes";

export interface Alert {
  id: string;
  bericht: string;
  niveau: AlertNiveau;
  tijd: number; // epoch ms
}

// ── Live factory reading (KPI dashboard) ─────────────────────────────────────

export interface FactoryReading {
  timestamp: number;
  ordersInProductie: number;
  gereedVandaag: number;
  grondstofDekking: number; // %
  monteursOnderweg: number;
  monteursTotaal: number;
  openMeldingen: number;
  kritiekeMeldingen: number;
  bezetting: number; // %
  levertijd: number; // werkdagen
  kwaliteitGeslaagd: number; // %
  // facilities / telephony
  servicelijnActief: number;
  servicelijnWacht: number;
  verkoopActief: number;
  gemiddeldeWachttijd: number; // seconden
  gemisteOproepen: number;
  parkeerBezet: number; // van 45
  werkbussenAanwezig: number; // van 12
  aanwezigPersoneel: number; // van 84
  // weather (Woerden)
  buitenTemp: number; // °C
}
