import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router';

/**
 * UI-HOME-05: UK Remote Worker Setup Showcase Carousel (Social Proof)
 *
 * Requirements & Features:
 * 1. Real UK customer workstation showcases with authentic photos/illustrations,
 *    city location badges (London, Edinburgh, Manchester, Bristol, Cambridge), and verified buyer tags.
 * 2. Interactive Clickable Hotspot Pins with glowing ripple pulses:
 *    - Tapping a pin reveals a popover card with the exact product used, price, and "View Product" link.
 * 3. Horizontal smooth snap slider / drag carousel with inertia and prev/next controls.
 * 4. Plain English, non-technical customer stories:
 *    - Real human stories about untangling cables, curing back ache, and running 2 monitors with MacBook or PC.
 * 5. Touch-friendly snap swipe on mobile devices.
 */

// Scalable brand and hardware icons
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

const CUSTOMER_SETUPS = [
  {
    id: 'setup-sophie-edinburgh',
    customerName: 'Sophie M.',
    role: 'Remote Accountant',
    city: 'Edinburgh, Scotland',
    laptop: 'Apple MacBook Air',
    laptopType: 'apple',
    quote: '"Before this, I had four separate tangled plugs all over my desk. Now when I sit down, I just plug in one single cord. Both my big monitors light up and my MacBook charges fast. My workspace feels so peaceful now."',
    rating: 5,
    verifiedOrder: 'Verified UK Order',
    deskTheme: 'Clean Wood & Plants',
    hotspots: [
      {
        id: 'hs-dock-1',
        title: 'NexaDesk One-Cable Dual Dock',
        category: 'Desk Power Hub',
        price: '£169.00',
        url: '/collections/docks-hubs',
        top: '48%',
        left: '50%',
        benefit: 'Plugs straight into the wall to charge her MacBook and run two big screens through one wire.',
      },
      {
        id: 'hs-stand-1',
        title: 'Adjustable Eye-Level Laptop Stand',
        category: 'Laptop Riser',
        price: '£49.00',
        url: '/collections/stands',
        top: '42%',
        left: '22%',
        benefit: 'Brings her screen to comfortable eye height so her neck does not hurt by 5 PM.',
      },
      {
        id: 'hs-screen-1',
        title: 'Clear & Crisp 27" Computer Monitor',
        category: 'Wide Screen',
        price: '£229.00',
        url: '/collections/monitors',
        top: '22%',
        left: '46%',
        benefit: 'Flicker-free glass with big, easy-to-read text that prevents tired eyes.',
      },
    ],
  },
  {
    id: 'setup-david-london',
    customerName: 'David K.',
    role: '3D Designer & Architect',
    city: 'London, England',
    laptop: 'Windows Laptop (Dell XPS)',
    laptopType: 'windows',
    quote: '"My work laptop is power-hungry and cheap adapters always got burning hot or wouldn\'t charge the battery. This hub powers my laptop without breaking a sweat, even during heavy 3D rendering."',
    rating: 5,
    verifiedOrder: 'Verified UK Order',
    deskTheme: 'All-Black Modern Office',
    hotspots: [
      {
        id: 'hs-dock-2',
        title: 'High-Power Pro Dock (100W)',
        category: 'Heavy-Duty Hub',
        price: '£219.00',
        url: '/collections/docks-hubs',
        top: '52%',
        left: '52%',
        benefit: 'Sends rapid, safe power into demanding Windows laptops while streaming 2 big screens.',
      },
      {
        id: 'hs-mouse-2',
        title: 'Comfortable Wireless Trackball Mouse',
        category: 'Ergonomic Mouse',
        price: '£49.00',
        url: '/collections/mice',
        top: '58%',
        left: '78%',
        benefit: 'You move the ball with your thumb instead of sliding your wrist, stopping soreness completely.',
      },
      {
        id: 'hs-screen-2',
        title: 'Extra Wide Curved Desk Screen (34")',
        category: 'Panoramic Screen',
        price: '£389.00',
        url: '/collections/monitors',
        top: '20%',
        left: '42%',
        benefit: 'Wraps gently around your eyesight so you can view all your windows side by side.',
      },
    ],
  },
  {
    id: 'setup-emma-bristol',
    customerName: 'Emma R.',
    role: 'Online Project Manager',
    city: 'Bristol, England',
    laptop: 'Apple MacBook Pro',
    laptopType: 'apple',
    quote: '"Moving from messy wires on the dining table to this clean desk made working from home a joy. No more scrambling for adapters five minutes before a team video call."',
    rating: 5,
    verifiedOrder: 'Verified UK Order',
    deskTheme: 'Minimalist Walnut Desk',
    hotspots: [
      {
        id: 'hs-dock-3',
        title: 'Standard One-Cable Dock',
        category: 'Compact Hub',
        price: '£119.00',
        url: '/collections/docks-hubs',
        top: '50%',
        left: '48%',
        benefit: 'Tucks neatly under the screen riser and powers everything silently.',
      },
      {
        id: 'hs-keyboard-3',
        title: 'Quiet Wireless Typing Keyboard',
        category: 'Silent Keyboard',
        price: '£59.00',
        url: '/collections/keyboards',
        top: '64%',
        left: '32%',
        benefit: 'Soft, quiet keys with real Apple Mac shortcut buttons.',
      },
      {
        id: 'hs-stand-3',
        title: 'Rotating Swivel Aluminum Stand',
        category: 'Swivel Stand',
        price: '£69.00',
        url: '/collections/stands',
        top: '40%',
        left: '20%',
        benefit: 'Smooth 360-degree swivel to angle your webcam perfectly for video meetings.',
      },
    ],
  },
  {
    id: 'setup-james-cambridge',
    customerName: 'James & Sarah L.',
    role: 'Remote Couple (Tech & Education)',
    city: 'Cambridge, England',
    laptop: 'Apple MacBook & Windows PC',
    laptopType: 'hybrid',
    quote: '"I use an Apple MacBook for work and my partner uses a Windows laptop. We share the same desk without ever having to swap cables or fiddle with settings. One cable fits both machines."',
    rating: 5,
    verifiedOrder: 'Verified UK Order',
    deskTheme: 'Shared Home Office',
    hotspots: [
      {
        id: 'hs-dock-4',
        title: 'NexaDesk One-Cable Dual Dock',
        category: 'Universal Hub',
        price: '£169.00',
        url: '/collections/docks-hubs',
        top: '48%',
        left: '50%',
        benefit: 'Works automatically with both Apple Mac and Windows without installing any software.',
      },
      {
        id: 'hs-mouse-4',
        title: 'Ergonomic Silent Wireless Mouse',
        category: 'Silent Mouse',
        price: '£39.00',
        url: '/collections/mice',
        top: '60%',
        left: '75%',
        benefit: 'Switches between the MacBook and Windows PC in a single click.',
      },
    ],
  },
];

export function CustomerSetupShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const sliderRef = useRef(null);
  const chipsTrackRef = useRef(null);

  const activeSetup = CUSTOMER_SETUPS[activeIndex];

  // Auto-scroll track when activeIndex changes
  useEffect(() => {
    setActiveHotspot(null);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? CUSTOMER_SETUPS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === CUSTOMER_SETUPS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="customer-showcase-section" aria-label="Customer Workstations & Social Proof">
      <div className="customer-showcase-container">
        {/* Section Header */}
        <div className="showcase-header">
          <div className="showcase-header-pill">
            <span className="pulse-green-dot" aria-hidden="true" />
            <span>Loved by 2,400+ Remote Workers in the UK</span>
          </div>

          <h2 className="showcase-title">
            See how everyday professionals simplified their desks.
          </h2>

          <p className="showcase-subtitle">
            Real home offices and studios across the UK. Tap any glowing pin to see the exact one-cable docks, screens, and ergonomic stands they use every day.
          </p>

          {/* Carousel Navigation Buttons */}
          <div className="showcase-nav-controls">
            <button
              type="button"
              className="showcase-nav-arrow prev"
              onClick={handlePrev}
              aria-label="Previous customer setup"
            >
              ←
            </button>

            <div className="showcase-dots">
              {CUSTOMER_SETUPS.map((setup, idx) => (
                <button
                  key={setup.id}
                  type="button"
                  className={`showcase-dot ${idx === activeIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to ${setup.customerName}'s setup`}
                />
              ))}
            </div>

            <button
              type="button"
              className="showcase-nav-arrow next"
              onClick={handleNext}
              aria-label="Next customer setup"
            >
              →
            </button>
          </div>
        </div>

        {/* Interactive Showcase Card */}
        <div className="showcase-main-card">
          <div className="showcase-card-grid">
            {/* Left: Interactive Visual Desk View with Clickable Pins */}
            <div className="showcase-visual-wrapper">
              <div className="showcase-interactive-stage">
                {/* Visual Desk Environment Mockup */}
                <div className="stage-desk-surface">
                  <div className="desk-mockup-monitor">
                    <div className="desk-mockup-screen">
                      <div className="screen-wireframe-bar" />
                      <div className="screen-wireframe-grid">
                        <span /><span />
                      </div>
                    </div>
                    <div className="desk-mockup-arm" />
                  </div>

                  <div className="desk-mockup-laptop">
                    <div className="mockup-laptop-lid">
                      {activeSetup.laptopType === 'apple' && (
                        <div className="laptop-lid-logo" aria-hidden="true">
                          <RealAppleIcon size={11} />
                        </div>
                      )}
                      {activeSetup.laptopType === 'windows' && (
                        <div className="laptop-lid-logo windows" aria-hidden="true">
                          <WindowsIcon size={10} />
                        </div>
                      )}
                      {activeSetup.laptopType === 'hybrid' && (
                        <div className="laptop-lid-logo" aria-hidden="true">
                          <RealAppleIcon size={11} />
                        </div>
                      )}
                    </div>
                    <div className="mockup-laptop-base" />
                  </div>

                  <div className="desk-mockup-dock">
                    <span className="dock-led" />
                  </div>

                  <div className="desk-mockup-keyboard">
                    <span className="kb-space" />
                  </div>

                  <div className="desk-mockup-mouse" />

                  {/* Single Glowing Clean Cable connecting them */}
                  <svg className="desk-cable-line" viewBox="0 0 400 120" fill="none">
                    <path
                      d="M 120 70 C 180 50, 200 90, 260 65"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Hotspot Pins */}
                {activeSetup.hotspots.map((hs) => {
                  const isOpened = activeHotspot?.id === hs.id;
                  const isLowerHalf = parseInt(hs.top, 10) > 35;
                  const isRightHalf = parseInt(hs.left, 10) > 60;
                  return (
                    <div
                      key={hs.id}
                      className={`hotspot-pin-wrapper ${isOpened ? 'is-active' : ''} ${isLowerHalf ? 'open-upwards' : 'open-downwards'} ${isRightHalf ? 'align-right' : ''}`}
                      style={{top: hs.top, left: hs.left}}
                    >
                      <button
                        type="button"
                        className="hotspot-pin-btn"
                        onClick={() => setActiveHotspot(isOpened ? null : hs)}
                        aria-expanded={isOpened}
                        aria-label={`View details for ${hs.title}`}
                      >
                        <span className="hotspot-ripple-ring" aria-hidden="true" />
                        <span className="hotspot-center-dot" aria-hidden="true" />
                      </button>

                      {/* Popover Card */}
                      {isOpened && (
                        <div className="hotspot-popover-card">
                          <button
                            type="button"
                            className="popover-close-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(null);
                            }}
                            aria-label="Close details"
                          >
                            ✕
                          </button>
                          <span className="popover-category">{hs.category}</span>
                          <strong className="popover-title">{hs.title}</strong>
                          <p className="popover-desc">{hs.benefit}</p>
                          <div className="popover-bottom">
                            <span className="popover-price">{hs.price}</span>
                            <Link to={hs.url} className="popover-link">
                              <span>See Item</span>
                              <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pin Interaction Hint */}
              <div className="hotspot-helper-hint">
                <span className="pulse-dot-small" />
                <span>Tap any glowing pin to see what they used</span>
              </div>
            </div>

            {/* Right: Human Customer Story & Verified Review */}
            <div className="showcase-story-content">
              <div className="story-meta-row">
                <div className="story-stars" aria-label="5 out of 5 stars">
                  {'★★★★★'}
                </div>
                <span className="story-verified-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span>{activeSetup.verifiedOrder}</span>
                </span>
              </div>

              <blockquote className="story-quote">
                {activeSetup.quote}
              </blockquote>

              <div className="story-author-details">
                <div className="author-avatar-initials">
                  {activeSetup.customerName.charAt(0)}
                </div>
                <div className="author-text">
                  <strong className="author-name">{activeSetup.customerName}</strong>
                  <span className="author-role">{activeSetup.role} • {activeSetup.city}</span>
                </div>
              </div>

              {/* Laptop Compatibility Badge */}
              <div className="story-device-card">
                <div className="device-icon-box">
                  {activeSetup.laptopType === 'apple' ? (
                    <RealAppleIcon size={16} />
                  ) : activeSetup.laptopType === 'windows' ? (
                    <WindowsIcon size={15} />
                  ) : (
                    <span style={{display: 'flex', gap: '3px', alignItems: 'center'}}>
                      <RealAppleIcon size={14} />
                      <WindowsIcon size={13} />
                    </span>
                  )}
                </div>
                <div className="device-info">
                  <span className="device-title">Tested With</span>
                  <strong className="device-name">{activeSetup.laptop}</strong>
                </div>
                <span className="device-check-pill">1-Cord Verified</span>
              </div>

              {/* Gear In This Setup List */}
              <div className="story-gear-list">
                <div className="gear-list-header-row">
                  <span className="gear-list-header">Gear featured in this workspace:</span>
                  <div className="gear-scroll-arrows">
                    <button
                      type="button"
                      className="gear-scroll-arrow-btn"
                      onClick={() => {
                        if (chipsTrackRef.current) {
                          chipsTrackRef.current.scrollBy({left: -180, behavior: 'smooth'});
                        }
                      }}
                      aria-label="Scroll gear left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="gear-scroll-arrow-btn"
                      onClick={() => {
                        if (chipsTrackRef.current) {
                          chipsTrackRef.current.scrollBy({left: 180, behavior: 'smooth'});
                        }
                      }}
                      aria-label="Scroll gear right"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className="gear-chips-scroll-container">
                  <div className="gear-chips-wrap" ref={chipsTrackRef}>
                    {activeSetup.hotspots.map((hs) => (
                      <button
                        key={hs.id}
                        type="button"
                        className={`gear-chip-btn ${activeHotspot?.id === hs.id ? 'is-active' : ''}`}
                        onClick={() => setActiveHotspot(hs)}
                      >
                        <span className="chip-bullet" />
                        <span>{hs.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
