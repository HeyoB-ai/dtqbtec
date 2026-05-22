export type ScenarioDomein =
  | "productie"
  | "levertijd"
  | "voorraad"
  | "service"
  | "financieel"
  | "personeel";

export type ImpactNiveau = "geen" | "laag" | "verhoogd" | "kritiek" | "extreem";

export type TijdlijnTijd = "Nu" | "Dag 1" | "Week 1" | "Week 2" | "Maand 1" | "Maand 3";

export interface DomeinImpact {
  domein: ScenarioDomein;
  impactNiveau: ImpactNiveau;
  impactPct: number; // 0-100
  beschrijving: string;
}

export interface ScenarioActie {
  prioriteit: "hoog" | "midden" | "laag";
  actie: string;
}

export interface TijdlijnPunt {
  tijd: TijdlijnTijd;
  stress: number; // 0-100
}

export interface ScenarioAnalyse {
  scenarioNaam: string;
  operationeleStress: number; // 0-100
  domeinen: DomeinImpact[];
  directeGevolgen: string[];
  kettingreacties: string[];
  knelpunten: string[];
  materialen: string[]; // benodigde materialen / tekorten
  financ: string; // financiële impact schatting
  acties: ScenarioActie[];
  herstelprognose: string;
  tijdlijn: TijdlijnPunt[];
  bron: "claude" | "lokaal";
  /** Optional notice surfaced when Claude was unavailable and the local engine ran. */
  apiNotice?: string;
}

export interface ScenarioParams {
  omvang: number; // 0-100 (klein → catastrofaal)
  duur: string;
  prioriteit: string;
}

export interface ScenarioRequest {
  scenario: string;
  params: ScenarioParams;
}

export const DOMEIN_LABEL: Record<ScenarioDomein, string> = {
  productie: "Productiecapaciteit",
  levertijd: "Levertijden",
  voorraad: "Voorraad & inkoop",
  service: "Servicedienst",
  financieel: "Financieel",
  personeel: "Personeel",
};

export const IMPACT_KLEUR: Record<ImpactNiveau, string> = {
  geen: "#6b7280",
  laag: "#3fb950",
  verhoogd: "#d29922",
  kritiek: "#E8650A",
  extreem: "#f85149",
};

export const IMPACT_LABEL: Record<ImpactNiveau, string> = {
  geen: "Geen",
  laag: "Laag",
  verhoogd: "Verhoogd",
  kritiek: "Kritiek",
  extreem: "Extreem",
};

export const DUUR_OPTIES = ["1 week", "2 weken", "1 maand", "3 maanden", "6 maanden"];
export const PRIORITEIT_OPTIES = ["laag", "normaal", "hoog", "spoed"];

export const PRESETS: {
  id: string;
  emoji: string;
  titel: string;
  omschrijving: string;
  prompt: string;
  omvang: number;
  duur: string;
  prioriteit: string;
}[] = [
  {
    id: "grote-order",
    emoji: "📈",
    titel: "Grote order binnenkomst",
    omschrijving: "Stadionkeuken 200 personen — spoed 6 weken",
    prompt:
      "Er komt een grote spoedorder binnen: een complete stadionkeuken voor 200 couverts, gewenste levertijd 6 weken. Dit valt boven op de huidige 12 orders in productie.",
    omvang: 70,
    duur: "2 weken",
    prioriteit: "spoed",
  },
  {
    id: "leverancier-uitval",
    emoji: "🚚",
    titel: "Leverancier uitval",
    omschrijving: "RVS leverancier Van Loon — 4 weken geen levering",
    prompt:
      "RVS-leverancier Van Loon Staal kan 4 weken lang niet leveren door een storing in hun productie. RVS plaat 2mm en 3mm zijn essentieel voor vrijwel alle lopende orders.",
    omvang: 75,
    duur: "1 maand",
    prioriteit: "hoog",
  },
  {
    id: "machine-storing",
    emoji: "⚙️",
    titel: "Machine storing",
    omschrijving: "Safan Darley buigsysteem — hoofdmotor defect",
    prompt:
      "Het Safan Darley buigsysteem (98% bezetting) valt uit door een defecte hoofdmotor. Reparatie of vervangend onderdeel duurt naar schatting 1-2 weken. Buigwerk is een bottleneck voor alle plaatbewerking.",
    omvang: 65,
    duur: "1 week",
    prioriteit: "hoog",
  },
  {
    id: "personeel-uitval",
    emoji: "🤒",
    titel: "Personeel uitval",
    omschrijving: "Griepgolf — 30% verzuim productie",
    prompt:
      "Een griepgolf zorgt voor 30% verzuim in de productie. Van de 45 productiemedewerkers zijn er circa 14 afwezig, verspreid over plaatbewerking, lassen en assemblage.",
    omvang: 55,
    duur: "2 weken",
    prioriteit: "normaal",
  },
  {
    id: "exportorder",
    emoji: "🌍",
    titel: "Exportorder grote klant",
    omschrijving: "Saudi Arabia chain — 50 Kiremko units",
    prompt:
      "Een grote keten in Saoedi-Arabië plaatst een exportorder voor 50 Kiremko frituurunits met een gewenste levertijd van 3 maanden. Dit vereist serieproductie, exportkeuringen en transport buiten Europa.",
    omvang: 85,
    duur: "3 maanden",
    prioriteit: "hoog",
  },
  {
    id: "terugroep",
    emoji: "⚠️",
    titel: "Kwaliteitsterugroepactie",
    omschrijving: "Batch thermostaten defect — 23 installaties",
    prompt:
      "Een batch thermostaten blijkt defect. 23 installaties bij klanten zijn getroffen en moeten preventief worden bezocht. Dit raakt zowel de servicedienst als de reputatie en lopende productie.",
    omvang: 60,
    duur: "2 weken",
    prioriteit: "spoed",
  },
];
