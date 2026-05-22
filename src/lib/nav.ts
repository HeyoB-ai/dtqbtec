import {
  LayoutDashboard,
  Factory,
  Boxes,
  Wrench,
  Globe2,
  Building2,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  sub: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Operations Dashboard", sub: "Live fabriek", icon: LayoutDashboard },
  { href: "/productie", label: "Productieoverzicht", sub: "Vloer · orders", icon: Factory },
  { href: "/voorraad", label: "Voorraad & Inkoop", sub: "Grondstoffen", icon: Boxes },
  { href: "/service", label: "Servicedienst Live", sub: "24/7 monteurs", icon: Wrench },
  { href: "/installaties", label: "Geïnstalleerde Base", sub: "Klanten Europa", icon: Globe2 },
  { href: "/faciliteiten", label: "Faciliteiten", sub: "Kantoor Woerden", icon: Building2 },
  { href: "/scenarios", label: "Scenario Simulator", sub: "AI impact-analyse", icon: FlaskConical },
];

export const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "QBtec Operations Intelligence",
    subtitle: "Live fabriek · Woerden · Middellandse Zee 9",
  },
  "/productie": {
    title: "Productieoverzicht",
    subtitle: "Fabrieksvloer, machinestatus en order-tracking — realtime",
  },
  "/voorraad": {
    title: "Voorraad & Inkoop",
    subtitle: "Grondstoffen, inkomende leveringen en gereed product",
  },
  "/service": {
    title: "Servicedienst Live",
    subtitle: "24/7 buitendienst · monteurs · servicemeldingen · remote diagnostics",
  },
  "/installaties": {
    title: "Geïnstalleerde Base & Klanten",
    subtitle: "QBtec installaties in Europa — lifecycle & servicecontracten",
  },
  "/faciliteiten": {
    title: "Faciliteiten & Bezetting",
    subtitle: "Kantoor Woerden — ruimtes, parkeren, bereikbaarheid, personeel",
  },
  "/scenarios": {
    title: "AI Scenario Simulator",
    subtitle: "Impact-analyse op productie, levertijden, voorraad en service",
  },
};
