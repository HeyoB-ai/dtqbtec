import type { Vergaderzaal, AanwezigheidSummary } from "@/lib/types";

export const VERGADERZALEN: Vergaderzaal[] = [
  { ruimte: "Boardroom", capaciteit: 12, bezet: true, aanwezig: 8, tot: "16:00", type: "Vergadering directie" },
  { ruimte: "Vergader 1", capaciteit: 8, bezet: false, aanwezig: 0, tot: "—", type: "Vrij" },
  { ruimte: "Vergader 2", capaciteit: 6, bezet: true, aanwezig: 4, tot: "14:30", type: "Sales overleg" },
  { ruimte: "Showroom", capaciteit: 20, bezet: true, aanwezig: 6, tot: "15:30", type: "Demo bezoek klant" },
  { ruimte: "Kantine", capaciteit: 60, bezet: true, aanwezig: 23, tot: "—", type: "Open" },
];

export const PARKEREN = {
  totaal: 45,
  bezet: 31,
  werkbussenAanwezig: 8,
  werkbussenTotaal: 12,
  bezoekers: 3,
};

export const TELEFOON = {
  servicelijn: "088-457 60 60",
  verkoop: "0348-47 55 55",
  servicelijnActief: 2,
  servicelijnWacht: 0,
  verkoopActief: 1,
  gemiddeldeWachttijd: "0:42 min",
  gemisteOproepen: 2,
};

export const PERSONEEL = {
  aanwezig: 67,
  totaal: 84,
  productie: 45,
  serviceBuitendienst: 7,
  kantoor: 15,
  afwezig: 17,
};

// ── Aanwezigheid (real-time presence) ────────────────────────────────────────

export const MAX_CAPACITEIT = 120;
export const BHV_GRENS = 100; // melding-/ontruimingsgrens BHV

/** Soft caps so the live simulation stays realistic and bounded. */
export const AANWEZIGHEID_CAP = { medewerker: 84, extern: 14, bezoeker: 8 } as const;

export const AFDELINGEN = ["Productie", "Servicedienst buitendienst", "Kantoor & support"] as const;
export const EXTERN_TYPES = [
  "Uitzendkrachten (productie)",
  "ZZP monteur (servicedienst)",
  "Aannemer (bouwproject hal C)",
] as const;
export const BEZOEKER_TYPES = [
  "Klant (showroom demo)",
  "Leverancier (levering + overleg)",
  "Sollicitant",
] as const;

export const AANWEZIGHEID_INIT: AanwezigheidSummary = {
  medewerkers: {
    totaal: 67,
    perAfdeling: { "Productie": 45, "Servicedienst buitendienst": 7, "Kantoor & support": 15 },
  },
  externen: {
    totaal: 8,
    perType: {
      "Uitzendkrachten (productie)": 5,
      "ZZP monteur (servicedienst)": 2,
      "Aannemer (bouwproject hal C)": 1,
    },
  },
  bezoekers: {
    totaal: 3,
    perType: { "Klant (showroom demo)": 1, "Leverancier (levering + overleg)": 1, "Sollicitant": 1 },
  },
  totaalOpLocatie: 78,
  maxCapaciteit: MAX_CAPACITEIT,
  log: [
    { id: "log-seed-4", categorie: "bezoeker", naam: "Klant Cafetaria De Hoek (showroom)", tijdstip: "09:15", actie: "in" },
    { id: "log-seed-3", categorie: "extern", naam: "Uitzendkracht #3", tijdstip: "09:03", actie: "in" },
    { id: "log-seed-2", categorie: "bezoeker", naam: "Leverancier Van Loon Staal", tijdstip: "08:52", actie: "in" },
    { id: "log-seed-1", categorie: "medewerker", naam: "J. van Dijk", tijdstip: "08:47", actie: "in" },
  ],
};

/** Capacity colour: green < 80, amber 80–100, red > 100. */
export function capaciteitKleur(n: number): string {
  if (n > BHV_GRENS) return "#f85149";
  if (n >= 80) return "#d29922";
  return "#3fb950";
}

export const CATEGORIE_KLEUR: Record<string, string> = {
  medewerker: "#388bfd",
  extern: "#d29922",
  bezoeker: "#a855f7",
};

export const CATEGORIE_LABEL: Record<string, string> = {
  medewerker: "Medewerker",
  extern: "Extern",
  bezoeker: "Bezoeker",
};
