"use client";

import { useMemo, useState } from "react";
import {
  Globe2, MapPin, Wrench, CalendarClock, ShieldCheck, History,
  TrendingUp, Package, Sparkles, Building2,
} from "lucide-react";
import { Panel, MetricRow } from "@/components/shared/Panel";
import { Badge } from "@/components/ui/badge";
import { QbtecMap } from "@/components/map/QbtecMap";
import { PointLayer, type MapPoint } from "@/components/map/PointLayer";
import { clamp, nlNumber } from "@/lib/utils";
import {
  LANDEN, INSTALLATIES, installatiesPerLand, maandJaar, leeftijd, TOTAAL_INSTALLATIES,
} from "@/lib/data/installaties";
import { brandColor } from "@/lib/data/brands";
import type { Installatie } from "@/lib/types";

function ageYears(iso: string, nu = new Date()): number {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 0;
  return Math.max(0, (nu.getTime() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export default function InstallatiesPage() {
  const [land, setLand] = useState<string>("Nederland");
  const [instId, setInstId] = useState<string>("inst-featured");

  const points = useMemo<MapPoint[]>(
    () =>
      LANDEN.map((l) => ({
        id: l.land,
        naam: l.land,
        center: l.center,
        kleur: l.land === land ? "#f59042" : "#E8650A",
        radius: clamp(8 + Math.sqrt(l.installaties) / 3, 9, 30),
        label: `${l.land}\n${nlNumber(l.installaties)}`,
      })),
    [land],
  );

  const landInstallaties = useMemo(() => installatiesPerLand(land).slice(0, 10), [land]);
  const inst = INSTALLATIES.find((i) => i.id === instId) ?? INSTALLATIES[0];
  const landData = LANDEN.find((l) => l.land === land);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* country chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-semibold text-primary">
          {nlNumber(TOTAAL_INSTALLATIES)} installaties in Europa
        </span>
        {LANDEN.map((l) => (
          <button
            key={l.land}
            onClick={() => setLand(l.land)}
            className={`rounded-lg border px-2.5 py-1.5 transition-colors ${
              l.land === land ? "border-primary/50 bg-primary/10 text-foreground" : "border-border bg-card/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.land} <span className="tabular text-muted-foreground">{nlNumber(l.installaties)}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Europe map */}
        <Panel title="Geïnstalleerde base — Europa" icon={<Globe2 className="h-4 w-4 text-primary" />} bodyClassName="p-0">
          <QbtecMap center={[8, 50]} zoom={3.4} height={480}>
            <PointLayer id="landen" points={points} onSelect={setLand} selectedId={land} radius={12} labels />
          </QbtecMap>
        </Panel>

        {/* Lifecycle panel */}
        <Panel title="Installatie lifecycle" icon={<History className="h-4 w-4 text-primary" />}>
          <LifecyclePanel inst={inst} />
        </Panel>
      </div>

      {/* Top customers in selected country */}
      <Panel
        title={`Top klanten — ${land}`}
        icon={<Building2 className="h-4 w-4 text-primary" />}
        action={<span className="text-[11px] text-muted-foreground">{landData ? `${nlNumber(landData.installaties)} totaal · top ${landInstallaties.length} getoond` : ""}</span>}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left font-medium">Klant</th>
                <th className="px-3 py-2 text-left font-medium">Merk · product</th>
                <th className="px-3 py-2 text-left font-medium">Geïnstalleerd</th>
                <th className="px-3 py-2 text-left font-medium">Contract</th>
                <th className="px-3 py-2 text-left font-medium">Laatste service</th>
                <th className="px-3 py-2 text-left font-medium">Volgend onderhoud</th>
              </tr>
            </thead>
            <tbody>
              {landInstallaties.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => setInstId(i.id)}
                  className={`cursor-pointer border-b border-border/40 transition-colors hover:bg-secondary/40 ${i.id === instId ? "bg-secondary/60" : ""}`}
                >
                  <td className="px-3 py-2"><span className="font-medium">{i.klant}</span><span className="block text-[11px] text-muted-foreground">{i.stad}</span></td>
                  <td className="px-3 py-2">
                    <span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full" style={{ background: brandColor(i.brand) }} />{i.brand}</span>
                    <span className="block text-[11px] text-muted-foreground">{i.product}</span>
                  </td>
                  <td className="px-3 py-2 text-xs">{maandJaar(i.installDatum)}</td>
                  <td className="px-3 py-2">
                    {i.servicecontract
                      ? <Badge variant="success" className="px-1.5 py-0 text-[10px]">{i.contractType}</Badge>
                      : <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Geen</Badge>}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{maandJaar(i.laatsteOnderhoud)}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{maandJaar(i.volgendeOnderhoud)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function LifecyclePanel({ inst }: { inst: Installatie }) {
  const jaren = ageYears(inst.installDatum);
  const restMin = Math.max(2, Math.round(14 - jaren));
  const restMax = Math.max(4, Math.round(18 - jaren));
  const upgrade = inst.brand === "HiFri" ? "Installatie up-to-date" : "HiFri air-fry module beschikbaar";

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: brandColor(inst.brand) }} />
          <span className="text-sm font-bold">{inst.product}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {inst.klant}, {inst.stad}
        </div>
      </div>

      <div className="space-y-0.5 text-sm">
        <MetricRow label="Geïnstalleerd" value={maandJaar(inst.installDatum)} />
        <MetricRow label="Leeftijd" value={leeftijd(inst.installDatum)} />
        <MetricRow
          label={<span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Servicecontract</span>}
          value={inst.servicecontract ? inst.contractType : "Geen"}
          accent={inst.servicecontract ? "#3fb950" : undefined}
        />
        <MetricRow label={<span className="flex items-center gap-1"><Wrench className="h-3.5 w-3.5" /> Laatste onderhoud</span>} value={maandJaar(inst.laatsteOnderhoud)} />
        <MetricRow label={<span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> Volgende onderhoud</span>} value={maandJaar(inst.volgendeOnderhoud)} accent="#E8650A" />
        <MetricRow label="Totaal servicebezoeken" value={inst.bezoeken} />
        <MetricRow label={<span className="flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5" /> Resterende levensduur</span>} value={`${restMin}–${restMax} jaar`} />
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Package className="h-3.5 w-3.5" /> Onderdelen vervangen
        </div>
        {inst.vervangenOnderdelen.length ? (
          <div className="flex flex-wrap gap-1.5">
            {inst.vervangenOnderdelen.map((o, i) => (
              <span key={i} className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                {o.onderdeel} <span className="text-foreground/60">({o.jaar})</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground">Nog geen onderdelen vervangen.</span>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-success/20 bg-success/5 p-2.5 text-xs">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
        <span><span className="font-medium text-foreground">Upgrade-advies:</span> {upgrade}</span>
      </div>
    </div>
  );
}
