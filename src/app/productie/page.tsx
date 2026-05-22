"use client";

import { useState, useMemo } from "react";
import { Factory, Gauge, Wrench, Target, ListChecks, ArrowRight } from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import { Panel } from "@/components/shared/Panel";
import { Progress } from "@/components/ui/progress";
import { FactoryFloor, ZoneLegend } from "@/components/productie/FactoryFloor";
import { ZONES, MACHINE_STATUS_LABEL, machineStatusKleur } from "@/lib/data/machines";
import { brandColor } from "@/lib/data/brands";
import { FASES, type ZoneId, type Order } from "@/lib/types";
import { cn } from "@/lib/utils";

const ZONE_ONDERHOUD: Record<ZoneId, string> = {
  A: "Preventief onderhoud Safan Darley — gepland za 24 mei",
  B: "Lasstation 4 in storing — monteur onderweg (ETA 30 min)",
  C: "Geen geplande downtime",
  D: "Filtervervanging schilderstraatje — gepland wo 28 mei",
  E: "Geen geplande downtime",
};

export default function ProductiePage() {
  const { machines, orders } = useLiveData();
  const [zone, setZone] = useState<ZoneId>("A");

  const zoneDef = ZONES.find((z) => z.id === zone)!;
  const zoneMachines = useMemo(
    () => machines.filter((m) => m.zone === zone),
    [machines, zone],
  );
  const zoneBezetting = Math.round(
    zoneMachines.reduce((s, m) => s + m.bezetting, 0) / Math.max(1, zoneMachines.length),
  );
  const outputVandaag = zoneMachines.reduce((s, m) => s + m.outputVandaag, 0);
  const outputTarget = zoneMachines.reduce((s, m) => s + m.target, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Floor schematic */}
        <Panel
          title="Fabrieksvloer — Middellandse Zee 9"
          icon={<Factory className="h-4 w-4 text-primary" />}
          action={<ZoneLegend />}
          bodyClassName="p-3"
        >
          <FactoryFloor machines={machines} selectedZone={zone} onSelectZone={setZone} />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Klik op een zone voor details · ~6.000 m² productie + 2.000 m² uitbreiding (2023)
          </p>
        </Panel>

        {/* Zone detail */}
        <div className="space-y-4">
          <Panel
            title={zoneDef.naam}
            icon={<span className="h-3 w-3 rounded-full" style={{ background: zoneDef.kleur }} />}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border bg-card/50 p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Gauge className="h-3 w-3" /> Bezetting</div>
                  <div className="mt-1 text-xl font-bold tabular" style={{ color: zoneDef.kleur }}>{zoneBezetting}%</div>
                  <Progress value={zoneBezetting} indicatorColor={zoneDef.kleur} className="mt-1.5 h-1.5" />
                </div>
                <div className="rounded-lg border border-border bg-card/50 p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Target className="h-3 w-3" /> Output vandaag</div>
                  <div className="mt-1 text-xl font-bold tabular">
                    {outputVandaag}<span className="text-sm font-normal text-muted-foreground">/{outputTarget}</span>
                  </div>
                  <Progress value={(outputVandaag / Math.max(1, outputTarget)) * 100} indicatorColor="#3fb950" className="mt-1.5 h-1.5" />
                </div>
              </div>

              <div className="rounded-lg border border-warning/20 bg-warning/5 p-2.5 text-[11px]">
                <div className="flex items-center gap-1 font-medium text-warning"><Wrench className="h-3 w-3" /> Onderhoud / downtime</div>
                <div className="mt-0.5 text-muted-foreground">{ZONE_ONDERHOUD[zone]}</div>
              </div>

              <div>
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Machines & werkorders</div>
                <div className="space-y-1.5">
                  {zoneMachines.map((m) => {
                    const kleur = machineStatusKleur(m.status);
                    return (
                      <div key={m.id} className="rounded-md border border-border bg-card/40 px-2.5 py-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{m.naam}</span>
                          <span className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${kleur}22`, color: kleur }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: kleur }} />
                            {MACHINE_STATUS_LABEL[m.status]}
                          </span>
                        </div>
                        <div className="mt-0.5 text-muted-foreground">{m.actieveJob}</div>
                        {m.volgendeJob !== "—" && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground/70">
                            <ArrowRight className="h-2.5 w-2.5" /> {m.volgendeJob}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Order tracking timeline */}
      <Panel title="Order-tracking — actieve werkorders" icon={<ListChecks className="h-4 w-4 text-primary" />} bodyClassName="p-0">
        <div className="divide-y divide-border/60">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const color = brandColor(order.brand);
  const faseIdx = FASES.indexOf(order.fase);
  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="w-16 shrink-0 font-mono text-xs font-semibold" style={{ color }}>{order.id}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {order.product} <span className="font-normal text-muted-foreground">· {order.klant}, {order.stad}</span>
        </span>
        {order.spoed && <span className="rounded-full bg-critical/15 px-1.5 py-0.5 text-[10px] font-semibold text-critical">spoed</span>}
        <span className="text-xs font-semibold tabular" style={{ color }}>{order.fase} · {order.voortgang.toFixed(0)}%</span>
      </div>
      {/* phase stepper */}
      <div className="mt-2 flex items-center gap-1">
        {FASES.map((f, i) => {
          const done = i < faseIdx;
          const current = i === faseIdx;
          return (
            <div key={f} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn("h-1.5 w-full rounded-full transition-colors")}
                style={{ background: done ? color : current ? color : "#21262d", opacity: done ? 0.5 : 1 }}
              />
              <span className={cn("hidden text-[9px] sm:block", current ? "font-semibold" : "text-muted-foreground/60")} style={current ? { color } : undefined}>
                {f}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
