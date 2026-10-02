import {useState} from 'react';
import {Link} from 'react-router';

/**
 * UI-HOME-03: Interactive Port & Power Flow Visualizer (Feature Showcase)
 *
 * Requirements & Features:
 * 1. Visual representation of 100W Power Delivery and dual 4K video streams flowing through USB-C cable.
 * 2. SVG stroke-dashoffset infinite glowing electric current animation.
 * 3. Interactive stream modes:
 *    - Mode 1: All Streams Active (Simultaneous 100W Charging + Two 4K Displays + 10Gbps USB Data)
 *    - Mode 2: High-Speed Power Only (Focus on laptop fast charging)
 *    - Mode 3: Dual Ultra-Crisp Displays (Focus on dual monitor video stream output)
 * 4. Plain-English, human-readable explanations so non-technical shoppers instantly understand
 *    why a quality one-cable dock is so much better than messy dongles.
 * 5. Full width adaptive canvas across desktop (1024px+), tablet (768px), and mobile (360px).
 */

// Real Brand and Hardware Icons for Everyday Clarity
function RealAppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 170 170" fill="currentColor" aria-label="Apple logo" style={{display: 'inline-block'}}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

function WindowsBrandIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-label="Windows logo" style={{display: 'inline-block'}}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
    </svg>
  );
}

function DeskHubIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="3" />
      <line x1="10" y1="12" x2="10.01" y2="12" strokeWidth="3" />
      <line x1="14" y1="12" x2="14.01" y2="12" strokeWidth="3" />
      <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="3" />
      <path d="M7 18v2M17 18v2" />
    </svg>
  );
}

export function PowerFlowVisualizer() {
  const [activeStream, setActiveStream] = useState('all'); // 'all' | 'power' | 'video'

  return (
    <section className="power-flow-section" aria-label="How One Cable Replaces All Messy Chargers">
      <div className="power-flow-container">
        {/* Section Header in Everyday Plain Language */}
        <div className="power-flow-header">
          <div className="flow-badge-pill">
            <span className="flow-sparkle-dot" aria-hidden="true" />
            <span className="flow-badge-text">No More Cable Clutter</span>
          </div>

          <h2 className="flow-title">
            One single wire does the work of 5 messy chargers.
          </h2>

          <p className="flow-subtitle">
            Plug in just one cord when you sit down. Your laptop battery charges at full speed, your two large desk screens turn on immediately, and your mouse and keyboard connect with zero fuss.
          </p>

          {/* Stream Selector Buttons with Human-Friendly Terms */}
          <div className="flow-toggle-group" role="tablist" aria-label="Choose what you want to see inside the wire">
            <button
              type="button"
              role="tab"
              aria-selected={activeStream === 'all'}
              className={`flow-tab-btn ${activeStream === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveStream('all')}
            >
              <span className="tab-dot all" aria-hidden="true" />
              <span>Show Everything (Charging + 2 Screens + Mouse)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStream === 'power'}
              className={`flow-tab-btn ${activeStream === 'power' ? 'is-active' : ''}`}
              onClick={() => setActiveStream('power')}
            >
              <span className="tab-dot power" aria-hidden="true" />
              <span>Fast Laptop Charging</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStream === 'video'}
              className={`flow-tab-btn ${activeStream === 'video' ? 'is-active' : ''}`}
              onClick={() => setActiveStream('video')}
            >
              <span className="tab-dot video" aria-hidden="true" />
              <span>Two Big Extra Screens</span>
            </button>
          </div>
        </div>

        {/* Visual Interactive Canvas */}
        <div className="flow-canvas-wrapper">
          {/* Top Live Stats Bar - Plain English */}
          <div className="flow-canvas-stats">
            <div className={`flow-stat-chip ${activeStream === 'power' || activeStream === 'all' ? 'active-power' : ''}`}>
              <span className="stat-indicator yellow-dot" />
              <div className="stat-copy">
                <strong>Rapid Battery Charging</strong>
                <span>Keeps laptop 100% full without heavy chargers</span>
              </div>
            </div>

            <div className={`flow-stat-chip ${activeStream === 'video' || activeStream === 'all' ? 'active-video' : ''}`}>
              <span className="stat-indicator blue-dot" />
              <div className="stat-copy">
                <strong>Two Big Crisp Monitors</strong>
                <span>Clear text that is comfortable and easy on eyes</span>
              </div>
            </div>

            <div className={`flow-stat-chip ${activeStream === 'all' ? 'active-data' : ''}`}>
              <span className="stat-indicator green-dot" />
              <div className="stat-copy">
                <strong>Mouse, Keyboard & Sound</strong>
                <span>All your desktop gear connects instantly</span>
              </div>
            </div>
          </div>

          {/* SVG Animated Current Stage */}
          <div className="flow-stage-interactive">
            {/* Left Source: The Desk Hub */}
            <div className="flow-endpoint dock-endpoint">
              <div className="endpoint-icon-box">
                <DeskHubIcon />
              </div>
              <strong className="endpoint-name">Nexa Desk Hub</strong>
              <span className="endpoint-sub">Plugs into wall outlet</span>
              <span className="endpoint-tag">Powers Entire Desk</span>
            </div>

            {/* Central Cable Stream SVG with Glowing animated paths */}
            <div className="flow-cable-svg-box">
              <svg className="flow-svg-canvas" viewBox="0 0 540 180" fill="none">
                {/* Background Outer Shielding Cord */}
                <path
                  d="M 20 90 C 140 30, 400 150, 520 90"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="28"
                  strokeLinecap="round"
                />

                {/* 1. POWER STREAM PATH (Yellow / Gold Glowing Electricity) */}
                {(activeStream === 'all' || activeStream === 'power') && (
                  <>
                    <path
                      d="M 20 78 C 140 18, 400 138, 520 78"
                      stroke="rgba(245, 158, 11, 0.25)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 78 C 140 18, 400 138, 520 78"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="flowing-current-path power"
                    />
                  </>
                )}

                {/* 2. DUAL VIDEO SCREEN STREAM (Cyan / Blue High-Def Signals) */}
                {(activeStream === 'all' || activeStream === 'video') && (
                  <>
                    <path
                      d="M 20 90 C 140 30, 400 150, 520 90"
                      stroke="rgba(56, 189, 248, 0.25)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 90 C 140 30, 400 150, 520 90"
                      stroke="#38bdf8"
                      strokeWidth="4"
                      strokeLinecap="round"
                      className="flowing-current-path video"
                    />
                  </>
                )}

                {/* 3. ACCESSORY DATA STREAM (Emerald / Green) */}
                {activeStream === 'all' && (
                  <>
                    <path
                      d="M 20 102 C 140 42, 400 162, 520 102"
                      stroke="rgba(34, 197, 94, 0.25)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 20 102 C 140 42, 400 162, 520 102"
                      stroke="#22c55e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="flowing-current-path data"
                    />
                  </>
                )}
              </svg>

              {/* In-Transit Label Badge */}
              <div className="flow-center-tag">
                <span className="cable-type-pill">⚡ Strong Braided Cable (Included)</span>
              </div>
            </div>

            {/* Right Destination: Your Apple MacBook or Windows Laptop */}
            <div className="flow-endpoint laptop-endpoint">
              <div className="endpoint-icon-box laptop" style={{display: 'flex', gap: '0.45rem', alignItems: 'center', justifyContent: 'center'}}>
                <RealAppleIcon />
                <WindowsBrandIcon />
              </div>
              <strong className="endpoint-name">Your Laptop</strong>
              <span className="endpoint-sub">Apple MacBook or Windows PC</span>
              <span className="endpoint-tag success">Works 100% Guaranteed</span>
            </div>
          </div>

          {/* Three Feature Cards Below */}
          <div className="flow-feature-cards-grid">
            <div className="flow-card">
              <div className="flow-card-icon power-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className="flow-card-title">Leave Your Bulky Charger at Home</h3>
              <p className="flow-card-desc">
                The hub stays plugged into the wall and delivers fast, safe power straight into your laptop. You will never have to hunt for an outlet or pack heavy bricks in your bag.
              </p>
            </div>

            <div className="flow-card">
              <div className="flow-card-icon video-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="flow-card-title">Two Big Screens Without Any Lag</h3>
              <p className="flow-card-desc">
                Spread your emails, spreadsheets, and video calls across two large monitors. Everything stays crystal clear with no flickering or sluggish delay.
              </p>
            </div>

            <div className="flow-card">
              <div className="flow-card-icon data-bg">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="flow-card-title">Sit Down & Start Working in 2 Seconds</h3>
              <p className="flow-card-desc">
                Just plug in one cable when you sit down. Your mouse, keyboard, speakers, and wired internet instantly wake up ready to go.
              </p>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="flow-bottom-action">
            <div className="action-text">
              <strong>Ready to clean up your workspace?</strong>
              <span>Take our quick 30-second quiz to find the perfect one-cable dock for your exact laptop.</span>
            </div>
            <Link to="/find-my-setup" className="flow-action-btn">
              <span>Find My One-Cable Dock</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
