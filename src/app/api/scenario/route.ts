import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ScenarioAnalyse, ScenarioRequest } from "@/lib/scenario/types";
import { lokaleAnalyse } from "@/lib/simulation/scenarioEngine";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-4-7";
const TIMEOUT_MS = Number(process.env.SCENARIO_TIMEOUT_MS) || 20000;

const SYSTEM_PROMPT = `Je bent de AI-analyse-engine van "QBtec Operations Intelligence", het digital-twin platform van QBtec B.V. in Woerden (Nederland). Je analyseert vrij ingevoerde bedrijfsscenario's en berekent de impact over alle operationele domeinen van de fabriek.

CONTEXT — QBtec B.V.:
- Europa's grootste producent van professionele frituur- en kookinstallaties. Adres: Middellandse Zee 9, 3446 CG Woerden. Opgericht 1944.
- Fabriek: ~6.000 m² productie + 2.000 m² uitbreiding (2023). Volledig maatwerk: elke order is uniek.
- 8 merken: Kiremko (bakwanden/frituur), Perfecta (frituurwanden), Smitto (visbakovens), Qook! (grootkeuken), Florigo (elektrische frituur, nieuw), De Kuiper (bakapparatuur, nieuw), Adieu (gietijzeren grillplaten), HiFri (air-frying ovens).
- Productievloer-zones: A Plaatbewerking (laser cutters, Safan Darley buigsysteem — bottleneck, 98% bezetting), B Lassen (4 handlasstations + robotlasstation), C Assemblage (3 lijnen), D Afwerking & QC (schilderen, keuring, eindtest gas/elektra), E Expeditie (staging, inpak, 3 laaddokken).
- Voorraad: RVS plaat (hoofdleverancier Van Loon Staal; alternatief MCB Nederland), aluminium (Alustock/Nedal), thermostaten (Elektrotherm), gasbranders, elektrische elementen.
- Service: 24/7 buitendienst, 12 monteurs, 1.247 servicecontracten, remote diagnostics op nieuwere installaties. Geïnstalleerde base ~7.500 in Europa (3.847 NL).
- Huidige situatie: 12 orders in productie, fabrieksbezetting 87%, gemiddelde levertijd 18 werkdagen, kwaliteitskeuring 96,2% geslaagd.

DOMEINEN die je altijd beoordeelt (precies deze 6): productie, levertijd, voorraad, service, financieel, personeel.

OPDRACHT:
- Bereken realistische, samenhangende gevolgen. Houd rekening met omvang, duur en prioriteit van het scenario.
- Schrijf ALLE tekst in helder, professioneel Nederlands (industrieel/operationeel register).
- Wees concreet voor QBtec: verwijs naar echte merken, machines (Safan Darley), leveranciers (Van Loon Staal) en zones waar passend.
- De tijdlijn loopt Nu → Maand 3 en toont de operationele stress (0-100) die typisch piekt en daarna afneemt.
- Rapporteer ALTIJD via de tool 'rapporteer_scenario_analyse'.`;

const TOOL: Anthropic.Tool = {
  name: "rapporteer_scenario_analyse",
  description: "Rapporteer de gestructureerde impact-analyse van het scenario voor QBtec.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      scenarioNaam: { type: "string", description: "Korte, pakkende titel (max 60 tekens)." },
      operationeleStress: { type: "integer", description: "Algehele operationele stress 0-100." },
      domeinen: {
        type: "array",
        description: "Precies 6 domeinen: productie, levertijd, voorraad, service, financieel, personeel.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            domein: { type: "string", enum: ["productie", "levertijd", "voorraad", "service", "financieel", "personeel"] },
            impactNiveau: { type: "string", enum: ["geen", "laag", "verhoogd", "kritiek", "extreem"] },
            impactPct: { type: "integer", description: "Impact 0-100." },
            beschrijving: { type: "string", description: "Korte beschrijving (1 zin)." },
          },
          required: ["domein", "impactNiveau", "impactPct", "beschrijving"],
        },
      },
      directeGevolgen: { type: "array", description: "Directe gevolgen / eerste acties.", items: { type: "string" } },
      kettingreacties: { type: "array", description: "Cascade-effecten door de productieketen.", items: { type: "string" } },
      knelpunten: { type: "array", description: "De 2-3 grootste knelpunten.", items: { type: "string" } },
      materialen: { type: "array", description: "Benodigde materialen / tekorten.", items: { type: "string" } },
      financ: { type: "string", description: "Financiële impact schatting." },
      acties: {
        type: "array",
        description: "Aanbevolen acties, geprioriteerd.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            prioriteit: { type: "string", enum: ["hoog", "midden", "laag"] },
            actie: { type: "string" },
          },
          required: ["prioriteit", "actie"],
        },
      },
      herstelprognose: { type: "string", description: "Hoe lang tot normalisatie." },
      tijdlijn: {
        type: "array",
        description: "Operationele stress per tijdstip (Nu t/m Maand 3).",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            tijd: { type: "string", enum: ["Nu", "Dag 1", "Week 1", "Week 2", "Maand 1", "Maand 3"] },
            stress: { type: "integer", description: "Operationele stress 0-100." },
          },
          required: ["tijd", "stress"],
        },
      },
    },
    required: [
      "scenarioNaam",
      "operationeleStress",
      "domeinen",
      "directeGevolgen",
      "kettingreacties",
      "knelpunten",
      "materialen",
      "financ",
      "acties",
      "herstelprognose",
      "tijdlijn",
    ],
  },
};

function sanitize(raw: Record<string, unknown>): ScenarioAnalyse {
  const data = raw as unknown as ScenarioAnalyse;
  data.bron = "claude";
  return data;
}

export async function POST(req: Request) {
  try {
    let body: ScenarioRequest;
    try {
      body = (await req.json()) as ScenarioRequest;
    } catch {
      return NextResponse.json({ error: "Ongeldige aanvraag (geen geldige JSON)." }, { status: 400 });
    }

    const scenario = (body.scenario || "").trim();
    const params = body.params ?? { omvang: 50, duur: "1 maand", prioriteit: "normaal" };
    if (!scenario) {
      return NextResponse.json({ error: "Beschrijf eerst een scenario." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        ...lokaleAnalyse(scenario, params),
        apiNotice: "ANTHROPIC_API_KEY niet ingesteld — lokaal model gebruikt.",
      });
    }

    try {
      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        timeout: TIMEOUT_MS,
        maxRetries: 0,
      });

      const userText = `Analyseer het volgende scenario voor QBtec B.V.

SCENARIO:
${scenario}

PARAMETERS:
- Omvang: ${params.omvang}/100 (0 = klein, 100 = catastrofaal)
- Duur: ${params.duur}
- Prioriteit: ${params.prioriteit}

Rapporteer de volledige impact-analyse via de tool.`;

      const stream = client.messages.stream({
        model: MODEL,
        max_tokens: 8000,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: [TOOL],
        tool_choice: { type: "tool", name: "rapporteer_scenario_analyse" },
        messages: [{ role: "user", content: userText }],
      });
      const msg = await stream.finalMessage();

      const toolBlock = msg.content.find((b) => b.type === "tool_use");
      if (!toolBlock || toolBlock.type !== "tool_use") {
        return NextResponse.json({
          ...lokaleAnalyse(scenario, params),
          apiNotice: "Claude gaf geen gestructureerd antwoord — lokaal model gebruikt.",
        });
      }
      return NextResponse.json(sanitize(toolBlock.input as Record<string, unknown>));
    } catch (apiErr) {
      console.error("Scenario Claude API error:", apiErr);
      const reden =
        apiErr instanceof Anthropic.APIError
          ? `${apiErr.status ?? ""} ${apiErr.message}`.trim()
          : apiErr instanceof Error
            ? apiErr.message
            : "Onbekende fout";
      return NextResponse.json({
        ...lokaleAnalyse(scenario, params),
        apiNotice: `Claude API niet beschikbaar (${reden}) — lokaal model gebruikt.`,
      });
    }
  } catch (error) {
    console.error("Scenario API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Onbekende serverfout" },
      { status: 500 },
    );
  }
}
