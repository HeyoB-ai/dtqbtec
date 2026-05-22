import type { Machine, Zone } from "@/lib/types";

/**
 * Machines on the QBtec production floor, grouped by zone (A–E).
 * `outputVandaag` / `target` are in operations or units processed today.
 */
export const MACHINES: Machine[] = [
  // ── Zone A — Plaatbewerking ──
  { id: "a-laser1", naam: "Laser cutter 1", zone: "A", status: "actief", bezetting: 91, actieveJob: "K-2841 — RVS platen", volgendeJob: "DK-0014 — frame", outputVandaag: 38, target: 45 },
  { id: "a-laser2", naam: "Laser cutter 2", zone: "A", status: "actief", bezetting: 76, actieveJob: "F-0021 — aluminium", volgendeJob: "P-1925 — panelen", outputVandaag: 24, target: 30 },
  { id: "a-safan", naam: "Safan Darley buigsysteem", zone: "A", status: "actief", bezetting: 98, actieveJob: "K-2841 — kantwerk", volgendeJob: "K-2849 — spatwand", outputVandaag: 142, target: 150 },

  // ── Zone B — Lassen & constructie ──
  { id: "b-las1", naam: "Lasstation 1", zone: "B", status: "actief", bezetting: 84, actieveJob: "P-1923 — frame", volgendeJob: "S-0844 — kuip", outputVandaag: 6, target: 8 },
  { id: "b-las2", naam: "Lasstation 2", zone: "B", status: "actief", bezetting: 79, actieveJob: "K-2849 — wand", volgendeJob: "—", outputVandaag: 5, target: 8 },
  { id: "b-las3", naam: "Lasstation 3", zone: "B", status: "vrij", bezetting: 0, actieveJob: "—", volgendeJob: "K-2841 — frame (14:30)", outputVandaag: 4, target: 8 },
  { id: "b-las4", naam: "Lasstation 4", zone: "B", status: "storing", bezetting: 0, actieveJob: "Storing — draadaanvoer", volgendeJob: "Monteur onderweg", outputVandaag: 2, target: 8 },
  { id: "b-robot", naam: "Robotlasstation", zone: "B", status: "actief", bezetting: 88, actieveJob: "Serie — vetopvangbakken", volgendeJob: "Serie — kuipen", outputVandaag: 64, target: 70 },

  // ── Zone C — Assemblage ──
  { id: "c-lijn1", naam: "Assemblagelijn 1", zone: "C", status: "actief", bezetting: 92, actieveJob: "K-2847 — bakwand", volgendeJob: "P-1918 — braadcentrum", outputVandaag: 2, target: 3 },
  { id: "c-lijn2", naam: "Assemblagelijn 2", zone: "C", status: "actief", bezetting: 70, actieveJob: "S-0844 — visbakwand", volgendeJob: "Q-0312 — module 1", outputVandaag: 1, target: 2 },
  { id: "c-lijn3", naam: "Assemblagelijn 3", zone: "C", status: "standby", bezetting: 22, actieveJob: "DK-0014 — voorbereiding", volgendeJob: "F-0021 — frituurunit", outputVandaag: 1, target: 2 },

  // ── Zone D — Afwerking & QC ──
  { id: "d-schilder", naam: "Schilderstraatje", zone: "D", status: "actief", bezetting: 67, actieveJob: "P-1918 — poedercoating", volgendeJob: "S-0844 — afwerking", outputVandaag: 4, target: 6 },
  { id: "d-qc", naam: "Kwaliteitscontrole", zone: "D", status: "actief", bezetting: 80, actieveJob: "S-0847 — eindkeuring", volgendeJob: "P-1918 — keuring", outputVandaag: 5, target: 6 },
  { id: "d-eindtest", naam: "Eindtest (gas/elektra)", zone: "D", status: "actief", bezetting: 73, actieveJob: "S-0847 — aansluittest", volgendeJob: "K-2847 — test", outputVandaag: 4, target: 5 },

  // ── Zone E — Expeditie ──
  { id: "e-staging", naam: "Gereed staging", zone: "E", status: "actief", bezetting: 55, actieveJob: "S-0847 — klaar voor transport", volgendeJob: "P-1918", outputVandaag: 3, target: 3 },
  { id: "e-inpak", naam: "Inpakstation", zone: "E", status: "actief", bezetting: 61, actieveJob: "S-0847 — transportframe", volgendeJob: "—", outputVandaag: 3, target: 4 },
  { id: "e-dok", naam: "Laaddok (3 plekken)", zone: "E", status: "actief", bezetting: 66, actieveJob: "2 leveringen gepland vandaag", volgendeJob: "Transport 13:30 → Scheveningen", outputVandaag: 2, target: 2 },
];

export const ZONES: Zone[] = [
  {
    id: "A",
    naam: "Zone A — Plaatbewerking",
    omschrijving: "Laser snijden & buigen",
    x: 24, y: 44, w: 300, h: 210,
    kleur: "#E8650A",
    machineIds: ["a-laser1", "a-laser2", "a-safan"],
  },
  {
    id: "B",
    naam: "Zone B — Lassen & constructie",
    omschrijving: "Hand- & robotlassen",
    x: 348, y: 44, w: 300, h: 210,
    kleur: "#388bfd",
    machineIds: ["b-las1", "b-las2", "b-las3", "b-las4", "b-robot"],
  },
  {
    id: "D",
    naam: "Zone D — Afwerking & QC",
    omschrijving: "Schilderen, keuring, eindtest",
    x: 672, y: 44, w: 304, h: 210,
    kleur: "#a855f7",
    machineIds: ["d-schilder", "d-qc", "d-eindtest"],
  },
  {
    id: "C",
    naam: "Zone C — Assemblage",
    omschrijving: "3 assemblagelijnen",
    x: 24, y: 286, w: 624, h: 232,
    kleur: "#14b8a6",
    machineIds: ["c-lijn1", "c-lijn2", "c-lijn3"],
  },
  {
    id: "E",
    naam: "Zone E — Expeditie",
    omschrijving: "Staging, inpak, laaddok",
    x: 672, y: 286, w: 304, h: 232,
    kleur: "#3fb950",
    machineIds: ["e-staging", "e-inpak", "e-dok"],
  },
];

/** Marker positions inside the floor schematic viewBox (1000 × 560). */
export const MACHINE_MARKERS: Record<string, [number, number]> = {
  "a-laser1": [80, 120], "a-laser2": [170, 120], "a-safan": [255, 175],
  "b-las1": [395, 110], "b-las2": [460, 110], "b-las3": [525, 110], "b-las4": [590, 110], "b-robot": [490, 200],
  "d-schilder": [740, 110], "d-qc": [840, 110], "d-eindtest": [910, 185],
  "c-lijn1": [150, 360], "c-lijn2": [330, 360], "c-lijn3": [520, 360],
  "e-staging": [740, 360], "e-inpak": [840, 360], "e-dok": [820, 460],
};

export function machineStatusKleur(status: Machine["status"]): string {
  switch (status) {
    case "actief":
      return "#3fb950";
    case "standby":
      return "#d29922";
    case "vrij":
      return "#8b949e";
    case "storing":
      return "#f85149";
    case "onderhoud":
      return "#388bfd";
    default:
      return "#8b949e";
  }
}

export const MACHINE_STATUS_LABEL: Record<Machine["status"], string> = {
  actief: "Actief",
  standby: "Standby",
  vrij: "Vrij",
  storing: "Storing",
  onderhoud: "Onderhoud",
};
