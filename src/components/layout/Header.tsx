"use client";

import { useEffect, useState } from "react";
import { useLiveData } from "@/hooks/useLiveData";
import { QbtecLogo } from "./QbtecLogo";
import { Cloud, CloudSun, Sun, Radio, MapPin } from "lucide-react";

const DAGEN = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

function useCetClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function fmtTime(d: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Amsterdam",
  }).format(d);
}

function WeatherWidget() {
  const { reading } = useLiveData();
  if (!reading) return null;
  const t = reading.buitenTemp;
  let Icon = Sun;
  let label = "Zonnig";
  if (t < 11) {
    Icon = Cloud;
    label = "Bewolkt";
  } else if (t < 17) {
    Icon = CloudSun;
    label = "Half bewolkt";
  }
  return (
    <div className="hidden items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-1.5 sm:flex">
      <Icon className="h-5 w-5 text-primary" />
      <div className="leading-tight">
        <div className="text-sm font-semibold tabular">{t.toFixed(0)}°C</div>
        <div className="text-[10px] text-muted-foreground">{label} · Woerden</div>
      </div>
    </div>
  );
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const now = useCetClock();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-ink/80 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3 lg:hidden">
        <QbtecLogo className="h-8" />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold tracking-tight sm:text-lg">{title}</h1>
        {subtitle && (
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <MapPin className="hidden h-3 w-3 shrink-0 sm:inline" />
            {subtitle}
          </p>
        )}
      </div>

      <WeatherWidget />

      <div className="hidden flex-col items-end leading-tight sm:flex">
        <div className="font-mono text-sm font-semibold tabular text-foreground">
          {now ? fmtTime(now) : "--:--:--"}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {now
            ? `${DAGEN[now.getDay()]} ${now.getDate()} ${MAANDEN[now.getMonth()]} ${now.getFullYear()} · CET`
            : "— · CET"}
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5">
        <Radio className="h-3.5 w-3.5 animate-pulse text-primary" />
        <span className="text-[11px] font-semibold tracking-wide text-primary">DEMO DATA</span>
      </div>
    </header>
  );
}
