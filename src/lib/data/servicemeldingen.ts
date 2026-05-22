import type { ServiceMelding } from "@/lib/types";

export const SERVICEMELDINGEN: ServiceMelding[] = [
  { id: "SM-4821", klant: "Cafetaria De Hoek", stad: "Rotterdam", brand: "Kiremko", probleem: "Thermostaat storing", prioriteit: "KRITIEK", status: "Monteur onderweg" },
  { id: "SM-4820", klant: "Hotel NH", stad: "Amsterdam", brand: "Qook!", probleem: "Brander uitval 1 van 4", prioriteit: "Hoog", status: "Gepland 15:00" },
  { id: "SM-4819", klant: "Snackbar Friet!", stad: "Utrecht", brand: "Perfecta", probleem: "Jaarlijks onderhoud", prioriteit: "Normaal", status: "Morgen 09:00" },
  { id: "SM-4818", klant: "Viszaak Scheveningen", stad: "Scheveningen", brand: "Smitto", probleem: "Oliepomp vertraagd", prioriteit: "Hoog", status: "Diagnose remote" },
  { id: "SM-4817", klant: "Stadion GelreDome", stad: "Arnhem", brand: "Florigo", probleem: "Nieuwe installatie", prioriteit: "Gepland", status: "Over 3 weken" },
];

export const SERVICE_KPI = {
  responstijd: "2,4 uur",
  firstTimeFix: 87,
  servicecontracten: 1247,
  onderhoudGepland: 34,
  slaCompliance: 94.2,
};

export interface RemoteInstallatie {
  id: string;
  product: string;
  stad: string;
  status: "OK" | "storing";
  detail: string;
}

export const REMOTE_DIAGNOSTICS: RemoteInstallatie[] = [
  { id: "rd-1", product: "Kiremko K600", stad: "Rotterdam", status: "storing", detail: "Temperatuurafwijking +8°C" },
  { id: "rd-2", product: "Qook! grootkeuken", stad: "Maastricht", status: "OK", detail: "Alle parameters nominaal" },
  { id: "rd-3", product: "Smitto industrieel", stad: "Urk", status: "OK", detail: "Oliepeil & temperatuur OK" },
];

export function prioriteitKleur(p: ServiceMelding["prioriteit"]): string {
  switch (p) {
    case "KRITIEK":
      return "#f85149";
    case "Hoog":
      return "#E8650A";
    case "Normaal":
      return "#388bfd";
    case "Gepland":
      return "#8b949e";
    default:
      return "#8b949e";
  }
}
