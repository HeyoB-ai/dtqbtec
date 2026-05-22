"use client";

import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { useLiveData } from "@/hooks/useLiveData";

const SEGMENTS = [
  { key: "medewerkers", label: "Medewerkers", color: "#388bfd" },
  { key: "externen", label: "Externen", color: "#d29922" },
  { key: "bezoekers", label: "Bezoekers", color: "#a855f7" },
] as const;

export function AanwezigheidCard() {
  const { aanwezigheid: a } = useLiveData();
  const counts = {
    medewerkers: a.medewerkers.totaal,
    externen: a.externen.totaal,
    bezoekers: a.bezoekers.totaal,
  };
  const total = a.totaalOpLocatie || 1;

  return (
    <Card className="relative overflow-hidden p-4">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-info opacity-10 blur-2xl" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-info/20 text-info">
            <Users className="h-[18px] w-[18px]" />
          </span>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Aanwezigheid</div>
            <div className="text-[11px] text-muted-foreground/80">
              {counts.medewerkers} medewerkers · {counts.externen} externen · {counts.bezoekers} bezoekers
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <AnimatedNumber value={a.totaalOpLocatie} className="text-2xl font-bold tracking-tight tabular" />
          <span className="text-sm text-muted-foreground">personen op locatie</span>
        </div>
      </div>

      {/* stacked ratio bar */}
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        {SEGMENTS.map((s) => (
          <div
            key={s.key}
            className="h-full transition-all duration-700"
            style={{ width: `${(counts[s.key] / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {SEGMENTS.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label} <span className="tabular font-medium text-foreground">{counts[s.key]}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}
