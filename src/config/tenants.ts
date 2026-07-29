import type { TenantConfig } from './schema';

/**
 * Tenants sembrados en build. En producción esta lista se reemplaza por la
 * tabla `tenants` de Supabase (ver supabase/schema.sql); el shape es idéntico,
 * así que el resto de la app no cambia.
 */

const defaultCategories: TenantConfig['categories'] = [
  { id: 'bolsas', label: 'Bolsas', detailFields: ['marcas', 'colores'] },
  { id: 'tenis', label: 'Tenis', detailFields: ['marcas', 'tallas', 'colores'] },
  { id: 'ropa', label: 'Ropa', detailFields: ['marcas', 'tallas', 'colores'] },
  { id: 'perfumes', label: 'Perfumes', detailFields: ['marcas'] },
  { id: 'belleza', label: 'Belleza', detailFields: ['marcas'] },
  { id: 'accesorios', label: 'Accesorios', detailFields: ['marcas', 'colores'] },
  { id: 'hogar', label: 'Hogar', detailFields: ['marcas'] },
  { id: 'otros', label: 'Otros', detailFields: ['marcas', 'modelos'] },
];

const monochrome: TenantConfig['theme'] = {
  background: '0 0% 98%',
  foreground: '0 0% 12%',
  surface: '0 0% 96%',
  border: '0 0% 90%',
  accent: '0 0% 94%',
  primary: '0 0% 9%',
  primaryForeground: '0 0% 100%',
  textSecondary: '0 0% 40%',
  textTertiary: '0 0% 60%',
  radius: '1rem',
  fontFamily: 'Inter',
};

export const tenants: TenantConfig[] = [
  {
    slug: 'demo',
    domains: ['localhost', 'demo.localhost'],
    locale: 'es-MX',
    brand: {
      name: 'Sourcing Co.',
      shortName: 'Sourcing Co.',
      hostName: 'tu shopper',
      audienceGender: 'f',
      tagline: 'Compra en USA sin salir de México',
      sourcingCity: 'Houston',
      sourcingCountry: 'Estados Unidos',
      destinationCountry: 'México',
    },
    contact: {
      whatsapp: '+520000000000',
      whatsappMessage: 'Hola, quiero información sobre una ventana de compra.',
    },
    commerce: {
      localCurrency: 'MXN',
      sourceCurrency: 'USD',
      commissionRate: 0.2,
      minimumPurchase: 500,
      depositAmount: 500,
      shippingEstimateRate: 0.11,
      shippingDaysLabel: '~10 días',
      budgetPresets: [10000, 15000, 20000, 30000],
      exampleMerchandise: 1000,
    },
    exchange: { mode: 'manual', manualRate: 18.14, spread: 0 },
    bank: {
      beneficiary: 'Nombre de la titular',
      bankName: 'Banco',
      accountNumber: '000000000000000000',
      accountLabel: 'CLABE',
      conceptTemplate: '{nombre} CITA',
    },
    categories: defaultCategories,
    theme: monochrome,
    features: { lots: true, calculator: true, school: true, drops: true, orderDraft: true },
    content: {},
    school: {
      priceMonthly: 50,
      currency: 'USD',
      joinUrl: 'https://example.com/comunidad',
      joinNotice: 'Enlace temporal. Se conectará con la plataforma de comunidad.',
      liveSchedule: 'Cada sábado · 12:00 PM CT',
    },
    drops: {
      locale: 'en-US',
      currency: 'USD',
      shipsWithin: 'the United States',
    },
  },
];

export const fallbackTenant = tenants[0];
