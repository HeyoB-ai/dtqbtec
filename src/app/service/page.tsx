"use client";

import { useState } from "react";
import {
  Wrench, MapPin, User, Truck, Clock, Radio, Activity, Send,
  Gauge, ShieldCheck, CalendarCheck, Timer, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import { useServiceMap } from "@/hooks/useServiceMap";
import { Panel, MetricRow } from "@/components/shared/Panel";
import { Legend } from "@/components/shared/Legend";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QbtecMap, WOERDEN_CENTER } from "@/components/map/QbtecMap";
import { PointLayer } from "@/components/map/PointLayer";
import { monteurStatusKleur } from "@/lib/data/monteurs";
import { SERVICEMELDINGEN, SERVICE_KPI, REMOTE_DIAGNOSTICS, prioriteitKleur } from "@/lib/data/servicemeldingen";
import { brandColor } from "@/lib/data/brands";
import { nlNumber, cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  "bij klant": "Bij klant",
  onderweg: "Onderweg",
  gereed: "Gereed — retour",
  spoed: "Spoed callout",
  overnacht: "Overnacht (meerdaags)",
  beschikbaar: "Beschikbaar",
  workshop: "Workshop",
  opleiding: "Opleiding",
};

export default function ServicePage() {
  const { monteurs } = useLiveData();
  const { points } = useServiceMap();
  const [selId, setSelId] = useState<string>("m-berg");
  const sel = monteurs.find((m) => m.id === selId) ?? monteurs[0];

  const onderweg = monteurs.filter((m) => !["beschikbaar", "workshop", "opleiding"].includes(m.status)).length;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Map */}
        <Panel
          title="Monteurs live — Nederland"
          icon={<MapPin className="h-4 w-4 text-primary" />}
          action={<span className="text-[11px] text-muted-foreground">{onderweg} onderweg · {monteurs.length - onderweg} op locatie Woerden</span>}
          bodyClassName="p-0"
        >
          <div className="relative">
            <QbtecMap center={WOERDEN_CENTER} zoom={7.1} height={460}>
              <PointLayer id="monteurs" points={points} onSelect={setSelId} selectedId={selId} radius={7} pulse labels={false} />
            </QbtecMap>
            <div className="absolute left-3 top-3 z-10">
              <Legend
                title="Status monteur"
                items={[
                  { color: "#f85149", label: "Spoed" },
                  { color: "#E8650A", label: "Bij klant" },
                  { color: "#388bfd", label: "Onderweg" },
                  { color: "#3fb950", label: "Gereed / beschikbaar" },
                  { color: "#a855f7", label: "Overnacht" },
                ]}
              />
            </div>
          </div>
        </Panel>

        {/* Selected technician */}
        <Panel title="Monteur detail" icon={<User className="h-4 w-4 text-primary" />}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-bold">{sel.naam}</div>
                <div className="text-xs text-muted-foreground">{sel.expertise}</div>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: `${monteurStatusKleur(sel.status)}22`, color: monteurStatusKleur(sel.status) }}
              >
                {STATUS_LABEL[sel.status] ?? sel.status}
              </span>
            </div>

            <div className="rounded-lg border border-border bg-card/40 p-2.5 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> Locatie</div>
              <div className="mt-0.5 font-medium">{sel.stad}</div>
              <div className="mt-1.5 flex items-center gap-1 text-muted-foreground"><Wrench className="h-3 w-3" /> Opdracht</div>
              <div className="mt-0.5">{sel.opdracht}</div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground"><Truck className="h-3.5 w-3.5" /> Werkbus inventaris</span>
                <span className={cn("font-semibold tabular", sel.werkbus < 50 ? "text-warning" : "text-success")}>{sel.werkbus}%</span>
              </div>
              <Progress value={sel.werkbus} indicatorColor={sel.werkbus < 50 ? "#d29922" : "#3fb950"} className="h-1.5" />
              {sel.werkbus < 50 && <div className="mt-1 text-[10px] text-warning">Aanvulling nodig</div>}
            </div>

            <MetricRow label={<span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Reistijd naar Woerden</span>} value={sel.reistijdTerug === 0 ? "op locatie" : `${sel.reistijdTerug} min`} />
            {sel.etaMin !== undefined && (
              <MetricRow label={<span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> ETA opdracht</span>} value={sel.etaMin === 0 ? "ter plaatse" : `${sel.etaMin} min`} accent="#E8650A" />
            )}
          </div>
        </Panel>
      </div>

      {/* Service KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiTile icon={Gauge} label="Gem. responstijd" value={SERVICE_KPI.responstijd} accent="#E8650A" />
        <KpiTile icon={CheckCircle2} label="First-time-fix" value={`${SERVICE_KPI.firstTimeFix}%`} accent="#3fb950" />
        <KpiTile icon={ShieldCheck} label="Servicecontracten" value={nlNumber(SERVICE_KPI.servicecontracten)} accent="#388bfd" />
        <KpiTile icon={CalendarCheck} label="Onderhoud deze maand" value={`${SERVICE_KPI.onderhoudGepland}`} accent="#a855f7" />
        <KpiTile icon={Activity} label="SLA compliance" value={`${SERVICE_KPI.slaCompliance}%`} accent="#3fb950" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Open service tickets */}
        <Panel title="Open servicemeldingen" icon={<Wrench className="h-4 w-4 text-primary" />} bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Klant</th>
                  <th className="px-3 py-2 text-left font-medium">Merk</th>
                  <th className="px-3 py-2 text-left font-medium">Probleem</th>
                  <th className="px-3 py-2 text-left font-medium">Prioriteit</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {SERVICEMELDINGEN.map((s) => (
                  <tr key={s.id} className="border-b border-border/40">
                    <td className="px-3 py-2 font-mono text-xs">{s.id}</td>
                    <td className="px-3 py-2"><span className="font-medium">{s.klant}</span><span className="block text-[11px] text-muted-foreground">{s.stad}</span></td>
                    <td className="px-3 py-2"><span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full" style={{ background: brandColor(s.brand) }} />{s.brand}</span></td>
                    <td className="px-3 py-2 text-xs">{s.probleem}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: `${prioriteitKleur(s.prioriteit)}22`, color: prioriteitKleur(s.prioriteit) }}>{s.prioriteit}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Remote diagnostics */}
        <Panel title="Remote diagnostics" icon={<Radio className="h-4 w-4 text-primary" />}>
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-2.5 py-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span><span className="font-semibold text-foreground">{REMOTE_DIAGNOSTICS.length} installaties</span> live verbonden</span>
          </div>
          <div className="space-y-2">
            {REMOTE_DIAGNOSTICS.map((r) => {
              const storing = r.status === "storing";
              return (
                <div key={r.id} className={cn("rounded-lg border px-2.5 py-2", storing ? "border-critical/30 bg-critical/5" : "border-border bg-card/40")}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{r.product} · {r.stad}</span>
                    {storing
                      ? <span className="flex items-center gap-1 text-critical"><AlertTriangle className="h-3 w-3" /> storing</span>
                      : <span className="flex items-center gap-1 text-success"><CheckCircle2 className="h-3 w-3" /> OK</span>}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{r.detail}</div>
                  {storing && (
                    <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                      <Send className="h-3.5 w-3.5" /> Remote advies sturen
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, accent }: { icon: typeof Gauge; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} /> {label}
      </div>
      <div className="mt-1 text-xl font-bold tabular" style={{ color: accent }}>{value}</div>
    </div>
  );
}
