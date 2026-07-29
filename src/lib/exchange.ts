import { useEffect, useState } from 'react';
import type { TenantConfig } from '../config/schema';

/**
 * Origen único del tipo de cambio.
 *
 * Toda superficie que convierta moneda pasa por aquí. Es la regla que el
 * sitio de referencia rompía: la home mostraba la tasa viva y otras dos
 * páginas una tasa fija, con 10 % de diferencia justo antes de pagar.
 */

const CACHE_KEY = 'fx-rate-v1';
const TTL_MS = 6 * 60 * 60 * 1000;

interface Cached {
  rate: number;
  at: number;
}

function readCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.at > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function fetchRate(t: TenantConfig): Promise<number> {
  const manual = t.exchange.manualRate;
  if (t.exchange.mode === 'manual') return manual;

  const cached: Cached | null = readCache();
  if (cached && Date.now() - cached.at < TTL_MS) return cached.rate;

  try {
    const url = `https://api.exchangerate.host/latest?base=${t.commerce.sourceCurrency}&symbols=${t.commerce.localCurrency}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { rates?: Record<string, number> };
    const raw = data.rates?.[t.commerce.localCurrency];
    if (!raw || !Number.isFinite(raw)) throw new Error('rate missing');
    const rate = raw * (1 + t.exchange.spread);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, at: Date.now() } satisfies Cached));
    return rate;
  } catch {
    // La fuente falló: se conserva el último valor conocido en vez de romper.
    return cached?.rate ?? manual;
  }
}

export function useExchangeRate(t: TenantConfig) {
  const [rate, setRate] = useState<number>(t.exchange.manualRate);
  const [loading, setLoading] = useState(t.exchange.mode === 'live');

  useEffect(() => {
    let alive = true;
    if (t.exchange.mode === 'manual') {
      setRate(t.exchange.manualRate);
      setLoading(false);
      return;
    }
    fetchRate(t).then((r) => {
      if (!alive) return;
      setRate(r);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [t]);

  return { rate, loading };
}
