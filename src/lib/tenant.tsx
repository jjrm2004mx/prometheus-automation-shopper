import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { TenantConfig } from '../config/schema';
import { tenants, fallbackTenant } from '../config/tenants';

const TenantContext = createContext<TenantConfig>(fallbackTenant);

/**
 * Resuelve el tenant a partir del hostname.
 *
 * Orden: dominio exacto → subdominio `<slug>.` → `?tenant=` (solo para
 * previsualización) → fallback. Nunca lanza: un dominio desconocido debe
 * servir algo, no romper.
 */
export function resolveTenant(hostname: string, search = ''): TenantConfig {
  const host = hostname.toLowerCase().replace(/^www\./, '');

  const byDomain = tenants.find((t) => t.domains.some((d) => d.toLowerCase() === host));
  if (byDomain) return byDomain;

  const sub = host.split('.')[0];
  const bySlug = tenants.find((t) => t.slug === sub);
  if (bySlug) return bySlug;

  const preview = new URLSearchParams(search).get('tenant');
  if (preview) {
    const byPreview = tenants.find((t) => t.slug === preview);
    if (byPreview) return byPreview;
  }

  return fallbackTenant;
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenant = useMemo(() => {
    if (typeof window === 'undefined') return fallbackTenant;
    return resolveTenant(window.location.hostname, window.location.search);
  }, []);

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantConfig {
  return useContext(TenantContext);
}
