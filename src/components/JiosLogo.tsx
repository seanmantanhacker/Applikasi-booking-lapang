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
  sm: { mark: 28, text: 16 },
  md: { mark: 38, text: 22 },
  lg: { mark: 52, text: 30 },
};

export default function JiosLogo({
  variant = 'dark',
  size = 'md',
  className = '',
}: JiosLogoProps) {
  const s = sizes[size];
  const markColor = variant === 'light' ? '#F5F0E7' : '#10203A';
  const textColor = variant === 'light' ? '#F5F0E7' : '#10203A';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Padel ball mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer oval (padel ball shape) */}
        <ellipse cx="50" cy="42" rx="38" ry="34" fill={markColor} />
        {/* Inner swoosh — the string/seam of a padel ball */}
        <path
          d="M20 60 Q50 20 80 60"
          stroke={variant === 'light' ? '#10203A' : '#F5F0E7'}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.35"
        />
        {/* Bottom crescent (coffee cup bottom silhouette) */}
        <path
          d="M18 68 Q50 95 82 68"
          fill={markColor}
        />
      </svg>

      {variant !== 'mark-only' && (
        <span
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: s.text,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: textColor,
            lineHeight: 1,
          }}
        >
          JIOS
        </span>
      )}
    </div>
  );
}
