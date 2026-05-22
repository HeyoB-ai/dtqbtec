"use client";

import {
  DoorOpen, Car, Phone, Users, PhoneCall, PhoneMissed, Clock, Truck,
  LogIn, LogOut, Cpu, ShieldCheck, Briefcase, UserPlus,
} from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import { Panel } from "@/components/shared/Panel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  VERGADERZALEN, PARKEREN, TELEFOON, PERSONEEL,
  MAX_CAPACITEIT, BHV_GRENS, capaciteitKleur, CATEGORIE_KLEUR, CATEGORIE_LABEL,
} from "@/lib/data/facilities";
import type { AanwezigheidRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

const CAT_ICON = { medewerker: Users, extern: Briefcase, bezoeker: UserPlus } as const;

function actieLabel(rec: AanwezigheidRecord): string {
  if (rec.categorie === "bezoeker") return rec.actie === "in" ? "aangemeld balie" : "afgemeld";
  return rec.actie === "in" ? "ingecheckt" : "uitgecheckt";
}

export default function FaciliteitenPage() {
  const { reading, aanwezigheid: a } = useLiveData();
  const parkeerBezet = reading ? reading.parkeerBezet : PARKEREN.bezet;
  const parkeerPct = Math.round((parkeerBezet / PARKEREN.totaal) * 100);
  const servicelijnActief = reading ? reading.servicelijnActief : TELEFOON.servicelijnActief;
  const servicelijnWacht = reading ? reading.servicelijnWacht : TELEFOON.servicelijnWacht;
  const verkoopActief = reading ? reading.verkoopActief : TELEFOON.verkoopActief;

  const capPct = Math.round((a.totaalOpLocatie / MAX_CAPACITEIT) * 100);
  const capKleur = capaciteitKleur(a.totaalOpLocatie);
  const bhvPct = (BHV_GRENS / MAX_CAPACITEIT) * 100;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Aanwezigheid op locatie ── */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Panel
          title="Aanwezigheid op locatie"
          icon={<Users className="h-4 w-4 text-primary" />}
          action={
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              live
            </span>
          }
        >
          {/* total + capacity */}
          <div className="rounded-lg border border-border bg-card/40 p-3">
            <div className="flex items-end justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tabular" style={{ color: capKleur }}>{a.totaalOpLocatie}</span>
                <span className="text-sm text-muted-foreground">/ {MAX_CAPACITEIT} max capaciteit</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: capKleur }}>{capPct}%</span>
            </div>
            <div className="relative mt-2">
              <Progress value={capPct} indicatorColor={capKleur} className="h-2.5" />
              {/* BHV grens marker */}
              <div className="absolute -top-1 bottom-[-4px] w-px bg-critical/70" style={{ left: `${bhvPct}%` }} />
              <div className="absolute -bottom-4 -translate-x-1/2 text-[9px] text-critical/80" style={{ left: `${bhvPct}%` }}>
                BHV {BHV_GRENS}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
              <span>🟢 &lt; 80 normaal</span>
              <span>🟠 80–100 verhoogd</span>
              <span>🔴 &gt; 100 ontruimingsgrens</span>
            </div>
          </div>

          {/* category cards */}
          <div className="mt-3 grid gap-2.5 md:grid-cols-3">
            <CategoryCard
              categorie="medewerker"
              totaal={a.medewerkers.totaal}
              context={`van ${PERSONEEL.totaal} in dienst`}
              breakdown={a.medewerkers.perAfdeling}
            />
            <CategoryCard categorie="extern" totaal={a.externen.totaal} context="ingehuurd vandaag" breakdown={a.externen.perType} />
            <CategoryCard categorie="bezoeker" totaal={a.bezoekers.totaal} context="aangemeld balie" breakdown={a.bezoekers.perType} />
          </div>

          {/* sensor context + privacy */}
          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2 rounded-lg border border-info/20 bg-info/5 p-2.5 text-[11px] text-muted-foreground">
              <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0 text-info" />
              <span>
                Gemeten via <span className="text-foreground">ESP32 met PIR-sensoren</span> bij toegangspoorten en
                badgereaders. Bezoekers worden aangemeld via iPad receptie (balie-app).
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-border bg-card/40 p-2.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                Persoonsgegevens worden verwerkt conform <span className="text-foreground">AVG</span>. Namen van
                medewerkers worden alleen getoond voor geautoriseerde gebruikers.
              </span>
            </div>
          </div>
        </Panel>

        {/* live check-in/out log */}
        <Panel title="Check-in / check-out" icon={<DoorOpen className="h-4 w-4 text-primary" />} bodyClassName="p-0">
          <div className="max-h-[460px] divide-y divide-border/50 overflow-y-auto">
            {a.log.map((rec) => {
              const kleur = CATEGORIE_KLEUR[rec.categorie];
              const Icon = rec.actie === "in" ? LogIn : LogOut;
              return (
                <div key={rec.id} className="flex items-center gap-2.5 px-3 py-2 text-xs">
                  <span className="w-10 shrink-0 font-mono tabular text-muted-foreground">{rec.tijdstip}</span>
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", rec.actie === "in" ? "text-success" : "text-muted-foreground")} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{rec.naam ?? rec.afdeling ?? rec.type ?? "—"}</div>
                    <div className="truncate text-[10px] text-muted-foreground">
                      {rec.afdeling ?? rec.type ?? ""} · {actieLabel(rec)}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: `${kleur}22`, color: kleur }}>
                    {CATEGORIE_LABEL[rec.categorie]}
                  </span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* ── Ruimtes, parkeren, telefonie ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Meeting rooms */}
        <Panel title="Vergaderzalen — kantoor Woerden" icon={<DoorOpen className="h-4 w-4 text-primary" />} bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left font-medium">Ruimte</th>
                <th className="px-2 py-2 text-right font-medium">Cap.</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Tot</th>
              </tr>
            </thead>
            <tbody>
              {VERGADERZALEN.map((r) => (
                <tr key={r.ruimte} className="border-b border-border/40">
                  <td className="px-4 py-2.5"><span className="font-medium">{r.ruimte}</span><span className="block text-[11px] text-muted-foreground">{r.type}</span></td>
                  <td className="px-2 py-2.5 text-right tabular text-muted-foreground">{r.capaciteit}</td>
                  <td className="px-3 py-2.5">
                    {r.bezet
                      ? <Badge variant="warning" className="px-1.5 py-0 text-[10px]">Bezet ({r.aanwezig})</Badge>
                      : <Badge variant="success" className="px-1.5 py-0 text-[10px]">Vrij</Badge>}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-muted-foreground">{r.tot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        {/* Parking */}
        <Panel title="Parkeerplaatsen — Middellandse Zee 9" icon={<Car className="h-4 w-4 text-primary" />}>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold tabular">{parkeerBezet}<span className="text-base font-normal text-muted-foreground">/{PARKEREN.totaal}</span></span>
            <span className={cn("text-sm font-semibold", parkeerPct > 85 ? "text-warning" : "text-muted-foreground")}>{parkeerPct}% bezet</span>
          </div>
          <Progress value={parkeerPct} indicatorColor={parkeerPct > 85 ? "#d29922" : "#E8650A"} className="mt-2 h-2" />

          <div className="mt-4 grid grid-cols-9 gap-1.5">
            {Array.from({ length: PARKEREN.totaal }).map((_, i) => {
              const isVan = i < PARKEREN.werkbussenAanwezig;
              const isVisitor = i >= PARKEREN.totaal - PARKEREN.bezoekers;
              const bezet = i < parkeerBezet;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-6 items-center justify-center rounded text-[8px]",
                    !bezet ? "border border-border bg-card/30 text-transparent"
                      : isVan ? "bg-info/70 text-ink"
                      : isVisitor ? "bg-success/70 text-ink"
                      : "bg-primary/70 text-ink",
                  )}
                  title={!bezet ? "Vrij" : isVan ? "Werkbus" : isVisitor ? "Bezoeker" : "Personeel"}
                >
                  {bezet && isVan ? "B" : ""}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-info/70" /> Werkbussen ({PARKEREN.werkbussenAanwezig}/{PARKEREN.werkbussenTotaal})</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-primary/70" /> Personeel</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-success/70" /> Bezoekers ({PARKEREN.bezoekers})</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded border border-border" /> Vrij</span>
          </div>
        </Panel>

        {/* Telephony */}
        <Panel title="Telefoonlijnen & bereikbaarheid" icon={<Phone className="h-4 w-4 text-primary" />} className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Servicelijn</div>
                    <div className="font-mono text-xs text-muted-foreground">{TELEFOON.servicelijn}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-success"><PhoneCall className="h-3.5 w-3.5" /> {servicelijnActief} actief</span>
                    <span className="text-muted-foreground">{servicelijnWacht} in wacht</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Verkoop</div>
                    <div className="font-mono text-xs text-muted-foreground">{TELEFOON.verkoop}</div>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-success"><PhoneCall className="h-3.5 w-3.5" /> {verkoopActief} actief</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-card/40 p-2.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> Gem. wachttijd</div>
                <div className="mt-0.5 text-lg font-bold tabular">{TELEFOON.gemiddeldeWachttijd}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/40 p-2.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><PhoneMissed className="h-3 w-3" /> Gemiste oproepen</div>
                <div className="mt-0.5 text-lg font-bold tabular">{TELEFOON.gemisteOproepen}</div>
              </div>
              <div className="rounded-lg border border-border bg-card/40 p-2.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Truck className="h-3 w-3" /> Buitendienst</div>
                <div className="mt-0.5 text-lg font-bold tabular">{PERSONEEL.serviceBuitendienst} <span className="text-xs font-normal text-muted-foreground">onderweg</span></div>
              </div>
              <div className="rounded-lg border border-border bg-card/40 p-2.5">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Users className="h-3 w-3" /> Afwezig</div>
                <div className="mt-0.5 text-lg font-bold tabular">{PERSONEEL.afwezig} <span className="text-xs font-normal text-muted-foreground">ziek/verlof</span></div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function CategoryCard({
  categorie,
  totaal,
  context,
  breakdown,
}: {
  categorie: "medewerker" | "extern" | "bezoeker";
  totaal: number;
  context: string;
  breakdown: Record<string, number>;
}) {
  const kleur = CATEGORIE_KLEUR[categorie];
  const Icon = CAT_ICON[categorie];
  const labelPlural = categorie === "medewerker" ? "Medewerkers" : categorie === "extern" ? "Externen" : "Bezoekers";
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3" style={{ borderTopColor: kleur, borderTopWidth: 2 }}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Icon className="h-3.5 w-3.5" style={{ color: kleur }} /> {labelPlural}
        </span>
        <span className="rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: `${kleur}22`, color: kleur }}>aanwezig</span>
      </div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tabular" style={{ color: kleur }}>{totaal}</span>
        <span className="text-[10px] text-muted-foreground">{context}</span>
      </div>
      <div className="mt-2 space-y-1">
        {Object.entries(breakdown).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2 text-[11px]">
            <span className="min-w-0 truncate text-muted-foreground">{k}</span>
            <span className="shrink-0 font-medium tabular">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
