'use client';

import { useState, useEffect } from 'react';
import { Currency } from './types';

interface Rates {
  USD: number; // USD per 1 MNT
  CNY: number; // CNY per 1 MNT
  KRW: number; // KRW per 1 MNT
  updatedAt: string;
}

const CACHE_KEY = 'fx_rates_mnt';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export function useExchangeRates() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { rates: r, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL_MS) {
            setRates(r);
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        const res = await fetch('https://open.er-api.com/v6/latest/MNT');
        const json = await res.json();
        const r: Rates = {
          USD: json.rates.USD,
          CNY: json.rates.CNY,
          KRW: json.rates.KRW,
          updatedAt: json.time_last_update_utc,
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rates: r, ts: Date.now() }));
        setRates(r);
      } catch {
        // silently fail — no conversion shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Convert any amount to MNT
  function toMNT(amount: number, currency: Currency): number {
    if (!rates) return 0;
    if (currency === 'MNT') return amount;
    return Math.round(amount / rates[currency as keyof Omit<Rates, 'updatedAt'>]);
  }

  return { rates, loading, toMNT };
}
