import React from 'react';

/**
 * Animated SVG Illustrations for HTTP Status Codes & System States:
 * - 200 / Success: Animated glowing checkmark with pulse rings
 * - 300 / Redirection: Animated looping orbital navigation arrows
 * - 400 / Bad Request: Animated caution triangle with pulsing exclamation
 * - 404 / Not Found: Floating radar dish / search beam
 * - 500 / Server Error: Animated severed wire & sparking circuit
 * - Generic / Offline: Animated cloud with disconnected pulse
 */

export function SuccessIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(16, 185, 129, 0.2))'}}
    >
      <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="4" strokeDasharray="6 6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="360 80 80"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="80" cy="80" r="54" fill="#ecfdf5" stroke="#34d399" strokeWidth="2">
        <animate
          attributeName="r"
          values="52;56;52"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <path
        d="M56 82L72 98L106 64"
        stroke="#059669"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0 100; 100 0"
          dur="1.2s"
          fill="freeze"
        />
      </path>
    </svg>
  );
}

export function RedirectIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(59, 130, 246, 0.2))'}}
    >
      <circle cx="80" cy="80" r="58" stroke="#93c5fd" strokeWidth="3" strokeDasharray="8 8" />
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="360 80 80"
          dur="6s"
          repeatCount="indefinite"
        />
        <circle cx="80" cy="22" r="9" fill="#2563eb" />
        <circle cx="80" cy="138" r="9" fill="#3b82f6" />
      </g>
      <path
        d="M65 80H95M95 80L82 67M95 80L82 93"
        stroke="#1d4ed8"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          values="-5 0; 5 0; -5 0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function BadRequestIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(245, 158, 11, 0.2))'}}
    >
      <polygon
        points="80,24 142,130 18,130"
        fill="#fef3c7"
        stroke="#f59e0b"
        strokeWidth="5"
        strokeLinejoin="round"
      >
        <animate
          attributeName="transform"
          type="scale"
          values="1;1.02;1"
          keyTimes="0;0.5;1"
          dur="2s"
          repeatCount="indefinite"
          transform-origin="80 80"
        />
      </polygon>
      <line
        x1="80"
        y1="64"
        x2="80"
        y2="98"
        stroke="#b45309"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="80" cy="114" r="4.5" fill="#b45309">
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

export function NotFoundIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(99, 102, 241, 0.2))'}}
    >
      <circle cx="70" cy="70" r="45" stroke="#6366f1" strokeWidth="5" fill="#eef2ff">
        <animate
          attributeName="r"
          values="43;47;43"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      <line
        x1="104"
        y1="104"
        x2="136"
        y2="136"
        stroke="#4f46e5"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Radar scanning beam */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 70 70"
          to="360 70 70"
          dur="4s"
          repeatCount="indefinite"
        />
        <line x1="70" y1="70" x2="105" y2="45" stroke="#818cf8" strokeWidth="3" opacity="0.8" />
        <circle cx="105" cy="45" r="4" fill="#4338ca" />
      </g>
      <circle cx="70" cy="70" r="4" fill="#4338ca" />
    </svg>
  );
}

export function ServerErrorIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(239, 68, 68, 0.25))'}}
    >
      <rect x="25" y="45" width="110" height="70" rx="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="4" />
      <line x1="25" y1="80" x2="135" y2="80" stroke="#fca5a5" strokeWidth="2" />
      <circle cx="45" cy="62" r="5" fill="#dc2626">
        <animate
          attributeName="opacity"
          values="1;0.2;1"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="65" cy="62" r="5" fill="#f87171" />
      {/* Spark effect */}
      <path
        d="M80 72L75 92H85L78 112"
        stroke="#dc2626"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="opacity"
          values="0.2;1;0.4;1;0.2"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export function GenericErrorIllustration() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{filter: 'drop-shadow(0 10px 15px rgba(107, 114, 128, 0.2))'}}
    >
      <circle cx="80" cy="80" r="60" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="4" />
      <path
        d="M58 80H102M80 58V102"
        stroke="#6b7280"
        strokeWidth="5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 80 80"
          to="45 80 80"
          dur="0.5s"
          fill="freeze"
        />
      </path>
    </svg>
  );
}

/**
 * Returns corresponding animated illustration based on HTTP code / error category
 */
export function getStatusIllustration(status) {
  const code = Number(status) || 500;

  if (code >= 200 && code < 300) {
    return <SuccessIllustration />;
  }
  if (code >= 300 && code < 400) {
    return <RedirectIllustration />;
  }
  if (code === 404) {
    return <NotFoundIllustration />;
  }
  if (code >= 400 && code < 500) {
    return <BadRequestIllustration />;
  }
  if (code >= 500) {
    return <ServerErrorIllustration />;
  }
  return <GenericErrorIllustration />;
}
