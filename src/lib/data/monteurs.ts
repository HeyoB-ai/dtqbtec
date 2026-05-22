import type { Monteur } from "@/lib/types";

export const WOERDEN: [number, number] = [4.8836, 52.0853];

/**
 * 12 service technicians — 7 currently underway, 5 at the Woerden workshop.
 * Coordinates are [lng, lat]; `doel` drives the live movement simulation.
 */
export const MONTEURS: Monteur[] = [
  {
    id: "m-berg",
    naam: "J. van den Berg",
    expertise: "Kiremko specialist",
    center: [4.4777, 51.9244],
    status: "bij klant",
    stad: "Rotterdam",
    opdracht: "SM-4821 — thermostaat storing Kiremko K600",
    werkbus: 88,
    etaMin: 0,
    reistijdTerug: 52,
  },
  {
    id: "m-pietersen",
    naam: "M. Pietersen",
    expertise: "Algemeen",
    center: [4.896, 52.23],
    doel: [4.9041, 52.3676],
    status: "onderweg",
    stad: "Amsterdam",
    opdracht: "SM-4820 — brander uitval Qook! (gepland 15:00)",
    werkbus: 72,
    etaMin: 45,
    reistijdTerug: 48,
  },
  {
    id: "m-degraaf",
    naam: "R. de Graaf",
    expertise: "Perfecta specialist",
    center: [5.1214, 52.0907],
    doel: WOERDEN,
    status: "gereed",
    stad: "Utrecht",
    opdracht: "Onderhoud afgerond — terug naar Woerden",
    werkbus: 41,
    reistijdTerug: 22,
  },
  {
    id: "m-janssen",
    naam: "K. Janssen",
    expertise: "Algemeen",
    center: [5.4697, 51.4416],
    status: "bij klant",
    stad: "Eindhoven",
    opdracht: "Reparatie bezig — oliepomp vervangen",
    werkbus: 64,
    etaMin: 0,
    reistijdTerug: 78,
  },
  {
    id: "m-smits",
    naam: "T. Smits",
    expertise: "Smitto specialist",
    center: [4.3007, 52.0705],
    status: "onderweg",
    stad: "Den Haag",
    opdracht: "SM-4819 — gepland onderhoud (15:00)",
    werkbus: 80,
    etaMin: 35,
    reistijdTerug: 44,
  },
  {
    id: "m-visser",
    naam: "A. Visser",
    expertise: "Kiremko specialist",
    center: [4.7683, 51.5719],
    status: "spoed",
    stad: "Breda",
    opdracht: "Spoed callout — frituurlijn volledig uitgevallen",
    werkbus: 69,
    etaMin: 12,
    reistijdTerug: 58,
  },
  {
    id: "m-bakker",
    naam: "P. Bakker",
    expertise: "Florigo specialist",
    center: [6.5665, 53.2194],
    status: "overnacht",
    stad: "Groningen",
    opdracht: "2-daagse nieuwe installatie Florigo lijn",
    werkbus: 95,
    reistijdTerug: 142,
  },
  // ── Workshop / beschikbaar (Woerden) ──
  {
    id: "m-dewit",
    naam: "H. de Wit",
    expertise: "Qook! specialist",
    center: [4.8825, 52.0861],
    status: "beschikbaar",
    stad: "Woerden",
    opdracht: "Beschikbaar voor spoedoproepen",
    werkbus: 100,
    reistijdTerug: 0,
  },
  {
    id: "m-mulder",
    naam: "S. Mulder",
    expertise: "Algemeen",
    center: [4.8848, 52.0846],
    status: "beschikbaar",
    stad: "Woerden",
    opdracht: "Beschikbaar voor spoedoproepen",
    werkbus: 100,
    reistijdTerug: 0,
  },
  {
    id: "m-hendriks",
    naam: "B. Hendriks",
    expertise: "Algemeen",
    center: [4.8818, 52.0849],
    status: "workshop",
    stad: "Woerden",
    opdracht: "Werkbus onderhoud + aanvulling voorraad",
    werkbus: 35,
    reistijdTerug: 0,
  },
  {
    id: "m-vos",
    naam: "N. Vos",
    expertise: "HiFri specialist",
    center: [4.8841, 52.0838],
    status: "workshop",
    stad: "Woerden",
    opdracht: "Werkbus onderhoud + diagnostiek-apparatuur",
    werkbus: 48,
    reistijdTerug: 0,
  },
  {
    id: "m-bos",
    naam: "L. Bos",
    expertise: "Florigo specialist",
    center: [4.8809, 52.0857],
    status: "opleiding",
    stad: "Woerden",
    opdracht: "Opleiding nieuwe Florigo productlijn",
    werkbus: 100,
    reistijdTerug: 0,
  },
];

export const MONTEURS_ONDERWEG = MONTEURS.filter(
  (m) => !["beschikbaar", "workshop", "opleiding"].includes(m.status),
);

export function monteurStatusKleur(status: Monteur["status"]): string {
  switch (status) {
    case "spoed":
      return "#f85149";
    case "bij klant":
      return "#E8650A";
    case "onderweg":
      return "#388bfd";
    case "gereed":
      return "#3fb950";
    case "overnacht":
      return "#a855f7";
    case "beschikbaar":
      return "#3fb950";
    case "workshop":
      return "#d29922";
    case "opleiding":
      return "#8b949e";
    default:
      return "#8b949e";
  }
}
