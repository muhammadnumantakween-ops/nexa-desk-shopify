import {useState, useRef} from 'react';
import {Link} from 'react-router';

/**
 * UI-HOME-04: Parallax Hover Bento Grid Collections (Curated Categories)
 *
 * Requirements & Features:
 * 1. Curated workspace collections:
 *    - 1. Docks & Hubs (Hero / Primary Bento Card, span 2 cols on desktop)
 *    - 2. Wide Monitors & Screens (Secondary Bento Card, span 2 cols on desktop)
 *    - 3. Ergonomic Laptop Stands (Single cell)
 *    - 4. Wireless Mice & Desk Mats (Single cell)
 *    - 5. Mechanical Keyboards (Span 2 cols on desktop)
 * 2. 3D Parallax Tilt Effect on mouse movement with smooth spring reset.
 * 3. Human-readable, non-technical plain English explanations for every category.
 * 4. Micro-interactive compatibility chips (e.g., Apple  MacBook, Windows PC, 4K Display, USB-C).
 * 5. Responsive Breakpoints:
 *    - Desktop (1024px+): 4-column Bento grid with dynamic spans
 *    - Tablet (768px): 2-column balanced grid
 *    - Mobile (<640px): 1-column touch-friendly cards
 */

// Scalable Brand and Hardware SVGs
function RealAppleIcon({size = 14}) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-label="Apple logo" style={{display: 'inline-block'}}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

function WindowsIcon({size = 13}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="Windows logo" style={{display: 'inline-block'}}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ScreenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function EyeComfortIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PostureIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="3" />
      <path d="M12 8v8M9 12h6M9 20l3-4 3 4" />
    </svg>
  );
}

function QuietClickIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="6" width="18" height="12" rx="2" />
      <line x1="23" y1="11" x2="23" y2="13" />
    </svg>
  );
}

const BENTO_CATEGORIES = [
  {
    id: 'bento-docks',
    title: 'One-Cable Docks & Hubs',
    tagline: 'Clean & Tidy Desk',
    simpleDesc: 'Plug one cord into your laptop. Your battery charges, big screens turn on, and your keyboard and mouse connect instantly.',
    badge: 'Customer Favorite',
    badgeType: 'badge-gold',
    url: '/collections/docks-hubs',
    colSpan: 'span-2-lg',
    gradientClass: 'bento-gradient-blue',
    tags: [
      {label: 'Apple Mac & MacBook', icon: <RealAppleIcon size={14} />},
      {label: 'Windows Laptops', icon: <WindowsIcon size={13} />},
      {label: 'Fast Charging', icon: <BoltIcon />},
      {label: '2 Big Screens', icon: <ScreenIcon />},
    ],
    mockupType: 'dock',
  },
  {
    id: 'bento-monitors',
    title: 'Extra Wide Desk Screens',
    tagline: 'Comfortable on Your Eyes',
    simpleDesc: 'Big, clear screens with plenty of room for emails, video calls, and work. No small text or squinting required.',
    badge: 'Easy on Eyes',
    badgeType: 'badge-cyan',
    url: '/collections/monitors',
    colSpan: 'span-2-lg',
    gradientClass: 'bento-gradient-indigo',
    tags: [
      {label: 'Works with Mac', icon: <RealAppleIcon size={13} />},
      {label: 'Works with Windows', icon: <WindowsIcon size={12} />},
      {label: 'Zero Screen Glare', icon: <EyeComfortIcon />},
      {label: 'Super Sharp & Clear', icon: <ScreenIcon />},
    ],
    mockupType: 'monitor',
  },
  {
    id: 'bento-stands',
    title: 'Adjustable Laptop Stands',
    tagline: 'Healthy Posture',
    simpleDesc: 'Lifts your screen to eye level so you do not have to hunch over or strain your neck and back.',
    badge: 'Stops Neck Pain',
    badgeType: 'badge-emerald',
    url: '/collections/stands',
    colSpan: 'span-1-lg',
    gradientClass: 'bento-gradient-emerald',
    tags: [
      {label: 'Eye Level Height', icon: <PostureIcon />},
      {label: 'Strong Aluminum', icon: <BoltIcon />},
    ],
    mockupType: 'stand',
  },
  {
    id: 'bento-mice',
    title: 'Comfortable Wireless Mice',
    tagline: 'Easy on Your Hands',
    simpleDesc: 'Smooth, natural palm support designed so your wrist feels relaxed even after an entire day of working.',
    badge: 'No Wrist Ache',
    badgeType: 'badge-purple',
    url: '/collections/mice',
    colSpan: 'span-1-lg',
    gradientClass: 'bento-gradient-purple',
    tags: [
      {label: 'Whisper-Quiet Click', icon: <QuietClickIcon />},
      {label: 'Works Cord-Free', icon: <BatteryIcon />},
    ],
    mockupType: 'mouse',
  },
  {
    id: 'bento-keyboards',
    title: 'Quiet & Comfortable Keyboards',
    tagline: 'Effortless Daily Typing',
    simpleDesc: 'Gentle, soft keys that let you type fast without noisy click-clack sounds or tired fingers.',
    badge: 'Quiet & Smooth',
    badgeType: 'badge-amber',
    url: '/collections/keyboards',
    colSpan: 'span-2-lg',
    gradientClass: 'bento-gradient-amber',
    tags: [
      {label: 'Mac Keyboard Layout', icon: <RealAppleIcon size={13} />},
      {label: 'Windows Keys', icon: <WindowsIcon size={12} />},
      {label: 'Months of Battery', icon: <BatteryIcon />},
    ],
    mockupType: 'keyboard',
  },
];

/**
 * Single Bento Card with 3D Parallax Tilt
 */
function BentoCard({item}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({x: 0, y: 0, glowX: 50, glowY: 50});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalised tilt angles (-10deg to +10deg)
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = -((y / rect.height) - 0.5) * 14;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({x: rotateX, y: rotateY, glowX, glowY});
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({x: 0, y: 0, glowX: 50, glowY: 50});
  };

  return (
    <div
      ref={cardRef}
      className={`bento-card-wrapper ${item.colSpan}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.url}
        className={`bento-card ${item.gradientClass}`}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Dynamic Glow Overlay Following Mouse */}
        <div
          className="bento-glow-overlay"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`
              : 'transparent',
          }}
          aria-hidden="true"
        />

        {/* Card Header & Content */}
        <div className="bento-card-content">
          <div className="bento-badge-row">
            <span className={`bento-pill ${item.badgeType}`}>{item.badge}</span>
            <span className="bento-tagline">{item.tagline}</span>
          </div>

          <h3 className="bento-card-title">{item.title}</h3>
          <p className="bento-card-desc">{item.simpleDesc}</p>

          {/* Compatibility Chips */}
          <div className="bento-chips-row">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="bento-chip">
                {tag.icon && <span className="chip-brand-icon">{tag.icon}</span>}
                <span>{tag.label}</span>
              </span>
            ))}
          </div>

          {/* Action Link Footer */}
          <div className="bento-action-footer">
            <span className="bento-link-text">Browse {item.title}</span>
            <span className="bento-arrow-icon" aria-hidden="true">→</span>
          </div>
        </div>

        {/* Realistic Stylised Hardware Illustration in Background */}
        <div className="bento-illustration-container" aria-hidden="true">
          {item.mockupType === 'dock' && (
            <div className="bento-visual-dock">
              <div className="bento-dock-box">
                <div className="dock-light-glow" />
                <div className="dock-port-strip">
                  <span className="mini-port usb-c" />
                  <span className="mini-port usb-a" />
                  <span className="mini-port aux" />
                </div>
              </div>
              <div className="bento-cable-glow-line" />
            </div>
          )}

          {item.mockupType === 'monitor' && (
            <div className="bento-visual-monitor">
              <div className="mini-monitor-frame">
                <div className="mini-monitor-screen">
                  <div className="mini-bar top" />
                  <div className="mini-card-grid">
                    <span className="mini-card c1" />
                    <span className="mini-card c2" />
                  </div>
                </div>
                <div className="mini-monitor-stand" />
              </div>
            </div>
          )}

          {item.mockupType === 'stand' && (
            <div className="bento-visual-stand">
              <div className="mini-stand-frame">
                <div className="mini-stand-laptop-holder" />
                <div className="mini-stand-base" />
              </div>
            </div>
          )}

          {item.mockupType === 'mouse' && (
            <div className="bento-visual-mouse">
              <div className="mini-mouse-body">
                <div className="mini-mouse-wheel" />
              </div>
            </div>
          )}

          {item.mockupType === 'keyboard' && (
            <div className="bento-visual-keyboard">
              <div className="mini-keyboard-plate">
                <div className="mini-key-row">
                  <span /><span /><span /><span /><span /><span />
                </div>
                <div className="mini-key-row space">
                  <span className="spacebar" />
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export function BentoGridCollections() {
  return (
    <section className="bento-collections-section" aria-label="Curated Desk Setup Collections">
      <div className="bento-collections-container">
        {/* Section Header in Everyday English */}
        <div className="bento-header">
          <div className="bento-header-pill">
            <span className="bento-sparkle" aria-hidden="true" />
            <span>Everything For A Tidy Desk</span>
          </div>

          <h2 className="bento-title">
            Simple gear designed to work together without any setup trouble.
          </h2>

          <p className="bento-subtitle">
            No technical jargon or confusing ports. Every dock, screen, stand, and accessory here is guaranteed to plug straight into your Apple Mac, MacBook, or Windows PC.
          </p>
        </div>

        {/* Bento Cards Grid */}
        <div className="bento-grid">
          {BENTO_CATEGORIES.map((item) => (
            <BentoCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
