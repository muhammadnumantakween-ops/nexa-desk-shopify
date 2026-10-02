import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';

/**
 * UI-HOME-01: Kinetic 3D Desk Setup Assembly Hero
 *
 * Requirements & Features:
 * 1. High-resolution exploded desk workstation view:
 *    - Host Laptop (Studio / Mac workstation)
 *    - Certified NexaLink Pro 100 Docking Hub
 *    - High-Speed USB-C Thunderbolt 4 Braided Cable (with glowing electric pulse)
 *    - 4K Ultrawide Curved Monitor with ergonomic monitor arm
 *    - Mechanical Keyboard & Precision Wireless Mouse
 * 2. Scroll-Scrub Assembly Physics:
 *    - As user scrolls through the hero pinning zone (0 to 300px+), the components smoothly interpolate
 *      from an exploded, floating isometric state into an assembled, perfectly connected workstation.
 * 3. Manual Assembly Mode Toggle:
 *    - Allows users to drag an interactive scrub slider or click "Snap Together" / "Exploded View"
 *      to inspect the internal architecture, ports, and power flow at any scroll position.
 * 4. Interactive Component Hotspots:
 *    - Hovering or tapping any component (Monitor, Dock, Cable, Laptop, Stand) reveals verified specs
 *      (e.g., "100W PD Pass-Through", "Dual 4K@60Hz HDMI/DP", "Braided 40Gbps E-Marker").
 * 5. Direct CTA Handoff:
 *    - "Find My Setup Configurator" (Primary) and "Shop Docking Range" (Secondary).
 */

export function HeroAssembly() {
  const [assemblyProgress, setAssemblyProgress] = useState(0); // 0 (Exploded) -> 1 (Fully Assembled)
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualOverride || !heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the hero section (0 to 300px scroll scrub)
      const scrolled = Math.max(0, -rect.top);
      const scrubDistance = 350;
      const progress = Math.min(1, Math.max(0, scrolled / scrubDistance));
      setAssemblyProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isManualOverride]);

  // Interpolation helper: computes style transform values based on progress (0 -> 1)
  const getProgress = (val) => {
    return Math.max(0, Math.min(1, val));
  };

  const p = getProgress(assemblyProgress);
  const invP = 1 - p; // 1 at exploded, 0 at assembled

  return (
    <section className="hero-assembly-section" ref={heroRef} aria-label="NexaDesk Kinetic Hero Experience">
      {/* Background glow and subtle tech grid */}
      <div className="hero-grid-backdrop" aria-hidden="true" />
      <div className="hero-radial-glow" aria-hidden="true" />

      <div className="hero-container">
        {/* Top Header Text Content */}
        <div className="hero-header-content">
          <div className="hero-pill-badge">
            <span className="pulse-blue-dot" aria-hidden="true" />
            <span className="hero-badge-text">Tested & Certified for UK Desks</span>
          </div>

          <h1 className="hero-main-title">
            Your Dream Desk Setup, <br />
            <span className="hero-gradient-text">Connected With One Cable.</span>
          </h1>

          <p className="hero-subtitle">
            No confusing adapters, no messy tangled wires, and no guessing if things will fit. Simply plug in your laptop to charge, run big screens, and work comfortably all day.
          </p>

          <div className="hero-cta-group">
            <Link to="/find-my-setup" className="hero-primary-btn">
              <span>Find What Fits My Laptop</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link to="/collections/docks-hubs" className="hero-secondary-btn">
              <span>See One-Cable Docks</span>
            </Link>
          </div>

          {/* Quick Plain-English Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-value">Fast Charging</span>
              <span className="metric-label">Powers your laptop instantly</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">Dual Big Screens</span>
              <span className="metric-label">Crisp & flicker-free</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">100% Guaranteed</span>
              <span className="metric-label">Works out of the box</span>
            </div>
          </div>
        </div>

        {/* 3D Exploded / Assembled Interactive Workstation Stage */}
        <div className="hero-stage-wrapper">
          {/* Stage Controls: Interactive scrubber & view modes */}
          <div className="hero-stage-controls">
            <div className="stage-controls-left">
              <span className="stage-state-indicator">
                {p < 0.15 ? 'Separate Pieces (Take Apart)' : p > 0.85 ? 'Ready-to-Use Desk (All Connected)' : 'Connecting Together...'}
              </span>
              <span className="stage-percentage">{Math.round(p * 100)}%</span>
            </div>

            <div className="stage-controls-right">
              <button
                type="button"
                className={`stage-mode-btn ${p < 0.5 ? 'is-active' : ''}`}
                onClick={() => {
                  setIsManualOverride(true);
                  setAssemblyProgress(0);
                }}
                aria-label="Switch to Take Apart View"
              >
                See Pieces Apart
              </button>
              <button
                type="button"
                className={`stage-mode-btn ${p >= 0.5 ? 'is-active' : ''}`}
                onClick={() => {
                  setIsManualOverride(true);
                  setAssemblyProgress(1);
                }}
                aria-label="Switch to Connected View"
              >
                Snap Connected
              </button>
            </div>
          </div>

          {/* Interactive Scrub Slider for Manual Scrubbing */}
          <div className="hero-slider-track">
            <label htmlFor="assembly-slider" className="sr-only">Assemble desk components slider</label>
            <input
              id="assembly-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={assemblyProgress}
              onChange={(e) => {
                setIsManualOverride(true);
                setAssemblyProgress(parseFloat(e.target.value));
              }}
              className="assembly-range-input"
              aria-label="Desk assembly progress"
            />
          </div>

          {/* The Isometric 3D Kinetic Canvas Stage */}
          <div className="kinetic-canvas">
            {/* Ambient Shadow Plane */}
            <div
              className="stage-shadow-plane"
              style={{
                opacity: 0.2 + p * 0.4,
                transform: `scale(${0.9 + p * 0.1})`,
              }}
              aria-hidden="true"
            />

            {/* Component 1: Monitor & Display on Articulated Arm */}
            <div
              className={`kinetic-node monitor-node ${activeHotspot === 'monitor' ? 'is-highlighted' : ''}`}
              style={{
                transform: `translate3d(0, ${-invP * 85}px, ${invP * 40}px) scale(${1 - invP * 0.05})`,
                opacity: 0.95 + p * 0.05,
              }}
              onMouseEnter={() => setActiveHotspot('monitor')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot((prev) => (prev === 'monitor' ? null : 'monitor'))}
              tabIndex={0}
              role="button"
              aria-label="Ultra-wide computer screen"
            >
              <div className="component-visual monitor-frame">
                <div className="monitor-screen">
                  <div className="monitor-ui-mockup">
                    <div className="mockup-sidebar" />
                    <div className="mockup-content">
                      <div className="mockup-card active" />
                      <div className="mockup-card" />
                      <div className="mockup-card" />
                    </div>
                  </div>
                  <div className="monitor-screen-glare" />
                </div>
                <div className="monitor-bezel-bottom">
                  <span className="nexa-logo-screen">NexaDesk Wide Screen</span>
                </div>
                <div className="monitor-stand-arm" />
              </div>

              {/* Hotspot Badge */}
              <div className="component-hotspot-chip">
                <span className="hotspot-dot" />
                <span className="hotspot-text">Wide Screen (Gentle on Eyes)</span>
              </div>
            </div>

            {/* Component 2: Certified Docking Station (Central Hub) */}
            <div
              className={`kinetic-node dock-node ${activeHotspot === 'dock' ? 'is-highlighted' : ''}`}
              style={{
                transform: `translate3d(${invP * 65}px, ${invP * 40}px, 0) scale(${1 + invP * 0.08})`,
              }}
              onMouseEnter={() => setActiveHotspot('dock')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot((prev) => (prev === 'dock' ? null : 'dock'))}
              tabIndex={0}
              role="button"
              aria-label="Central one-cable desk dock"
            >
              <div className="component-visual dock-body">
                <div className="dock-status-light" />
                <div className="dock-ports-front">
                  <span className="port-slot usb-c" />
                  <span className="port-slot usb-a" />
                  <span className="port-slot audio" />
                </div>
                <div className="dock-label">One-Cable Dock</div>
              </div>

              {/* Hotspot Badge */}
              <div className="component-hotspot-chip right">
                <span className="hotspot-dot green" />
                <span className="hotspot-text">Charges & Connects Everything</span>
              </div>
            </div>

            {/* Component 3: Kinetic USB-C Data & Power Cable (Snaps between Laptop & Dock) */}
            <div
              className="kinetic-cable-wrapper"
              style={{
                opacity: 0.4 + p * 0.6,
                transform: `scale(${0.92 + p * 0.08})`,
              }}
              aria-hidden="true"
            >
              <svg className="kinetic-cable-svg" viewBox="0 0 600 240" fill="none">
                {/* Glow path */}
                <path
                  d={`M 175 145 C ${220 + invP * 60} ${120 - invP * 40}, ${340 - invP * 40} ${160 + invP * 50}, 420 148`}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Core Cable */}
                <path
                  d={`M 175 145 C ${220 + invP * 60} ${120 - invP * 40}, ${340 - invP * 40} ${160 + invP * 50}, 420 148`}
                  stroke="#3b82f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Flowing electric data pulse */}
                <path
                  d={`M 175 145 C ${220 + invP * 60} ${120 - invP * 40}, ${340 - invP * 40} ${160 + invP * 50}, 420 148`}
                  stroke="#60a5fa"
                  strokeWidth="4"
                  strokeDasharray="16 48"
                  className="cable-pulse-current"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Component 4: Laptop Workstation on S1 Stand */}
            <div
              className={`kinetic-node laptop-node ${activeHotspot === 'laptop' ? 'is-highlighted' : ''}`}
              style={{
                transform: `translate3d(${-invP * 90}px, ${invP * 30}px, 0) scale(${1 - invP * 0.04})`,
              }}
              onMouseEnter={() => setActiveHotspot('laptop')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot((prev) => (prev === 'laptop' ? null : 'laptop'))}
              tabIndex={0}
              role="button"
              aria-label="Your Laptop on stand"
            >
              <div className="component-visual laptop-unit">
                <div className="laptop-lid">
                  <div className="laptop-screen-content">
                    <div className="screen-active-badge">Your Laptop: Fast & Charged</div>
                  </div>
                </div>
                <div className="laptop-base">
                  <div className="laptop-trackpad" />
                </div>
                <div className="laptop-riser-stand" />
              </div>

              {/* Hotspot Badge */}
              <div className="component-hotspot-chip left">
                <span className="hotspot-dot blue" />
                <span className="hotspot-text">Your Laptop (Mac or PC)</span>
              </div>
            </div>

            {/* Component 5: Peripherals (Mechanical Keyboard & Precision Mouse) */}
            <div
              className={`kinetic-node desk-peripherals-node ${activeHotspot === 'peripherals' ? 'is-highlighted' : ''}`}
              style={{
                transform: `translate3d(0, ${invP * 60}px, 0) scale(${1 - invP * 0.08})`,
                opacity: 0.7 + p * 0.3,
              }}
              onMouseEnter={() => setActiveHotspot('peripherals')}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => setActiveHotspot((prev) => (prev === 'peripherals' ? null : 'peripherals'))}
              tabIndex={0}
              role="button"
              aria-label="Comfortable Keyboard and Wireless Mouse"
            >
              <div className="peripherals-cluster">
                <div className="keyboard-fixture">
                  <div className="key-row">
                    <span className="key" /><span className="key" /><span className="key" /><span className="key" /><span className="key" /><span className="key" />
                  </div>
                  <div className="key-row space">
                    <span className="key spacebar" />
                  </div>
                </div>
                <div className="mouse-fixture">
                  <div className="mouse-wheel" />
                </div>
              </div>

              {/* Hotspot Badge */}
              <div className="component-hotspot-chip bottom">
                <span className="hotspot-dot" />
                <span className="hotspot-text">Comfort Keyboard & Mouse</span>
              </div>
            </div>
          </div>

          {/* Active Spec Tooltip Drawer for Tap / Hover (Simple terms) */}
          {activeHotspot && (
            <div className="hero-spec-popover">
              {activeHotspot === 'monitor' && (
                <div className="spec-popover-content">
                  <strong>Extra-Wide Work Screen</strong>
                  <p>Plenty of space to view documents and video calls side-by-side without squinting or straining your eyes.</p>
                  <Link to="/collections/monitors" className="spec-link">See Computer Screens →</Link>
                </div>
              )}
              {activeHotspot === 'dock' && (
                <div className="spec-popover-content">
                  <strong>All-in-One Desk Hub</strong>
                  <p>Charges your laptop quickly while connecting your screens, mouse, keyboard, and internet through one single cord.</p>
                  <Link to="/collections/docks-hubs" className="spec-link">Find The Right Dock for You →</Link>
                </div>
              )}
              {activeHotspot === 'laptop' && (
                <div className="spec-popover-content">
                  <strong>Works With Any Laptop</strong>
                  <p>Whether you use an Apple MacBook or a Windows laptop, we ensure you get the exact plug that works seamlessly.</p>
                  <Link to="/find-my-setup" className="spec-link">Check My Laptop (Easy 30s Quiz) →</Link>
                </div>
              )}
              {activeHotspot === 'peripherals' && (
                <div className="spec-popover-content">
                  <strong>Comfortable Typing & Pointing</strong>
                  <p>Lightweight aluminium stand to save your neck, plus a quiet keyboard and ergonomic mouse to protect your wrists.</p>
                  <Link to="/collections/keyboards" className="spec-link">Browse Desk Accessories →</Link>
                </div>
              )}
            </div>
          )}

          {/* Bottom Interaction Guide */}
          <div className="hero-assembly-hint">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
            <span>Scroll down or slide the bar to see how everything connects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
