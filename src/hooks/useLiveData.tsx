"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { FactoryReading, Alert, Machine, Monteur, Order } from "@/lib/types";
import { generateReading, initAlerts, maybeNewAlert } from "@/lib/simulation/sensorSimulator";
import { MACHINES, machineStatusKleur } from "@/lib/data/machines";
import { MONTEURS } from "@/lib/data/monteurs";
import { ACTIEVE_ORDERS } from "@/lib/data/orders";
import { clamp } from "@/lib/utils";

const HISTORY_LEN = 60;
const ALERT_LEN = 12;
const TICK_MS = 3000;

interface LiveDataValue {
  reading: FactoryReading | null;
  history: FactoryReading[];
  alerts: Alert[];
  machines: Machine[];
  monteurs: Monteur[];
  orders: Order[];
  ready: boolean;
}

const LiveDataContext = createContext<LiveDataValue | null>(null);

function stepMachines(machines: Machine[]): Machine[] {
  return machines.map((m) => {
    // small occupancy wander for active machines
    let bezetting = m.bezetting;
    if (m.status === "actief") {
      bezetting = clamp(Math.round(m.bezetting + (Math.random() - 0.5) * 4), 55, 100);
    } else if (m.status === "standby") {
      bezetting = clamp(Math.round(m.bezetting + (Math.random() - 0.5) * 6), 5, 45);
    }
    return { ...m, bezetting };
  });
}

function stepMonteurs(monteurs: Monteur[]): Monteur[] {
  return monteurs.map((m) => {
    if (!m.doel) {
      // idle workshop jitter
      return m;
    }
    const [lng, lat] = m.center;
    const [dLng, dLat] = m.doel;
    const ddx = dLng - lng;
    const ddy = dLat - lat;
    const dist = Math.hypot(ddx, ddy);
    if (dist < 0.004) return m; // arrived
    const step = 0.06; // fraction of remaining distance per tick
    const center: [number, number] = [
      +(lng + ddx * step).toFixed(4),
      +(lat + ddy * step).toFixed(4),
    ];
    const etaMin = m.etaMin !== undefined ? Math.max(0, Math.round(m.etaMin - 1)) : undefined;
    return { ...m, center, etaMin };
  });
}

function stepOrders(orders: Order[]): Order[] {
  return orders.map((o) => {
    if (o.fase === "Geleverd") return o;
    const voortgang = clamp(+(o.voortgang + Math.random() * 0.35).toFixed(1), 0, 99);
    return { ...o, voortgang };
  });
}

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const [reading, setReading] = useState<FactoryReading | null>(null);
  const [history, setHistory] = useState<FactoryReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [machines, setMachines] = useState<Machine[]>(MACHINES);
  const [monteurs, setMonteurs] = useState<Monteur[]>(MONTEURS);
  const [orders, setOrders] = useState<Order[]>(ACTIEVE_ORDERS);

  const prevRef = useRef<FactoryReading | null>(null);

  useEffect(() => {
    setAlerts(initAlerts(ALERT_LEN));
    let mounted = true;
    const tick = () => {
      const next = generateReading(prevRef.current, new Date());
      prevRef.current = next;
      if (!mounted) return;
      setReading(next);
      setHistory((h) => {
        const arr = [...h, next];
        return arr.length > HISTORY_LEN ? arr.slice(arr.length - HISTORY_LEN) : arr;
      });
      setMachines((m) => stepMachines(m));
      setMonteurs((m) => stepMonteurs(m));
      setOrders((o) => stepOrders(o));
      const fresh = maybeNewAlert();
      if (fresh) {
        setAlerts((a) => [fresh, ...a].slice(0, ALERT_LEN));
      }
    };
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const value: LiveDataValue = {
    reading,
    history,
    alerts,
    machines,
    monteurs,
    orders,
    ready: reading !== null,
  };

  return <LiveDataContext.Provider value={value}>{children}</LiveDataContext.Provider>;
}

export function useLiveData(): LiveDataValue {
  const ctx = useContext(LiveDataContext);
  if (!ctx) throw new Error("useLiveData must be used within LiveDataProvider");
  return ctx;
}

export { machineStatusKleur };
