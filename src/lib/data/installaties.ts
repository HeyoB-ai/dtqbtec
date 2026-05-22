import type { Installatie, LandData, Brand } from "@/lib/types";
import { seededRandom } from "@/lib/utils";

/** Country-level aggregates for the Europe installed-base map. */
export const LANDEN: LandData[] = [
  { land: "Nederland", code: "NL", center: [5.2913, 52.1326], installaties: 3847 },
  { land: "België", code: "BE", center: [4.4699, 50.5039], installaties: 892 },
  { land: "Duitsland", code: "DE", center: [10.4515, 51.1657], installaties: 634 },
  { land: "UK", code: "GB", center: [-1.8, 52.7], installaties: 421 },
  { land: "Frankrijk", code: "FR", center: [2.2137, 46.6], installaties: 387 },
  { land: "Scandinavië", code: "SC", center: [13.5, 59.0], installaties: 298 },
  { land: "Rest Europa", code: "EU", center: [16.0, 47.5], installaties: 847 },
  { land: "Buiten Europa", code: "XX", center: [22.0, 37.0], installaties: 234 },
];

export const TOTAAL_INSTALLATIES = LANDEN.reduce((s, l) => s + l.installaties, 0);

type StadDef = [string, number, number]; // [naam, lng, lat]

const STEDEN: Record<string, StadDef[]> = {
  Nederland: [
    ["Rotterdam", 4.4777, 51.9244], ["Amsterdam", 4.9041, 52.3676], ["Den Haag", 4.3007, 52.0705],
    ["Utrecht", 5.1214, 52.0907], ["Eindhoven", 5.4697, 51.4416], ["Groningen", 6.5665, 53.2194],
    ["Tilburg", 5.0913, 51.5606], ["Scheveningen", 4.27, 52.105], ["Maastricht", 5.6909, 50.8514],
    ["Arnhem", 5.8987, 51.9851], ["Breda", 4.7683, 51.5719], ["Nijmegen", 5.852, 51.8126],
    ["Zwolle", 6.083, 52.5168], ["Haarlem", 4.6462, 52.3874], ["Apeldoorn", 5.9699, 52.2112],
    ["Leeuwarden", 5.7975, 53.2012],
  ],
  België: [
    ["Antwerpen", 4.4025, 51.2194], ["Brussel", 4.3517, 50.8503], ["Gent", 3.7174, 51.0543],
    ["Brugge", 3.2247, 51.2093], ["Luik", 5.5797, 50.6326], ["Leuven", 4.7005, 50.8798],
    ["Hasselt", 5.3378, 50.9307], ["Kortrijk", 3.2649, 50.8279],
  ],
  Duitsland: [
    ["Köln", 6.9603, 50.9375], ["Düsseldorf", 6.7763, 51.2277], ["Hamburg", 9.9937, 53.5511],
    ["München", 11.582, 48.1351], ["Berlin", 13.405, 52.52], ["Frankfurt", 8.6821, 50.1109],
    ["Stuttgart", 9.1829, 48.7758],
  ],
  UK: [
    ["London", -0.1276, 51.5072], ["Manchester", -2.2426, 53.4808], ["Birmingham", -1.8904, 52.4862],
    ["Leeds", -1.5491, 53.8008], ["Glasgow", -4.2518, 55.8642],
  ],
  Frankrijk: [
    ["Paris", 2.3522, 48.8566], ["Lyon", 4.8357, 45.764], ["Lille", 3.0573, 50.6292],
    ["Marseille", 5.3698, 43.2965], ["Bordeaux", -0.5792, 44.8378],
  ],
  Scandinavië: [
    ["Stockholm", 18.0686, 59.3293], ["Kopenhagen", 12.5683, 55.6761], ["Oslo", 10.7522, 59.9139],
    ["Göteborg", 11.9746, 57.7089],
  ],
  "Rest Europa": [
    ["Wenen", 16.3738, 48.2082], ["Zürich", 8.5417, 47.3769], ["Milaan", 9.19, 45.4642],
  ],
  "Buiten Europa": [
    ["Dubai", 55.2708, 25.2048], ["Riyadh", 46.6753, 24.7136],
  ],
};

const NAAM_POOLS: Record<string, string[]> = {
  Nederland: ["Cafetaria", "Snackbar", "Grand Café", "Restaurant", "Viszaak", "Strandpaviljoen", "Eetcafé", "Snackpoint"],
  België: ["Frituur", "Brasserie", "Friterie", "Restaurant", "Taverne"],
  Duitsland: ["Imbiss", "Pommesbude", "Restaurant", "Gasthof", "Bistro"],
  UK: ["Fish & Chips", "The Chippy", "Brasserie", "Grill House", "Harbour Diner"],
  Frankrijk: ["Friterie", "Brasserie", "Bistro", "Restaurant", "Le Comptoir"],
  Scandinavië: ["Gatukök", "Restaurang", "Havets", "Grill"],
  "Rest Europa": ["Restaurant", "Bistro", "Gasthof", "Trattoria"],
  "Buiten Europa": ["Grand Hotel", "Royal Kitchen", "Resort", "Chain HQ"],
};

const ACHTERVOEGSEL = ["Centraal", "De Haven", "'t Plein", "Markt", "De Brug", "Oost", "Zuid", "Park", "Boulevard", "De Hoek", "Plaza", "Stadion"];

const PRODUCTEN: Record<Brand, string[]> = {
  Kiremko: ["K400 3-baks bakwand", "K600 frituurinstallatie", "Bakwand 2-baks", "Frituurwand 4-bak"],
  Perfecta: ["P3 frituurcentrum", "Frituurwand maatwerk", "Bak- & braadcentrum"],
  Smitto: ["Visbakoven compact", "Visbakwand dubbel", "Visbakoven industrieel"],
  "Qook!": ["Grootkeuken maatwerk", "Kooklijn hotel"],
  Florigo: ["Elektrische frituur", "Frituurunit A-label"],
  "De Kuiper": ["Bakapparatuur lijn", "Grill- & baklijn"],
  Adieu: ["Gietijzeren grillplaten", "Grillplaat XL"],
  HiFri: ["Air-frying oven", "Air-fry oven dubbel"],
};

const ALLE_BRANDS = Object.keys(PRODUCTEN) as Brand[];
const ONDERDELEN = ["thermostaat", "oliepomp", "brander", "verwarmingselement", "besturingsprint", "afzuigmotor"];
const MAANDEN = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

const VERDELING: { land: string; aantal: number }[] = [
  { land: "Nederland", aantal: 16 },
  { land: "België", aantal: 8 },
  { land: "Duitsland", aantal: 7 },
  { land: "UK", aantal: 5 },
  { land: "Frankrijk", aantal: 5 },
  { land: "Scandinavië", aantal: 4 },
  { land: "Rest Europa", aantal: 3 },
  { land: "Buiten Europa", aantal: 2 },
];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function jitter(v: number, seed: number, amp: number): number {
  return +(v + (seededRandom(seed) - 0.5) * amp).toFixed(4);
}

function genInstallaties(): Installatie[] {
  const out: Installatie[] = [];

  // Featured installation — matches the lifecycle panel spec exactly.
  out.push({
    id: "inst-featured",
    product: "Kiremko K400 3-baks bakwand",
    brand: "Kiremko",
    klant: "Cafetaria De Hoek",
    stad: "Rotterdam",
    land: "Nederland",
    center: [4.4777, 51.9244],
    installDatum: "2019-03-12",
    servicecontract: true,
    contractType: "Premium 24/7",
    laatsteOnderhoud: "2025-02-14",
    volgendeOnderhoud: "2025-08-14",
    bezoeken: 4,
    vervangenOnderdelen: [
      { onderdeel: "thermostaat", jaar: 2022 },
      { onderdeel: "oliepomp", jaar: 2024 },
    ],
    status: "operationeel",
  });

  let seed = 1;
  for (const { land, aantal } of VERDELING) {
    const steden = STEDEN[land];
    const namen = NAAM_POOLS[land];
    const start = land === "Nederland" ? 1 : 0; // featured already covers one NL unit
    for (let i = start; i < aantal; i++) {
      seed += 7;
      const [stad, lng, lat] = steden[i % steden.length];
      const brand = ALLE_BRANDS[Math.floor(seededRandom(seed * 1.3) * ALLE_BRANDS.length)];
      const prods = PRODUCTEN[brand];
      const product = prods[Math.floor(seededRandom(seed * 2.1) * prods.length)];
      const naam = `${namen[Math.floor(seededRandom(seed * 3.7) * namen.length)]} ${ACHTERVOEGSEL[Math.floor(seededRandom(seed * 5.5) * ACHTERVOEGSEL.length)]}`;

      const jaar = 2014 + Math.floor(seededRandom(seed * 1.7) * 11); // 2014–2024
      const maand = Math.floor(seededRandom(seed * 4.2) * 12);
      const contract = seededRandom(seed * 6.1) > 0.28;
      const contractType = contract
        ? seededRandom(seed * 8.3) > 0.5 ? "Premium 24/7" : "Standaard"
        : "Geen";
      const bezoeken = Math.max(0, Math.round((2025 - jaar) * (0.4 + seededRandom(seed * 9.9) * 0.7)));
      const leeftijd = 2025 - jaar;
      const onderdelen: { onderdeel: string; jaar: number }[] = [];
      if (leeftijd >= 4 && seededRandom(seed * 11.1) > 0.5) {
        onderdelen.push({ onderdeel: ONDERDELEN[Math.floor(seededRandom(seed * 12.2) * ONDERDELEN.length)], jaar: jaar + Math.min(leeftijd - 1, 3 + Math.floor(seededRandom(seed * 13) * 4)) });
      }
      if (leeftijd >= 7 && seededRandom(seed * 14.4) > 0.6) {
        onderdelen.push({ onderdeel: ONDERDELEN[Math.floor(seededRandom(seed * 15.5) * ONDERDELEN.length)], jaar: jaar + Math.min(leeftijd - 1, 6) });
      }
      const r = seededRandom(seed * 16.6);
      const status: Installatie["status"] = r > 0.93 ? "storing" : r > 0.85 ? "onderhoud" : "operationeel";

      const lastY = contract ? 2024 + (seededRandom(seed * 17) > 0.4 ? 1 : 0) : 2023 + Math.floor(seededRandom(seed * 18) * 2);
      const lastM = Math.floor(seededRandom(seed * 19) * 12);

      out.push({
        id: `inst-${land.slice(0, 2).toLowerCase()}-${i}`,
        product,
        brand,
        klant: naam,
        stad,
        land,
        center: [jitter(lng, seed * 21, 0.06), jitter(lat, seed * 23, 0.04)],
        installDatum: iso(jaar, maand, 1 + Math.floor(seededRandom(seed * 24) * 27)),
        servicecontract: contract,
        contractType,
        laatsteOnderhoud: contract || onderdelen.length ? iso(lastY, lastM, 1 + Math.floor(seededRandom(seed * 25) * 27)) : "—",
        volgendeOnderhoud: contract ? iso(lastY + (lastM >= 6 ? 1 : 0), (lastM + 6) % 12, 14) : "—",
        bezoeken,
        vervangenOnderdelen: onderdelen,
        status,
      });
    }
  }
  return out;
}

export const INSTALLATIES = genInstallaties();

export function installatiesPerLand(land: string): Installatie[] {
  return INSTALLATIES.filter((i) => i.land === land);
}

/** Maand + jaar uit een ISO-datum, bv "maart 2019". */
export function maandJaar(isoDate: string): string {
  if (!isoDate || isoDate === "—") return "—";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return `${MAANDEN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Leeftijd in "x jaar y maanden" t.o.v. nu (peildatum). */
export function leeftijd(isoDate: string, nu = new Date()): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "—";
  let jaren = nu.getFullYear() - d.getFullYear();
  let maanden = nu.getMonth() - d.getMonth();
  if (maanden < 0) {
    jaren -= 1;
    maanden += 12;
  }
  return `${jaren} jaar ${maanden} mnd`;
}
