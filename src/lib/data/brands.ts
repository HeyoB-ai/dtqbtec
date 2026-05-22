import type { Brand } from "@/lib/types";

export interface BrandInfo {
  naam: Brand;
  kleur: string;
  specialisme: string;
  nieuw?: boolean;
}

/** The 8 QBtec brands with a distinct accent colour and specialism. */
export const BRAND_INFO: Record<Brand, BrandInfo> = {
  Kiremko: { naam: "Kiremko", kleur: "#E8650A", specialisme: "Bakwanden & frituurinstallaties" },
  Perfecta: { naam: "Perfecta", kleur: "#388bfd", specialisme: "Frituurwanden maatwerk" },
  Smitto: { naam: "Smitto", kleur: "#14b8a6", specialisme: "Visbakovens" },
  "Qook!": { naam: "Qook!", kleur: "#a855f7", specialisme: "Grootkeuken maatwerk" },
  Florigo: { naam: "Florigo", kleur: "#eab308", specialisme: "Elektrische frituur", nieuw: true },
  "De Kuiper": { naam: "De Kuiper", kleur: "#ec4899", specialisme: "Bakapparatuur", nieuw: true },
  Adieu: { naam: "Adieu", kleur: "#94a3b8", specialisme: "Gietijzeren grillplaten" },
  HiFri: { naam: "HiFri", kleur: "#3fb950", specialisme: "Air-frying ovens" },
};

export function brandColor(b: Brand): string {
  return BRAND_INFO[b].kleur;
}
