export function NexaLogo({size = 32, className = ''}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`nexa-logo-svg ${className}`}
      aria-label="NexaDesk Logo"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0B1329" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer rounded hexagon shield / dock frame */}
      <rect
        width="100"
        height="100"
        rx="22"
        fill="url(#logoBg)"
        stroke="rgba(212, 175, 55, 0.4)"
        strokeWidth="2"
      />

      {/* Precision N geometry */}
      {/* Left Pillar */}
      <path d="M26 74V26L40 26V74H26Z" fill="url(#logoGold)" />

      {/* Power Diagonal with Glow */}
      <path
        d="M40 26L60 74H74L54 26H40Z"
        fill="url(#logoGold)"
        filter="url(#logoGlow)"
      />

      {/* Right Pillar */}
      <path d="M60 26H74V74H60V26Z" fill="url(#logoGold)" />

      {/* Technical Data Hub Node */}
      <circle cx="50" cy="50" r="5.5" fill="#38BDF8" />
      <circle
        cx="50"
        cy="50"
        r="8.5"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
    </svg>
  );
}
