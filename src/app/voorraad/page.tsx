"use client";

import { useState } from "react";
import { Boxes, Truck, PackageCheck, Building2, Clock, Euro, Repeat } from "lucide-react";
import { Panel } from "@/components/shared/Panel";
import { Badge } from "@/components/ui/badge";
import { MATERIALEN, LEVERINGEN, GEREED_PRODUCT, voorraadStatus } from "@/lib/data/voorraad";
import { brandColor } from "@/lib/data/brands";
import type { Materiaal, VoorraadStatus } from "@/lib/types";
import { nlNumber, cn } from "@/lib/utils";

const STATUS_KLEUR: Record<VoorraadStatus, string> = {
  OK: "#3fb950",
  Laag: "#d29922",
  Kritiek: "#f85149",
};

const STATUS_VARIANT: Record<VoorraadStatus, "success" | "warning" | "danger"> = {
  OK: "success",
  Laag: "warning",
  Kritiek: "danger",
};

export default function VoorraadPage() {
  const [selId, setSelId] = useState<string>(MATERIALEN[3].id); // start on a critical one
  const sel = MATERIALEN.find((m) => m.id === selId)!;

  const kritiek = MATERIALEN.filter((m) => voorraadStatus(m.voorraad, m.min) === "Kritiek").length;
  const laag = MATERIALEN.filter((m) => voorraadStatus(m.voorraad, m.min) === "Laag").length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* summary chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-lg border border-border bg-card/50 px-3 py-1.5">{MATERIALEN.length} materialen & componenten</span>
        <span className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-success">{MATERIALEN.length - kritiek - laag} op niveau</span>
        <span className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-1.5 text-warning">{laag} laag</span>
        <span className="rounded-lg border border-critical/30 bg-critical/10 px-3 py-1.5 text-critical">{kritiek} kritiek</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Materials table */}
        <Panel title="Grondstoffen & componenten voorraad" icon={<Boxes className="h-4 w-4 text-primary" />} bodyClassName="p-0">
          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-card text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-medium">Materiaal</th>
                  <th className="px-2 py-2 text-right font-medium">Voorraad</th>
                  <th className="px-2 py-2 text-right font-medium">Min</th>
                  <th className="px-4 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALEN.map((m) => {
                  const st = voorraadStatus(m.voorraad, m.min);
                  const active = m.id === selId;
                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelId(m.id)}
                      className={cn(
                        "cursor-pointer border-b border-border/40 transition-colors hover:bg-secondary/40",
                        active && "bg-secondary/60",
                      )}
                    >
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_KLEUR[st] }} />
                          <span className="font-medium">{m.naam}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-right tabular">{nlNumber(m.voorraad)} {m.eenheid}</td>
                      <td className="px-2 py-2 text-right tabular text-muted-foreground">{nlNumber(m.min)}</td>
                      <td className="px-4 py-2 text-right">
                        <Badge variant={STATUS_VARIANT[st]} className="px-2 py-0 text-[10px]">{st}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Detail + deliveries + finished stock */}
        <div className="space-y-4">
          <Panel title="Materiaaldetail" icon={<Building2 className="h-4 w-4 text-primary" />}>
            <MateriaalDetail m={sel} />
          </Panel>

          <Panel title="Inkomende leveringen — deze week" icon={<Truck className="h-4 w-4 text-primary" />}>
            <div className="space-y-2">
              {LEVERINGEN.map((l, i) => (
                <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-card/40 px-2.5 py-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-bold text-primary">{l.dag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium">{l.materiaal} — {l.hoeveelheid}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{l.leverancier}{l.tijd ? ` · ${l.tijd}` : ""}</div>
                  </div>
                  <Badge variant="info" className="px-1.5 py-0 text-[9px]">{l.status}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Finished products */}
      <Panel title="Gereed product voorraad" icon={<PackageCheck className="h-4 w-4 text-primary" />} bodyClassName="p-3">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {GEREED_PRODUCT.map((g) => {
            const color = brandColor(g.brand);
            return (
              <div key={g.id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-2xl font-bold tabular" style={{ color }}>{g.aantal}×</span>
                </div>
                <div className="mt-1 text-sm font-medium leading-tight">{g.omschrijving}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{g.notitie}</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function MateriaalDetail({ m }: { m: Materiaal }) {
  const st = voorraadStatus(m.voorraad, m.min);
  return (
    <div className="space-y-3">
      <div>
        <div className="text-base font-bold">{m.naam}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant={STATUS_VARIANT[st]} className="px-2 py-0 text-[10px]">{st}</Badge>
          {nlNumber(m.voorraad)} {m.eenheid} op voorraad (min. {nlNumber(m.min)})
        </div>
      </div>
      <div className="space-y-1.5 text-sm">
        <Row icon={<Building2 className="h-3.5 w-3.5" />} label="Leverancier" value={m.leverancier} />
        <Row icon={<Repeat className="h-3.5 w-3.5" />} label="Alt. leverancier" value={m.altLeverancier} />
        <Row icon={<Clock className="h-3.5 w-3.5" />} label="Volgende ETA" value={m.eta} />
        <Row icon={<Euro className="h-3.5 w-3.5" />} label="Prijs" value={m.prijs} />
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 py-1.5 last:border-0">
      <span className="flex items-center gap-1.5 text-muted-foreground">{icon} {label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
