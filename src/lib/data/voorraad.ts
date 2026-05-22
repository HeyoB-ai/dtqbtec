import type { Materiaal, Levering, GereedProduct, VoorraadStatus } from "@/lib/types";

export function voorraadStatus(voorraad: number, min: number): VoorraadStatus {
  if (voorraad <= min) return "Kritiek";
  if (voorraad <= min * 1.6) return "Laag";
  return "OK";
}

/** 30 raw materials & components with realistic stock levels and suppliers. */
export const MATERIALEN: Materiaal[] = [
  { id: "rvs-2", naam: "RVS plaat 2mm", voorraad: 847, eenheid: "kg", min: 200, leverancier: "Van Loon Staal", altLeverancier: "MCB Nederland", eta: "Ma 08:00", prijs: "€ 4,20 / kg", categorie: "metaal" },
  { id: "rvs-3", naam: "RVS plaat 3mm", voorraad: 312, eenheid: "kg", min: 200, leverancier: "Van Loon Staal", altLeverancier: "MCB Nederland", eta: "Ma 08:00", prijs: "€ 4,65 / kg", categorie: "metaal" },
  { id: "staal", naam: "Staal constructie", voorraad: 1240, eenheid: "kg", min: 400, leverancier: "Van Loon Staal", altLeverancier: "ArcelorMittal", eta: "Wo", prijs: "€ 1,35 / kg", categorie: "metaal" },
  { id: "alu-15", naam: "Aluminium 1,5mm", voorraad: 156, eenheid: "kg", min: 150, leverancier: "Alustock", altLeverancier: "Nedal Aluminium", eta: "Do", prijs: "€ 3,90 / kg", categorie: "metaal" },
  { id: "vetpomp", naam: "Frituurvet pomp", voorraad: 24, eenheid: "stuks", min: 10, leverancier: "Brammer NL", altLeverancier: "Eriks", eta: "Vr", prijs: "€ 142 / st", categorie: "componenten" },
  { id: "thermostaat", naam: "Thermostaten", voorraad: 8, eenheid: "stuks", min: 15, leverancier: "Elektrotherm BV", altLeverancier: "Jumo Meet", eta: "Di", prijs: "€ 68 / st", categorie: "componenten" },
  { id: "gasbrander", naam: "Gasbranders (serie)", voorraad: 34, eenheid: "stuks", min: 20, leverancier: "Polidoro NL", altLeverancier: "Worgas", eta: "Wo", prijs: "€ 95 / st", categorie: "componenten" },
  { id: "elektra-element", naam: "Elektrische elementen", voorraad: 67, eenheid: "stuks", min: 30, leverancier: "Backer Elektro", altLeverancier: "Vulcanic", eta: "Do", prijs: "€ 54 / st", categorie: "componenten" },
  { id: "inox-leiding", naam: "Inox leidingwerk", voorraad: 89, eenheid: "m", min: 50, leverancier: "MCB Nederland", altLeverancier: "Van Loon Staal", eta: "Wo", prijs: "€ 12 / m", categorie: "metaal" },
  { id: "vetbak", naam: "Vetopvangbakken RVS", voorraad: 45, eenheid: "stuks", min: 20, leverancier: "Eigen productie", altLeverancier: "—", eta: "intern", prijs: "€ 38 / st", categorie: "afwerking" },

  { id: "rvs-15", naam: "RVS plaat 1,5mm", voorraad: 524, eenheid: "kg", min: 200, leverancier: "Van Loon Staal", altLeverancier: "MCB Nederland", eta: "Ma 08:00", prijs: "€ 4,05 / kg", categorie: "metaal" },
  { id: "rvs-buis", naam: "RVS buisprofiel 40x40", voorraad: 410, eenheid: "m", min: 150, leverancier: "MCB Nederland", altLeverancier: "Van Loon Staal", eta: "Do", prijs: "€ 9 / m", categorie: "metaal" },
  { id: "scharnieren", naam: "RVS scharnieren zwaar", voorraad: 220, eenheid: "stuks", min: 80, leverancier: "Fabory", altLeverancier: "Bossard", eta: "Vr", prijs: "€ 6 / st", categorie: "componenten" },
  { id: "isolatie", naam: "Hoge-temp isolatiemat", voorraad: 64, eenheid: "m²", min: 40, leverancier: "Rockwool", altLeverancier: "Knauf", eta: "Wo", prijs: "€ 22 / m²", categorie: "afwerking" },
  { id: "touchscreen", naam: "Touchscreen besturingspanelen", voorraad: 11, eenheid: "stuks", min: 8, leverancier: "Siemens NL", altLeverancier: "Beijer Electronics", eta: "Do", prijs: "€ 410 / st", categorie: "componenten" },
  { id: "plc", naam: "PLC besturingseenheden", voorraad: 17, eenheid: "stuks", min: 10, leverancier: "Siemens NL", altLeverancier: "Schneider Electric", eta: "Do", prijs: "€ 280 / st", categorie: "componenten" },
  { id: "kabel", naam: "Hittebestendige bekabeling", voorraad: 1850, eenheid: "m", min: 600, leverancier: "TKF", altLeverancier: "Lapp Kabel", eta: "Vr", prijs: "€ 1,80 / m", categorie: "componenten" },
  { id: "gasklep", naam: "Gasregelkleppen", voorraad: 28, eenheid: "stuks", min: 20, leverancier: "Polidoro NL", altLeverancier: "Sit Group", eta: "Wo", prijs: "€ 76 / st", categorie: "componenten" },
  { id: "ventilator", naam: "Afzuigventilatoren", voorraad: 14, eenheid: "stuks", min: 8, leverancier: "Ruck Ventilatoren", altLeverancier: "Systemair", eta: "Do", prijs: "€ 320 / st", categorie: "componenten" },
  { id: "filter", naam: "Vetfilters RVS", voorraad: 96, eenheid: "stuks", min: 40, leverancier: "Eigen productie", altLeverancier: "—", eta: "intern", prijs: "€ 28 / st", categorie: "afwerking" },
  { id: "manden", naam: "Frituurmanden RVS", voorraad: 132, eenheid: "stuks", min: 60, leverancier: "Friginox", altLeverancier: "Eigen productie", eta: "Vr", prijs: "€ 24 / st", categorie: "componenten" },
  { id: "verf", naam: "Poedercoating RVS-look", voorraad: 240, eenheid: "kg", min: 100, leverancier: "AkzoNobel", altLeverancier: "Tiger Coatings", eta: "Wo", prijs: "€ 7 / kg", categorie: "afwerking" },
  { id: "dichtingen", naam: "Hittebestendige dichtingen", voorraad: 18, eenheid: "rol", min: 12, leverancier: "Eriks", altLeverancier: "Angst+Pfister", eta: "Vr", prijs: "€ 45 / rol", categorie: "afwerking" },
  { id: "bouten", naam: "RVS bouten & moeren (assortiment)", voorraad: 9400, eenheid: "stuks", min: 3000, leverancier: "Fabory", altLeverancier: "Bossard", eta: "Vr", prijs: "div.", categorie: "componenten" },
  { id: "lasdraad", naam: "RVS lasdraad 308L", voorraad: 178, eenheid: "kg", min: 60, leverancier: "Lincoln Electric", altLeverancier: "ESAB", eta: "Wo", prijs: "€ 9 / kg", categorie: "metaal" },
  { id: "gas-argon", naam: "Beschermgas Argon (flessen)", voorraad: 22, eenheid: "stuks", min: 12, leverancier: "Linde Gas", altLeverancier: "Air Liquide", eta: "Do", prijs: "€ 58 / fles", categorie: "componenten" },
  { id: "displaykap", naam: "Glazen warmhoudkappen", voorraad: 9, eenheid: "stuks", min: 10, leverancier: "Glasimport BV", altLeverancier: "Schott", eta: "Vr", prijs: "€ 120 / st", categorie: "afwerking" },
  { id: "wielen", naam: "Zwenkwielen zwaar (geremd)", voorraad: 88, eenheid: "stuks", min: 40, leverancier: "Tente", altLeverancier: "Blickle", eta: "Vr", prijs: "€ 18 / st", categorie: "componenten" },
  { id: "thermokoppel", naam: "Thermokoppels type-K", voorraad: 31, eenheid: "stuks", min: 25, leverancier: "Jumo Meet", altLeverancier: "Elektrotherm BV", eta: "Di", prijs: "€ 22 / st", categorie: "componenten" },
  { id: "led", naam: "LED-verlichtingsstrips IP67", voorraad: 145, eenheid: "m", min: 60, leverancier: "Tronix", altLeverancier: "Osram", eta: "Vr", prijs: "€ 6 / m", categorie: "afwerking" },
];

export const LEVERINGEN: Levering[] = [
  { dag: "Ma", materiaal: "RVS plaat", leverancier: "Van Loon Staal", hoeveelheid: "400 kg", tijd: "08:00–10:00", status: "verwacht" },
  { dag: "Di", materiaal: "Thermostaten", leverancier: "Elektrotherm BV", hoeveelheid: "50 stuks", tijd: "11:00", status: "verwacht" },
  { dag: "Do", materiaal: "Aluminium plaat", leverancier: "Alustock", hoeveelheid: "200 kg", tijd: "09:30", status: "verwacht" },
  { dag: "Vr", materiaal: "Diverse componenten", leverancier: "Brammer NL", hoeveelheid: "gemengd pallet", tijd: "13:00", status: "verwacht" },
];

export const GEREED_PRODUCT: GereedProduct[] = [
  { id: "gp-1", omschrijving: "Kiremko K400 demo unit", aantal: 2, brand: "Kiremko", notitie: "Showroom Woerden" },
  { id: "gp-2", omschrijving: "Perfecta P3 standaard", aantal: 1, brand: "Perfecta", notitie: "Klant geannuleerd — beschikbaar" },
  { id: "gp-3", omschrijving: "Smitto compact", aantal: 3, brand: "Smitto", notitie: "Serieproductie — op voorraad" },
  { id: "gp-4", omschrijving: "HiFri accessoiresets", aantal: 24, brand: "HiFri", notitie: "Air-fry accessoires" },
];
