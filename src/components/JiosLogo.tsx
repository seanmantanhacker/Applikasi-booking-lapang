// ============================================================
// JIOS Logo — SVG Component
// The padel ball + swoosh mark with JIOS wordmark
// ============================================================

interface JiosLogoProps {
  variant?: 'dark' | 'light' | 'mark-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { imgHeight: 28, text: 16 },
  md: { imgHeight: 38, text: 22 },
  lg: { imgHeight: 56, text: 30 },
};

export default function JiosLogo({
  variant = 'dark',
  size = 'md',
  className = '',
}: JiosLogoProps) {
  const s = sizes[size];
  const baseUrl = import.meta.env.BASE_URL || '/';
  const logoSrc = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}logo.png`;

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={isLight ? 'p-1 rounded-xl bg-cream-100/90 shadow-sm inline-flex items-center justify-center' : 'inline-flex items-center justify-center'}>
        <img
          src={logoSrc}
          alt="JIOS Padel & Coffee"
          style={{ height: `${s.imgHeight}px`, width: 'auto' }}
          className="object-contain"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>
      {variant !== 'mark-only' && (
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: s.text,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: variant === 'light' ? '#F5F0E7' : '#10203A',
            lineHeight: 1,
          }}
        >
          JIOS
        </span>
      )}
    </div>
  );
}
