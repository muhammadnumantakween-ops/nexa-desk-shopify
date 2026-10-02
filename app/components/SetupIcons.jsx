import React from 'react';

/**
 * Modern high-contrast clean SVG icons for Workstation Devices
 */

export function AppleBrandIcon({size = 20, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" className={className} aria-hidden="true">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

export function WindowsBrandIcon({size = 20, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

export function LightningPowerIcon({size = 20, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
  );
}

export function UsbPortIcon({size = 20, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2v10M12 12l4-4M12 12L8 8" />
      <rect x="7" y="14" width="10" height="8" rx="1" />
    </svg>
  );
}

export function MonitorDisplayIcon({size = 22, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export function DockHubIcon({size = 22, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="10" cy="12" r="1.5" fill="currentColor" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CheckCircleIcon({size = 18, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function AlertTriangleIcon({size = 20, className = ''}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
