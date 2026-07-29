import type { ReactNode } from 'react';

/**
 * Ilustraciones de marcador de posición.
 *
 * Son SVG y no fotos por una razón de producto: cada shopper sube su propia
 * media desde la consola, y hasta que lo hace el sitio debe verse intencional,
 * no roto ni con fotos de stock ajenas. Heredan los tokens de tema, así que un
 * tenant con otra paleta las obtiene en su color sin tocar código.
 */

type ArtProps = { className?: string; label?: string };

function Frame({ children, label, className = '' }: ArtProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={`w-full h-full ${className}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill="hsl(var(--accent))" />
      {children}
    </svg>
  );
}

const stroke = 'hsl(var(--foreground))';
const soft = 'hsl(var(--text-tertiary))';

export function ArtBag({ label = 'Bolsa de mano', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <rect x="140" y="120" width="120" height="110" rx="10" fill="none" stroke={stroke} strokeWidth="3" />
      <path d="M170 120v-18a30 30 0 0 1 60 0v18" fill="none" stroke={stroke} strokeWidth="3" />
      <line x1="140" y1="152" x2="260" y2="152" stroke={soft} strokeWidth="2" />
      <circle cx="200" cy="188" r="7" fill="none" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtShoe({ label = 'Calzado deportivo', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <path
        d="M120 190h100l40-28 34 10c14 4 22 12 22 22v10H120z"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M150 190v-18M175 190v-24M200 186v-22" stroke={soft} strokeWidth="2" />
      <line x1="120" y1="204" x2="316" y2="204" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtGarment({ label = 'Prenda de ropa', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <path
        d="M160 104l40-14 40 14 32 22-18 26-14-9v87h-80v-87l-14 9-18-26z"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M182 92a18 18 0 0 0 36 0" fill="none" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtBottle({ label = 'Perfume', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <rect x="168" y="122" width="64" height="106" rx="8" fill="none" stroke={stroke} strokeWidth="3" />
      <rect x="186" y="96" width="28" height="26" fill="none" stroke={stroke} strokeWidth="3" />
      <rect x="180" y="80" width="40" height="16" rx="4" fill="none" stroke={soft} strokeWidth="2" />
      <line x1="168" y1="176" x2="232" y2="176" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtBox({ label = 'Caja de envío', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <path d="M112 128l88-38 88 38v92l-88 38-88-38z" fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <path d="M112 128l88 38 88-38M200 166v92" fill="none" stroke={soft} strokeWidth="2" />
      <rect x="176" y="112" width="48" height="16" fill="none" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtCall({ label = 'Videollamada de compra', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <rect x="118" y="94" width="128" height="112" rx="10" fill="none" stroke={stroke} strokeWidth="3" />
      <circle cx="182" cy="134" r="16" fill="none" stroke={soft} strokeWidth="2" />
      <path d="M154 178a30 30 0 0 1 56 0" fill="none" stroke={soft} strokeWidth="2" />
      <path d="M254 128l38-20v90l-38-20z" fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <line x1="118" y1="224" x2="246" y2="224" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtTicket({ label = 'Ticket de compra', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <path d="M148 82h104v148l-16-10-18 10-18-10-18 10-18-10-16 10z" fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <path d="M168 112h64M168 134h64M168 156h44" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtTruck({ label = 'Envío a domicilio', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <rect x="96" y="120" width="112" height="76" fill="none" stroke={stroke} strokeWidth="3" />
      <path d="M208 148h48l32 34v14h-80z" fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="140" cy="206" r="14" fill="hsl(var(--accent))" stroke={stroke} strokeWidth="3" />
      <circle cx="256" cy="206" r="14" fill="hsl(var(--accent))" stroke={stroke} strokeWidth="3" />
    </Frame>
  );
}

export function ArtStore({ label = 'Tienda en Estados Unidos', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <path d="M104 128l16-38h160l16 38z" fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      <rect x="112" y="128" width="176" height="100" fill="none" stroke={stroke} strokeWidth="3" />
      <rect x="140" y="160" width="46" height="68" fill="none" stroke={soft} strokeWidth="2" />
      <rect x="214" y="160" width="46" height="40" fill="none" stroke={soft} strokeWidth="2" />
    </Frame>
  );
}

export function ArtChart({ label = 'Números de la compra', ...p }: ArtProps) {
  return (
    <Frame label={label} {...p}>
      <line x1="112" y1="228" x2="292" y2="228" stroke={stroke} strokeWidth="3" />
      <line x1="112" y1="228" x2="112" y2="84" stroke={stroke} strokeWidth="3" />
      <rect x="136" y="176" width="30" height="52" fill="none" stroke={soft} strokeWidth="2" />
      <rect x="182" y="142" width="30" height="86" fill="none" stroke={soft} strokeWidth="2" />
      <rect x="228" y="108" width="30" height="120" fill="none" stroke={stroke} strokeWidth="3" />
    </Frame>
  );
}

const gallery = [ArtBag, ArtShoe, ArtGarment, ArtBottle, ArtBox, ArtCall, ArtTicket, ArtTruck, ArtStore, ArtChart];

/** Selecciona una ilustración de forma estable a partir de un índice. */
export function ArtByIndex({ index, ...p }: ArtProps & { index: number }) {
  const Component = gallery[Math.abs(index) % gallery.length];
  return <Component {...p} />;
}

/** Marco con proporción fija para cualquier media. */
export function Figure({
  children,
  ratio = 'aspect-[4/3]',
  caption,
  className = '',
}: {
  children: ReactNode;
  ratio?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className={`${ratio} overflow-hidden rounded-2xl border border-border bg-accent`}>
        {children}
      </div>
      {caption && <figcaption className="mt-2 text-xs text-text-tertiary">{caption}</figcaption>}
    </figure>
  );
}

/** Avatar tipográfico determinista, para testimonios sin foto. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
