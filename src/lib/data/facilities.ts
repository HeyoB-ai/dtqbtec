import type { Vergaderzaal } from "@/lib/types";

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
