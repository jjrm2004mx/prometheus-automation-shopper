import type { TenantConfig } from '../config/schema';

/** Aplica los tokens del tenant al documento. Un solo punto de escritura. */
export function applyTheme(t: TenantConfig) {
  if (typeof document === 'undefined') return;
  const s = document.documentElement.style;
  const th = t.theme;
  s.setProperty('--background', th.background);
  s.setProperty('--foreground', th.foreground);
  s.setProperty('--surface', th.surface);
  s.setProperty('--border', th.border);
  s.setProperty('--accent', th.accent);
  s.setProperty('--primary', th.primary);
  s.setProperty('--primary-foreground', th.primaryForeground);
  s.setProperty('--text-secondary', th.textSecondary);
  s.setProperty('--text-tertiary', th.textTertiary);
  s.setProperty('--radius', th.radius);
  document.documentElement.lang = t.locale.split('-')[0];
}

/** Metadatos por ruta. Cada página declara los suyos. */
export function setMeta(opts: { title: string; description: string; path: string; origin?: string }) {
  if (typeof document === 'undefined') return;
  document.title = opts.title;

  const set = (selector: string, attr: string, value: string) => {
    let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (!el) {
      el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
      const m = selector.match(/\[(.+?)="(.+?)"\]/);
      if (m) el.setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  };

  const origin = opts.origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  set('meta[name="description"]', 'content', opts.description);
  set('link[rel="canonical"]', 'href', `${origin}${opts.path}`);
  set('meta[property="og:title"]', 'content', opts.title);
  set('meta[property="og:description"]', 'content', opts.description);
  set('meta[property="og:url"]', 'content', `${origin}${opts.path}`);
  set('meta[property="og:type"]', 'content', 'website');
  set('meta[name="twitter:card"]', 'content', 'summary_large_image');
  set('meta[name="twitter:title"]', 'content', opts.title);
  set('meta[name="twitter:description"]', 'content', opts.description);
}
