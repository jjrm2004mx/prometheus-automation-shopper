import type { TenantConfig } from '../config/schema';

/**
 * Precio de un pedido. Un solo lugar calcula comisión, envío y totales:
 * si el negocio cambia la comisión, cambia aquí y en ningún otro sitio.
 */
export interface Quote {
  merchandise: number;
  commission: number;
  subtotal: number;
  shipping: number;
  total: number;
  totalLocal: number;
  rate: number;
}

export function quote(t: TenantConfig, merchandise: number, rate: number): Quote {
  const commission = merchandise * t.commerce.commissionRate;
  const subtotal = merchandise + commission;
  const shipping = merchandise * t.commerce.shippingEstimateRate;
  const total = subtotal + shipping;
  return {
    merchandise,
    commission,
    subtotal,
    shipping,
    total,
    totalLocal: total * rate,
    rate,
  };
}

/**
 * Costo aterrizado de una pieza.
 *
 * La pieza absorbe comisión y envío en proporción a su valor dentro del
 * pedido, no en partes iguales — repartir por igual subestima el costo de
 * las piezas caras y sobreestima el de las baratas.
 */
export interface PieceCost {
  share: number;
  commissionShare: number;
  shippingShare: number;
  landed: number;
  landedLocal: number;
}

export function pieceCost(
  t: TenantConfig,
  ticketPrice: number,
  merchandiseTotal: number,
  shippingTotal: number,
  rate: number,
): PieceCost | null {
  if (merchandiseTotal <= 0 || ticketPrice <= 0) return null;
  const share = ticketPrice / merchandiseTotal;
  const commissionShare = merchandiseTotal * t.commerce.commissionRate * share;
  const shippingShare = shippingTotal * share;
  const landed = ticketPrice + commissionShare + shippingShare;
  return { share, commissionShare, shippingShare, landed, landedLocal: landed * rate };
}

export interface Margin {
  profit: number;
  marginPct: number;
  multiplier: number;
}

export function margin(salePriceLocal: number, landedLocal: number): Margin | null {
  if (salePriceLocal <= 0 || landedLocal <= 0) return null;
  const profit = salePriceLocal - landedLocal;
  return {
    profit,
    marginPct: (profit / salePriceLocal) * 100,
    multiplier: salePriceLocal / landedLocal,
  };
}

export function formatMoney(value: number, currency: string, locale = 'es-MX', decimals = 2): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0);
}
