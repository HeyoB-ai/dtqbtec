"use client";

import { useMemo } from "react";
import {
  Factory, PackageCheck, Boxes, Truck, Wrench, Gauge, Clock, BadgeCheck,
  ArrowRight, Layers, Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useLiveData } from "@/hooks/useLiveData";
import { KPICard } from "@/components/dashboard/KPICard";
import { Panel } from "@/components/shared/Panel";
import { BarsChart } from "@/components/charts/Charts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ACTIEVE_ORDERS } from "@/lib/data/orders";
import { BRAND_INFO, brandColor } from "@/lib/data/brands";
import { FASES, type Brand, type FactoryReading } from "@/lib/types";
import { euro, nlNumber } from "@/lib/utils";

const BRAND_NOOT: Partial<Record<Brand, string>> = {
  Kiremko: "bakwanden, frituurinstallaties",
  Perfecta: "frituurwanden maatwerk",
  Smitto: "visbakoven specialisatie",
  "Qook!": "grootkeuken maatwerk",
  Florigo: "nieuw — 2025",
  "De Kuiper": "nieuw — 2025",
};

export default function DashboardPage() {
  const { reading, history } = useLiveData();

  const hist = (key: keyof FactoryReading) => history.map((r) => Number(r[key]));

  const brandPipeline = useMemo(() => {
    const map = new Map<Brand, number>();
    for (const o of ACTIEVE_ORDERS) map.set(o.brand, (map.get(o.brand) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const faseData = useMemo(() => {
    return FASES.filter((f) => f !== "Geleverd").map((fase) => ({
      fase: fase.length > 8 ? fase.slice(0, 7) + "." : fase,
      orders: ACTIEVE_ORDERS.filter((o) => o.fase === fase).length,
    }));
  }, []);

  const orderwaarde = ACTIEVE_ORDERS.reduce((s, o) => s + o.waarde, 0);

  if (!reading) return null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPICard label="Orders in productie" value={reading.ordersInProductie} sub="actief op de vloer" icon={Factory} accent="#E8650A" history={hist("ordersInProductie")} />
        <KPICard label="Gereed vandaag" value={reading.gereedVandaag} unit="install." sub="opgeleverd" icon={PackageCheck} accent="#3fb950" history={hist("gereedVandaag")} />
        <KPICard label="Grondstof dekking" value={reading.grondstofDekking} unit="%" sub="days of supply" icon={Boxes} accent="#388bfd" status={reading.grondstofDekking < 92 ? "verhoogd" : "normaal"} history={hist("grondstofDekking")} />
        <KPICard label="Monteurs onderweg" value={reading.monteursOnderweg} unit={`van ${reading.monteursTotaal}`} sub="buitendienst" icon={Truck} accent="#a855f7" history={hist("monteursOnderweg")} />
        <KPICard label="Open servicemelding" value={reading.openMeldingen} sub={`kritiek: ${reading.kritiekeMeldingen}`} icon={Wrench} accent="#f85149" status={reading.kritiekeMeldingen >= 1 ? "verhoogd" : "normaal"} history={hist("openMeldingen")} />
        <KPICard label="Bezetting fabriek" value={reading.bezetting} unit="%" sub="capaciteitsbenutting" icon={Gauge} accent="#E8650A" status={reading.bezetting > 90 ? "verhoogd" : "normaal"} history={hist("bezetting")} />
        <KPICard label="Levertijd gemiddeld" value={reading.levertijd} unit="wd" sub="werkdagen" icon={Clock} accent="#d29922" history={hist("levertijd")} />
        <KPICard label="Kwaliteitskeuring" value={reading.kwaliteitGeslaagd} unit="%" digits={1} sub="geslaagd" icon={BadgeCheck} accent="#3fb950" history={hist("kwaliteitGeslaagd")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Brand production overview */}
        <Panel
          title="Productie per merk"
          icon={<Layers className="h-4 w-4 text-primary" />}
          action={<span className="text-[11px] text-muted-foreground">{ACTIEVE_ORDERS.length} orders · {euro(orderwaarde)}</span>}
          bodyClassName="p-3"
        >
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {brandPipeline.map(([brand, count]) => {
              const info = BRAND_INFO[brand];
              const color = brandColor(brand);
              return (
                <div key={brand} className="rounded-lg border border-border bg-card/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      {brand}
                    </span>
                    {info.nieuw && <Badge variant="warning" className="px-1.5 py-0 text-[9px]">nieuw</Badge>}
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold tabular" style={{ color }}>{count}</span>
                    <span className="text-[11px] text-muted-foreground">order{count === 1 ? "" : "s"}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                    {BRAND_NOOT[brand] ?? info.specialisme}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Orders per phase */}
        <Panel title="Orders per fase" icon={<Factory className="h-4 w-4 text-primary" />} bodyClassName="p-3">
          <BarsChart
            data={faseData}
            bars={[{ key: "orders", label: "Orders", color: "#E8650A" }]}
            xKey="fase"
            height={200}
          />
        </Panel>
      </div>

      {/* Active orders snapshot */}
      <Panel
        title="Actieve orders — snapshot"
        icon={<Sparkles className="h-4 w-4 text-primary" />}
        action={
          <Link href="/productie" className="flex items-center gap-1 text-[11px] text-primary hover:underline">
            Volledige tracking <ArrowRight className="h-3 w-3" />
          </Link>
        }
        bodyClassName="p-0"
      >
        <div className="divide-y divide-border/60">
          {ACTIEVE_ORDERS.slice(0, 6).map((o) => {
            const color = brandColor(o.brand);
            return (
              <div key={o.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-16 shrink-0 font-mono text-xs font-semibold" style={{ color }}>{o.id}</span>
                <span className="hidden w-24 shrink-0 text-muted-foreground sm:inline">{o.brand}</span>
                <span className="min-w-0 flex-1 truncate">{o.product} · <span className="text-muted-foreground">{o.klant}, {o.stad}</span></span>
                <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground md:inline">{o.fase}</span>
                <div className="hidden w-28 shrink-0 sm:block">
                  <Progress value={o.voortgang} indicatorColor={color} className="h-1.5" />
                </div>
                <span className="w-20 shrink-0 text-right text-xs tabular text-muted-foreground">{euro(o.waarde)}</span>
              </div>
            );
          })}
        </div>
      </Panel>

      <p className="text-center text-[11px] text-muted-foreground/70">
        Totale geïnstalleerde base: {nlNumber(7560)} installaties in Europa · 1.247 servicecontracten · 8 merken onder één dak in Woerden
      </p>
    </div>
  );
}
