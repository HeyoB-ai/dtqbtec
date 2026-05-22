import { clamp } from "@/lib/utils";
import type {
  ScenarioAnalyse,
  ScenarioDomein,
  ScenarioParams,
  ImpactNiveau,
  DomeinImpact,
  TijdlijnTijd,
} from "@/lib/scenario/types";

function niveauVoorPct(pct: number): ImpactNiveau {
  if (pct >= 85) return "extreem";
  if (pct >= 60) return "kritiek";
  if (pct >= 35) return "verhoogd";
  if (pct >= 12) return "laag";
  return "geen";
}

const DUUR_FACTOR: Record<string, number> = {
  "1 week": 0.8,
  "2 weken": 0.9,
  "1 maand": 1.05,
  "3 maanden": 1.2,
  "6 maanden": 1.35,
};

const PRIORITEIT_FACTOR: Record<string, number> = {
  laag: 0.8,
  normaal: 1,
  hoog: 1.15,
  spoed: 1.3,
};

/**
 * Deterministic local heuristic used when the Claude API key is not configured,
 * so the scenario simulator remains fully functional offline.
 */
export function lokaleAnalyse(scenario: string, params: ScenarioParams): ScenarioAnalyse {
  const t = scenario.toLowerCase();
  const base =
    clamp(params.omvang, 5, 100) *
    (DUUR_FACTOR[params.duur] ?? 1) *
    (PRIORITEIT_FACTOR[params.prioriteit] ?? 1);
  const has = (...kw: string[]) => kw.some((k) => t.includes(k));

  const isOrder = has("order", "stadion", "keuken", "couvert", "binnenkomst");
  const isLeverancier = has("leverancier", "levering", "van loon", "rvs", "staal", "materiaal", "tekort", "aluminium");
  const isMachine = has("machine", "storing", "safan", "buig", "laser", "defect", "motor", "lasstation");
  const isPersoneel = has("personeel", "verzuim", "griep", "ziek", "medewerker", "bezetting");
  const isExport = has("export", "saudi", "saoedi", "buiten europa", "transport");
  const isTerugroep = has("terugroep", "recall", "batch", "thermostaat", "kwaliteit", "defecte");

  const dom = (domein: ScenarioDomein, factor: number, beschrijving: string): DomeinImpact => {
    const pct = Math.round(clamp(base * factor, 0, 100));
    return { domein, impactNiveau: niveauVoorPct(pct), impactPct: pct, beschrijving };
  };

  const domeinen: DomeinImpact[] = [
    dom(
      "productie",
      isMachine ? 1.35 : isPersoneel ? 1.2 : isOrder || isExport ? 1.05 : 0.7,
      isMachine
        ? "Plaatbewerking stagneert; buig- en snijcapaciteit fors verlaagd."
        : isPersoneel
          ? "Lagere bezetting op productielijnen vertraagt doorlooptijd."
          : isOrder || isExport
            ? "Extra capaciteit nodig; bestaande planning onder druk."
            : "Beperkte impact op productiecapaciteit.",
    ),
    dom(
      "levertijd",
      isOrder || isExport ? 1.3 : isMachine || isLeverancier ? 1.15 : isPersoneel ? 1.0 : 0.6,
      isOrder || isExport
        ? "Levertijden bestaande orders schuiven op door capaciteitsconflict."
        : isMachine || isLeverancier
          ? "Vertraging op orders die afhankelijk zijn van de getroffen stap."
          : "Lichte uitloop op geplande leverdata.",
    ),
    dom(
      "voorraad",
      isLeverancier ? 1.4 : isOrder || isExport ? 1.1 : 0.4,
      isLeverancier
        ? "Kritieke grondstoftekorten (RVS); alternatieve leveranciers nodig."
        : isOrder || isExport
          ? "Hogere materiaalbehoefte; herplanning inkoop vereist."
          : "Voorraadniveaus grotendeels toereikend.",
    ),
    dom(
      "service",
      isTerugroep ? 1.4 : 0.5,
      isTerugroep
        ? "Servicedienst overbelast door preventieve klantbezoeken."
        : "Reguliere servicecapaciteit blijft beschikbaar.",
    ),
    dom(
      "financieel",
      isExport || isTerugroep ? 1.15 : isLeverancier || isMachine ? 1.0 : 0.8,
      isTerugroep
        ? "Kosten terugroepactie + reputatierisico; mogelijke claims."
        : isExport
          ? "Grote omzetkans, maar export- en transportkosten en risico."
          : "Margedruk door meerkosten en/of vertraging.",
    ),
    dom(
      "personeel",
      isPersoneel ? 1.45 : isOrder || isExport ? 1.0 : 0.5,
      isPersoneel
        ? "Onderbezetting; overwerk en inhuur nodig om planning te halen."
        : isOrder || isExport
          ? "Extra inzet en mogelijk overwerk om volume te halen."
          : "Personele impact beperkt.",
    ),
  ];

  const operationeleStress = Math.round(
    clamp(domeinen.reduce((s, d) => s + d.impactPct, 0) / domeinen.length + 6, 0, 100),
  );

  const tijden: TijdlijnTijd[] = ["Nu", "Dag 1", "Week 1", "Week 2", "Maand 1", "Maand 3"];
  const curve = [0.5, 0.85, 1.0, 0.8, 0.55, 0.25];
  const tijdlijn = tijden.map((tijd, i) => ({
    tijd,
    stress: Math.round(clamp(operationeleStress * curve[i] + (i === 2 ? 4 : 0), 0, 100)),
  }));

  const materialen = isLeverancier
    ? ["RVS plaat 2mm & 3mm — directe nabestelling bij MCB Nederland (alt. leverancier)", "Buffervoorraad aanspreken; allocatie naar spoedorders", "Aluminium 1,5mm bij Nedal als terugval"]
    : isOrder || isExport
      ? ["RVS plaat 2/3mm — extra volume inplannen", "Gasbranders & thermostaten — voorraad checken vs. seriegrootte", "Touchscreen-besturingen — levertijd Siemens verifiëren"]
      : isMachine
        ? ["Vervangend onderdeel buigsysteem (hoofdmotor) — Safan Darley service", "Tijdelijk buigwerk uitbesteden aan partner"]
        : isTerugroep
          ? ["Vervangende thermostaten (23+ stuks) — Elektrotherm spoedlevering", "Reserveonderdelen werkbussen aanvullen"]
          : ["Reguliere grondstofstroom toereikend"];

  const financ = isExport
    ? "Omzetkans ca. € 1,8–2,4 mln; export-/transportkosten en valutarisico meewegen."
    : isTerugroep
      ? "Geschatte kosten terugroep € 80k–140k (onderdelen, monteursinzet, logistiek), excl. reputatie."
      : isMachine
        ? "Stilstandkosten + onderdeel/reparatie geschat € 25k–60k, afhankelijk van duur."
        : isLeverancier
          ? "Meerkosten alternatieve inkoop + vertragingsboetes geschat € 30k–90k."
          : isPersoneel
            ? "Overwerk-/inhuurkosten geschat € 20k–50k over de periode."
            : "Beperkte financiële impact verwacht.";

  return {
    scenarioNaam:
      scenario.length > 60 ? scenario.slice(0, 57).trim() + "…" : scenario || "Aangepast scenario",
    operationeleStress,
    domeinen,
    directeGevolgen: [
      "Productieplanning herzien; operationeel team en planning bijeengeroepen.",
      isLeverancier
        ? "Inkoop activeert alternatieve leveranciers (MCB, Nedal) en buffervoorraad."
        : isMachine
          ? "Buigwerk tijdelijk herverdeeld; servicepartner ingeschakeld voor onderdeel."
          : isOrder || isExport
            ? "Capaciteitsplanning herzien; serieproductie en shifts beoordeeld."
            : isTerugroep
              ? "Servicedienst plant preventieve klantbezoeken; remote diagnostics ingezet."
              : "Impact gemonitord; afdelingshoofden geïnformeerd.",
      "Betrokken klanten proactief geïnformeerd over eventuele leverwijzigingen.",
    ],
    kettingreacties: [
      isMachine
        ? "Buigsysteem uit → plaatbewerking stokt → lassen/assemblage krijgen geen toevoer → levertijden lopen op."
        : isLeverancier
          ? "Geen RVS → plaatbewerking stilgelegd → alle bakwand-/frituurorders vertragen → leverboetes."
          : isOrder || isExport
            ? "Spoedorder → capaciteit verschuift → bestaande orders vertragen → klanttevredenheid onder druk."
            : isPersoneel
              ? "Onderbezetting → lagere output → orders schuiven op → overwerk verhoogt verzuimrisico."
              : "Verstoring in één stap plant zich voort door de productieketen.",
      "Toegenomen druk op planning vergroot kans op fouten en herwerk.",
    ],
    knelpunten: [
      isMachine
        ? "Safan Darley buigsysteem is de bottleneck — geen redundantie."
        : isLeverancier
          ? "Afhankelijkheid van één RVS-hoofdleverancier (Van Loon Staal)."
          : isOrder || isExport
            ? "Assemblagecapaciteit (3 lijnen) en QC/eindtest zijn de beperkende factor."
            : isPersoneel
              ? "Gespecialiseerde lassers en assemblage zijn moeilijk te vervangen."
              : "Doorstroom tussen plaatbewerking, lassen en assemblage.",
      isTerugroep
        ? "Beschikbaarheid monteurs vs. lopende servicecontracten (1.247 klanten)."
        : "Coördinatie tussen productie, inkoop en servicedienst.",
    ],
    materialen,
    financ,
    acties: [
      {
        prioriteit: "hoog",
        actie: isMachine
          ? "Schakel Safan Darley service in voor spoedreparatie; regel tijdelijk uitbesteed buigwerk."
          : isLeverancier
            ? "Activeer alternatieve RVS-leveranciers (MCB, Nedal) en alloceer buffervoorraad aan spoedorders."
            : isOrder || isExport
              ? "Herplan capaciteit: serieproductie, extra shift en heronderhandel kritieke leverdata."
              : isTerugroep
                ? "Plan 23 preventieve klantbezoeken; zet beschikbare monteurs en remote diagnostics in."
                : "Stel een capaciteitsplan op en beoordeel de impact per order.",
      },
      {
        prioriteit: "hoog",
        actie: "Informeer betrokken klanten proactief en leg afspraken vast over (her)leverdata.",
      },
      {
        prioriteit: "midden",
        actie: isPersoneel
          ? "Regel tijdelijke inhuur en overwerk; herverdeel taken over beschikbare medewerkers."
          : "Bewaak voorraad en inkoop dagelijks; stuur bij op kritieke materialen.",
      },
      { prioriteit: "laag", actie: "Evalueer na afloop en borg lessen in planning en leveranciersbeleid." },
    ],
    herstelprognose:
      operationeleStress > 75
        ? "Volledig herstel verwacht binnen 4–8 weken, afhankelijk van leverancier/onderdeel."
        : operationeleStress > 45
          ? "Normalisatie verwacht binnen 2–4 weken na de piek."
          : "Situatie normaliseert naar verwachting binnen 1–2 weken.",
    tijdlijn,
    bron: "lokaal",
  };
}
