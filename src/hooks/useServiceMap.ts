"use client";

import { useMemo } from "react";
import { useLiveData } from "./useLiveData";
import { monteurStatusKleur } from "@/lib/data/monteurs";
import type { MapPoint } from "@/components/map/PointLayer";

/**
 * Derives live MapPoints for the service-technician map from the live monteur
 * positions, so the dots move as the simulation advances.
 */
export function useServiceMap(): { points: MapPoint[] } {
  const { monteurs } = useLiveData();
  const points = useMemo<MapPoint[]>(
    () =>
      monteurs.map((m) => ({
        id: m.id,
        naam: m.naam,
        center: m.center,
        kleur: monteurStatusKleur(m.status),
      })),
    [monteurs],
  );
  return { points };
}
