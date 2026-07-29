import { useCallback, useEffect, useState } from 'react';

export type PurchaseType = 'reventa' | 'personal';
export type Experience = 'vende' | 'primera';

export interface OrderDraft {
  purchaseType?: PurchaseType;
  experience?: Experience;
  years?: string;
  channels: string[];
  boughtUsaBefore?: 'si' | 'no';
  budgetLocal?: number;
  categories: string[];
  brands: string;
  sizes: string;
  colors: string;
  priorities: string;
  exclusions: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export const emptyDraft: OrderDraft = {
  channels: [],
  categories: [],
  brands: '',
  sizes: '',
  colors: '',
  priorities: '',
  exclusions: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
};

const KEY = 'order-draft-v1';

/**
 * El borrador vive en el dispositivo hasta que la clienta lo envía.
 * Abandonar el asistente y volver no debe costarle su trabajo.
 */
export function useOrderDraft() {
  const [draft, setDraft] = useState<OrderDraft>(emptyDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDraft({ ...emptyDraft, ...(JSON.parse(raw) as Partial<OrderDraft>) });
    } catch {
      /* borrador corrupto: se empieza limpio en vez de romper */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      /* sin almacenamiento: el asistente sigue funcionando en memoria */
    }
  }, [draft, loaded]);

  const patch = useCallback((p: Partial<OrderDraft>) => setDraft((d) => ({ ...d, ...p })), []);
  const reset = useCallback(() => {
    setDraft(emptyDraft);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  }, []);
  const toggle = useCallback(
    (field: 'channels' | 'categories', value: string) =>
      setDraft((d) => {
        const list = d[field];
        return {
          ...d,
          [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
        };
      }),
    [],
  );

  return { draft, patch, reset, toggle, loaded };
}

export type StepId =
  | 'intro'
  | 'purchase_type'
  | 'experience'
  | 'seller_context'
  | 'budget'
  | 'categories'
  | 'category_details'
  | 'priorities'
  | 'contact'
  | 'recap';

/** El camino depende del tipo de compra: uso personal salta el contexto de negocio. */
export function stepsFor(draft: OrderDraft): StepId[] {
  const base: StepId[] = ['intro', 'purchase_type'];
  if (draft.purchaseType === 'reventa') base.push('experience');
  if (draft.purchaseType === 'reventa' && draft.experience === 'vende') base.push('seller_context');
  return [...base, 'budget', 'categories', 'category_details', 'priorities', 'contact', 'recap'];
}
