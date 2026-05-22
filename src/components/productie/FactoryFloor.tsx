"use client";

import { ZONES, MACHINE_MARKERS, machineStatusKleur } from "@/lib/data/machines";
import type { Machine, ZoneId } from "@/lib/types";
import { cn } from "@/lib/utils";

/** SVG schematic of the QBtec production floor (viewBox 1000 × 560). */
export function FactoryFloor({
  machines,
  selectedZone,
  onSelectZone,
}: {
  machines: Machine[];
  selectedZone: ZoneId | null;
  onSelectZone: (z: ZoneId) => void;
}) {
  const byId = new Map(machines.map((m) => [m.id, m]));

  return (
    <svg viewBox="0 0 1000 560" className="w-full" style={{ aspectRatio: "1000 / 560" }}>
      {/* floor backdrop */}
      <rect x="0" y="0" width="1000" height="560" fill="#0d1117" />
      <defs>
        <pattern id="floorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="#161b22" strokeWidth="1" />
        </pattern>
        <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#3a4250" />
        </marker>
      </defs>
      <rect x="0" y="0" width="1000" height="560" fill="url(#floorGrid)" />

      {/* flow arrows: A → B → (down) C → (right) E ; B → D */}
      <g stroke="#3a4250" strokeWidth="2" fill="none" markerEnd="url(#flowArrow)">
        <line x1="330" y1="150" x2="342" y2="150" />
        <line x1="654" y1="150" x2="666" y2="150" />
        <line x1="180" y1="260" x2="180" y2="280" />
        <line x1="654" y1="402" x2="666" y2="402" />
      </g>

      {ZONES.map((z) => {
        const sel = selectedZone === z.id;
        const zoneMachines = z.machineIds.map((id) => byId.get(id)).filter(Boolean) as Machine[];
        const heeftStoring = zoneMachines.some((m) => m.status === "storing");
        return (
          <g key={z.id} onClick={() => onSelectZone(z.id)} className="cursor-pointer">
            <rect
              x={z.x}
              y={z.y}
              width={z.w}
              height={z.h}
              rx={10}
              fill={`${z.kleur}${sel ? "26" : "12"}`}
              stroke={sel ? z.kleur : `${z.kleur}88`}
              strokeWidth={sel ? 3 : 1.5}
            />
            <text x={z.x + 14} y={z.y + 24} fill={z.kleur} fontSize="15" fontWeight="700">
              {z.naam}
            </text>
            <text x={z.x + 14} y={z.y + 42} fill="#8b949e" fontSize="11">
              {z.omschrijving}
            </text>
            {heeftStoring && (
              <text x={z.x + z.w - 14} y={z.y + 24} fill="#f85149" fontSize="11" fontWeight="700" textAnchor="end">
                ● storing
              </text>
            )}

            {zoneMachines.map((m) => {
              const [mx, my] = MACHINE_MARKERS[m.id] ?? [z.x + 40, z.y + 80];
              const kleur = machineStatusKleur(m.status);
              return (
                <g key={m.id}>
                  {m.status === "storing" && (
                    <circle cx={mx} cy={my} r={16} fill={kleur} opacity={0.25}>
                      <animate attributeName="r" values="10;20;10" dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.35;0;0.35" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={mx} cy={my} r={9} fill={kleur} stroke="#0d1117" strokeWidth={2}>
                    <title>{`${m.naam} — ${m.status} (${m.bezetting}%)`}</title>
                  </circle>
                  <text x={mx} y={my + 24} fill="#cbd5e1" fontSize="10" textAnchor="middle">
                    {m.naam.replace("Assemblagelijn", "Lijn").replace("Lasstation", "Las")}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function ZoneLegend() {
  const items: { kleur: string; label: string }[] = [
    { kleur: machineStatusKleur("actief"), label: "Actief" },
    { kleur: machineStatusKleur("standby"), label: "Standby" },
    { kleur: machineStatusKleur("vrij"), label: "Vrij" },
    { kleur: machineStatusKleur("storing"), label: "Storing" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className={cn("flex items-center gap-1.5 text-[11px] text-muted-foreground")}>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: it.kleur }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
