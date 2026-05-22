"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Map as MlMap } from "maplibre-gl";
import { cn } from "@/lib/utils";

interface MapCtx {
  map: MlMap | null;
}
const MapContext = createContext<MapCtx>({ map: null });
export const useMap = () => useContext(MapContext).map;

// Free dark OSM-based vector basemap (OpenFreeMap "dark") — no API key needed.
export const DEFAULT_MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";
export const MAP_FONT = ["Noto Sans Regular"];

export const WOERDEN_CENTER: [number, number] = [4.8836, 52.0853];

interface QbtecMapProps {
  center?: [number, number];
  zoom?: number;
  /** Explicit pixel height for the GL container (avoids 0-height % pitfalls). */
  height?: number;
  className?: string;
  interactive?: boolean;
  styleUrl?: string;
  children?: ReactNode;
}

export function QbtecMap({
  center = WOERDEN_CENTER,
  zoom = 7,
  height = 460,
  className,
  interactive = true,
  styleUrl = DEFAULT_MAP_STYLE,
  children,
}: QbtecMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MlMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    let mapInstance: MlMap | null = null;
    let ro: ResizeObserver | null = null;

    (async () => {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !containerRef.current) return;
      mapInstance = new maplibregl.Map({
        container: containerRef.current,
        style: styleUrl,
        center,
        zoom,
        interactive,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });
      mapInstance.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right",
      );
      if (interactive) {
        mapInstance.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "top-right",
        );
      }

      ro = new ResizeObserver(() => mapInstance?.resize());
      ro.observe(containerRef.current);

      mapInstance.on("load", () => {
        if (cancelled || !mapInstance) return;
        mapInstance.resize();
        setMap(mapInstance);
        requestAnimationFrame(() => mapInstance?.resize());
      });
    })();

    return () => {
      cancelled = true;
      ro?.disconnect();
      mapInstance?.remove();
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-border", className)}
      style={{ height, minHeight: height }}
    >
      <div ref={containerRef} style={{ width: "100%", height }} />
      {!map && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ink/60">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Kaart laden…
          </div>
        </div>
      )}
      <MapContext.Provider value={{ map }}>{map && children}</MapContext.Provider>
    </div>
  );
}
