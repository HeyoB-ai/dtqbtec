"use client";

import {
  DoorOpen, Car, Phone, Users, PhoneCall, PhoneMissed, Clock, Truck, UserCheck,
} from "lucide-react";
import { useLiveData } from "@/hooks/useLiveData";
import { Panel } from "@/components/shared/Panel";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VERGADERZALEN, PARKEREN, TELEFOON, PERSONEEL } from "@/lib/data/facilities";
import { cn } from "@/lib/utils";

export default function FaciliteitenPage() {
  const { reading } = useLiveData();
  const parkeerBezet = reading ? reading.parkeerBezet : PARKEREN.bezet;
  const parkeerPct = Math.round((parkeerBezet / PARKEREN.totaal) * 100);
  const servicelijnActief = reading ? reading.servicelijnActief : TELEFOON.servicelijnActief;
  const servicelijnWacht = reading ? reading.servicelijnWacht : TELEFOON.servicelijnWacht;
  const verkoopActief = reading ? reading.verkoopActief : TELEFOON.verkoopActief;
  const aanwezig = reading ? reading.aanwezigPersoneel : PERSONEEL.aanwezig;

  return (
    <div className="grid gap-4 animate-fade-in lg:grid-cols-2">
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

        {/* parking spots viz */}
        <div className="mt-4 grid grid-cols-9 gap-1.5">
          {Array.from({ length: PARKEREN.totaal }).map((_, i) => {
            const isVan = i < PARKEREN.werkbussenAanwezig;
            const isVisitor = i >= PARKEREN.totaal - PARKEREN.bezoekers && i < PARKEREN.totaal - PARKEREN.bezoekers + PARKEREN.bezoekers;
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
      <Panel title="Telefoonlijnen & bereikbaarheid" icon={<Phone className="h-4 w-4 text-primary" />}>
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
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-card/40 p-2.5">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> Gem. wachttijd</div>
              <div className="mt-0.5 text-lg font-bold tabular">{TELEFOON.gemiddeldeWachttijd}</div>
            </div>
            <div className="rounded-lg border border-border bg-card/40 p-2.5">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><PhoneMissed className="h-3 w-3" /> Gemiste oproepen</div>
              <div className="mt-0.5 text-lg font-bold tabular">{TELEFOON.gemisteOproepen}</div>
            </div>
          </div>
        </div>
      </Panel>

      {/* Personnel */}
      <Panel title="Personeelsbezetting vandaag" icon={<Users className="h-4 w-4 text-primary" />}>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold tabular">{aanwezig}<span className="text-base font-normal text-muted-foreground">/{PERSONEEL.totaal}</span></span>
          <span className="flex items-center gap-1 text-sm text-success"><UserCheck className="h-4 w-4" /> aanwezig</span>
        </div>
        <Progress value={(aanwezig / PERSONEEL.totaal) * 100} indicatorColor="#3fb950" className="mt-2 h-2" />

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Stat label="Productie" value={PERSONEEL.productie} icon={Users} accent="#E8650A" />
          <Stat label="Service buitendienst" value={PERSONEEL.serviceBuitendienst} icon={Truck} accent="#388bfd" />
          <Stat label="Kantoor / support" value={PERSONEEL.kantoor} icon={Users} accent="#a855f7" />
          <Stat label="Afwezig (ziek/verlof)" value={PERSONEEL.afwezig} icon={Users} accent="#8b949e" />
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value, icon: Icon, accent }: { label: string; value: number; icon: typeof Users; accent: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-2.5">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} /> {label}
      </div>
      <div className="mt-0.5 text-xl font-bold tabular" style={{ color: accent }}>{value}</div>
    </div>
  );
}
