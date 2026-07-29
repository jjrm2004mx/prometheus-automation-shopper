/**
 * Esquema de configuración de un tenant (una personal shopper).
 *
 * Regla del producto: TODO lo que cambia entre shoppers vive aquí.
 * Si un componente necesita un número, un texto de marca o una cuenta
 * bancaria, lo lee de la configuración — nunca lo escribe literal.
 */

export type Currency = 'MXN' | 'USD';

export interface BrandConfig {
  /** Nombre completo, p. ej. "Eduardo Sourcing Co." */
  name: string;
  /** Nombre corto para el header */
  shortName: string;
  /** Nombre de pila de quien atiende, usado en la copy */
  hostName: string;
  /** Género gramatical con el que se dirige a su audiencia */
  audienceGender: 'f' | 'm' | 'n';
  tagline: string;
  /** Ciudad y país desde donde se compra */
  sourcingCity: string;
  sourcingCountry: string;
  /** País de destino de los envíos */
  destinationCountry: string;
}

export interface ContactConfig {
  whatsapp: string;
  whatsappMessage: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
}

export interface CommerceConfig {
  /** Moneda en la que la clienta piensa y paga */
  localCurrency: Currency;
  /** Moneda en la que se compra la mercancía */
  sourceCurrency: Currency;
  /** Comisión sobre mercancía, como fracción (0.20 = 20 %) */
  commissionRate: number;
  /** Compra mínima de mercancía, en sourceCurrency */
  minimumPurchase: number;
  /** Apartado para reservar cita, en localCurrency */
  depositAmount: number;
  /** Envío estimado como fracción de la mercancía (0.11 ≈ $110 por $1,000) */
  shippingEstimateRate: number;
  /** Texto del tiempo típico de envío */
  shippingDaysLabel: string;
  /** Atajos de presupuesto ofrecidos en el asistente, en localCurrency */
  budgetPresets: number[];
  /** Monto del ejemplo de inversión mostrado en la home, en sourceCurrency */
  exampleMerchandise: number;
}

export interface ExchangeConfig {
  /** `live` consulta la tasa del día; `manual` usa manualRate */
  mode: 'live' | 'manual';
  manualRate: number;
  /** Margen aplicado sobre la tasa de mercado (0.02 = 2 %) */
  spread: number;
}

export interface BankConfig {
  beneficiary: string;
  bankName: string;
  /** Número de cuenta / CLABE / IBAN según el país */
  accountNumber: string;
  accountLabel: string;
  /** Plantilla del concepto; {nombre} se sustituye */
  conceptTemplate: string;
}

export interface CategoryConfig {
  id: string;
  label: string;
  /** Campos de detalle que se piden si se elige esta categoría */
  detailFields: Array<'marcas' | 'tallas' | 'colores' | 'modelos'>;
}

export interface ThemeConfig {
  /** Tokens HSL sin el prefijo hsl(), p. ej. "0 0% 98%" */
  background: string;
  foreground: string;
  surface: string;
  border: string;
  accent: string;
  primary: string;
  primaryForeground: string;
  textSecondary: string;
  textTertiary: string;
  radius: string;
  fontFamily: string;
}

export interface FeatureFlags {
  lots: boolean;
  calculator: boolean;
  school: boolean;
  drops: boolean;
  orderDraft: boolean;
}

/** Membresía de formación. Solo aplica si `features.school` está activa. */
export interface SchoolConfig {
  priceMonthly: number;
  currency: Currency;
  /** Destino del botón de alta (plataforma de comunidad, pasarela, etc.) */
  joinUrl: string;
  /** Aviso mostrado junto al botón mientras la integración no sea definitiva */
  joinNotice?: string;
  liveSchedule: string;
}

/** Paquetes listos para enviar. Solo aplica si `features.drops` está activa. */
export interface DropsConfig {
  locale: string;
  currency: Currency;
  shipsWithin: string;
}

/** Cada entrada sobrescribe un texto del contenido base. */
export type ContentOverrides = Record<string, string>;

export interface TenantConfig {
  slug: string;
  domains: string[];
  locale: string;
  brand: BrandConfig;
  contact: ContactConfig;
  commerce: CommerceConfig;
  exchange: ExchangeConfig;
  bank: BankConfig;
  categories: CategoryConfig[];
  theme: ThemeConfig;
  features: FeatureFlags;
  content: ContentOverrides;
  school?: SchoolConfig;
  drops?: DropsConfig;
}
