import {useState, useEffect} from 'react';

/**
 * UI-BUILD-02: Live Interactive Workstation Blueprint
 * Interactive SVG rendering of Selected Laptop, Dock, Monitor, and Peripherals
 * Features animated current cable lines with stroke-dashoffset drawing,
 * real-time status pulses, and collapsible mobile drawer / desktop split-pane.
 */
export function WorkstationBlueprint({profile, dock, monitor, accessories = [], isDrawer = false}) {
  const [pulseKey, setPulseKey] = useState(0);

  // Trigger animation refresh on selection changes
  useEffect(() => {
    setPulseKey((k) => k + 1);
  }, [profile?.code, dock?.id, monitor?.id, accessories.length]);

  const hasDock = Boolean(dock);
  const hasMonitor = Boolean(monitor);
  const hasProfile = Boolean(profile);
  const hasVideoSupport = profile?.usb_c_video_support !== false;
  const isFullyConnected = hasProfile && hasDock && hasMonitor && hasVideoSupport;

  const hasKeyboard = accessories.some((a) => a.product_role === 'keyboard');
  const hasMouse = accessories.some((a) => a.product_role === 'mouse');
  const hasStand = accessories.some((a) => a.product_role === 'stand');

  const dockWatts = Number(dock?.charging_output_watts || dock?.dock_charging_output || 0);

  return (
    <div className={`workstation-blueprint-card ${isDrawer ? 'is-drawer-view' : ''}`}>
      <div className="blueprint-header-strip">
        <div className="blueprint-title-row">
          <span className="blueprint-status-indicator pulse-dot" />
          <h3 className="blueprint-headline">Live Workstation Blueprint</h3>
        </div>
        <span className="blueprint-mode-tag">
          {isFullyConnected ? '⚡ Live Verified Link' : 'Interactive Architectural CAD'}
        </span>
      </div>

      <div className="blueprint-canvas-wrapper">
        <svg
          key={pulseKey}
          viewBox="0 0 860 480"
          className="blueprint-svg-canvas"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Interactive Workstation Setup Diagram"
        >
          <defs>
            {/* Tech Grid Pattern */}
            <pattern id="cadGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(212, 175, 55, 0.2)" />
            </pattern>

            {/* Glowing Cable Gradients */}
            <linearGradient id="powerCableGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="videoCableGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="deskPadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Technical Grid */}
          <rect width="860" height="480" fill="url(#cadGrid)" />

          {/* Desk Surface Blueprint Boundary */}
          <rect
            x="30"
            y="40"
            width="800"
            height="400"
            rx="16"
            fill="url(#deskPadGradient)"
            stroke="rgba(212, 175, 55, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* 1. HOST DEVICE / LAPTOP SECTION (Left Area: Center ~170, 240) */}
          <g className="blueprint-node laptop-node" transform="translate(70, 150)">
            {/* Laptop Stand if equipped */}
            {hasStand && (
              <path
                d="M 20 180 L 80 120 L 140 180"
                stroke="#d4af37"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Laptop Base */}
            <rect
              x="0"
              y="70"
              width="170"
              height="110"
              rx="8"
              fill="#1e293b"
              stroke={hasProfile ? '#38bdf8' : 'rgba(148, 163, 184, 0.4)'}
              strokeWidth="2"
            />
            {/* Keyboard Well */}
            <rect x="15" y="85" width="140" height="60" rx="4" fill="#0f172a" stroke="rgba(148, 163, 184, 0.2)" />
            {/* Trackpad */}
            <rect x="60" y="150" width="50" height="24" rx="3" fill="#1e293b" stroke="rgba(148, 163, 184, 0.3)" />

            {/* Laptop Screen (Angled back) */}
            <rect
              x="10"
              y="0"
              width="150"
              height="70"
              rx="6"
              fill="#0b1120"
              stroke={hasProfile ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)'}
              strokeWidth="1.5"
            />
            <rect x="18" y="8" width="134" height="54" rx="3" fill="#0284c7" fillOpacity={hasProfile ? '0.15' : '0.05'} />

            {/* Laptop Screen Content / Name */}
            <text x="85" y="38" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="600">
              {hasProfile ? profile.label : 'Select Device Profile'}
            </text>
            <text x="85" y="52" textAnchor="middle" fill="#94a3b8" fontSize="9">
              {hasProfile
                ? `${profile.host_connector} • ${profile.required_charging_watts}W Req`
                : 'Step 1'}
            </text>

            {/* Port Outlet Pin on Laptop */}
            <circle cx="170" cy="120" r="5" fill="#38bdf8" filter="url(#goldGlow)" />
            <text x="170" y="140" fill="#38bdf8" fontSize="8" fontWeight="bold">
              {profile?.host_connector || 'USB'}
            </text>
          </g>

          {/* 2. DOCKING STATION SECTION (Center Area: Center ~380, 240) */}
          <g className="blueprint-node dock-node" transform="translate(310, 180)">
            <rect
              x="0"
              y="0"
              width="130"
              height="160"
              rx="12"
              fill="#0f172a"
              stroke={hasDock ? '#d4af37' : 'rgba(148, 163, 184, 0.4)'}
              strokeWidth={hasDock ? '2.5' : '1.5'}
              filter={hasDock ? 'url(#goldGlow)' : 'none'}
            />
            {/* Dock Faceplate Detail */}
            <rect x="10" y="10" width="110" height="140" rx="8" fill="#1e293b" />
            
            {/* Power Status LED */}
            <circle cx="65" cy="30" r="5" fill={hasDock ? '#22c55e' : '#64748b'} className={hasDock ? 'pulse-light' : ''} />

            {/* Dock Brand & Wattage */}
            <text x="65" y="55" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="700">
              {hasDock ? (dock.title || dock.label || 'Connection Hub') : 'Dock Hub'}
            </text>
            <text x="65" y="72" textAnchor="middle" fill="#d4af37" fontSize="12" fontWeight="800">
              {hasDock ? `⚡ ${dockWatts}W PD` : 'Step 2'}
            </text>

            {/* Port Cluster on Dock Front/Back */}
            <g transform="translate(18, 90)">
              {/* Host Input Port (Left Side) */}
              <rect x="0" y="5" width="22" height="12" rx="3" fill="#38bdf8" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1" />
              <text x="11" y="14" textAnchor="middle" fill="#f8fafc" fontSize="7">IN</text>

              {/* Video Output Ports */}
              <rect x="36" y="5" width="22" height="12" rx="2" fill="#d4af37" fillOpacity="0.4" stroke="#d4af37" strokeWidth="1" />
              <text x="47" y="14" textAnchor="middle" fill="#f8fafc" fontSize="7">HDMI</text>

              <rect x="68" y="5" width="22" height="12" rx="2" fill="#d4af37" fillOpacity="0.4" stroke="#d4af37" strokeWidth="1" />
              <text x="79" y="14" textAnchor="middle" fill="#f8fafc" fontSize="7">DP</text>
            </g>

            {/* Status Label */}
            <text x="65" y="138" textAnchor="middle" fill="#94a3b8" fontSize="9">
              {hasDock ? (dock.product_role === 'hub-only' ? 'USB Hub Only' : 'Universal Hub') : 'Choose Dock'}
            </text>

            {/* Input Port Point */}
            <circle cx="0" cy="80" r="5" fill="#38bdf8" />
            {/* Output Port Point */}
            <circle cx="130" cy="80" r="5" fill="#d4af37" />
          </g>

          {/* 3. MONITOR SECTION (Right Area: Center ~620, 180) */}
          <g className="blueprint-node monitor-node" transform="translate(510, 80)">
            {/* Monitor Outer Shell */}
            <rect
              x="0"
              y="0"
              width="270"
              height="180"
              rx="10"
              fill="#0f172a"
              stroke={hasMonitor ? '#d4af37' : 'rgba(148, 163, 184, 0.4)'}
              strokeWidth={hasMonitor ? '2.5' : '1.5'}
            />
            {/* Screen Bezel & Panel */}
            <rect
              x="12"
              y="12"
              width="246"
              height="156"
              rx="4"
              fill="#0284c7"
              fillOpacity={hasMonitor ? '0.12' : '0.04'}
            />

            {/* Monitor Content */}
            <text x="135" y="80" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">
              {hasMonitor ? monitor.title : 'External Display'}
            </text>
            <text x="135" y="100" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">
              {hasMonitor ? `${monitor.resolution || '4K Ultra-Sharp'} IPS` : 'Step 3: Select Screen'}
            </text>
            <text x="135" y="118" textAnchor="middle" fill="#94a3b8" fontSize="10">
              {hasMonitor
                ? `Inputs: ${(monitor.video_inputs || monitor.monitor_video_inputs || ['HDMI']).join(', ')}`
                : 'Filtered by Dock Ports'}
            </text>

            {/* Monitor Stand */}
            <path d="M 120 180 L 110 240 L 160 240 L 150 180 Z" fill="#1e293b" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1" />
            <rect x="85" y="240" width="100" height="12" rx="4" fill="#334155" />

            {/* Monitor Video In Port Pin */}
            <circle cx="0" cy="140" r="5" fill="#d4af37" />
            <text x="5" y="155" fill="#d4af37" fontSize="8" fontWeight="bold">VIDEO IN</text>
          </g>

          {/* 4. OPTIONAL DESK ACCESSORIES (Bottom Desk Area) */}
          {/* Keyboard Blueprint Node */}
          <g className="blueprint-node accessory-kb" transform="translate(480, 360)">
            <rect
              x="0"
              y="0"
              width="170"
              height="60"
              rx="6"
              fill="#1e293b"
              stroke={hasKeyboard ? '#d4af37' : 'rgba(148, 163, 184, 0.2)'}
              strokeWidth={hasKeyboard ? '1.5' : '1'}
            />
            {/* Key grid sketch */}
            <line x1="10" y1="20" x2="160" y2="20" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="2" strokeDasharray="6 3" />
            <line x1="10" y1="35" x2="160" y2="35" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="2" strokeDasharray="6 3" />
            <line x1="30" y1="48" x2="140" y2="48" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="3" />
            <text x="85" y="14" textAnchor="middle" fill={hasKeyboard ? '#d4af37' : '#64748b'} fontSize="9" fontWeight="600">
              {hasKeyboard ? 'Universal Keyboard (Added)' : 'Keyboard (Optional)'}
            </text>
          </g>

          {/* Mouse Blueprint Node */}
          <g className="blueprint-node accessory-mouse" transform="translate(680, 360)">
            <rect
              x="0"
              y="0"
              width="45"
              height="64"
              rx="18"
              fill="#1e293b"
              stroke={hasMouse ? '#d4af37' : 'rgba(148, 163, 184, 0.2)'}
              strokeWidth={hasMouse ? '1.5' : '1'}
            />
            <line x1="22.5" y1="0" x2="22.5" y2="25" stroke="rgba(148, 163, 184, 0.3)" strokeWidth="1" />
            <circle cx="22.5" cy="20" r="3" fill="rgba(148, 163, 184, 0.5)" />
            <text x="22.5" y="80" textAnchor="middle" fill={hasMouse ? '#d4af37' : '#64748b'} fontSize="9" fontWeight="600">
              {hasMouse ? 'Mouse' : 'Mouse'}
            </text>
          </g>

          {/* ================================================================ */}
          {/* ANIMATED CABLE CONNECTIONS */}
          {/* ================================================================ */}

          {/* Cable 1: Laptop to Dock (One-Cable Fast Power + Video Hub Interconnect) */}
          {hasProfile && hasDock && (
            <g className="cable-group laptop-to-dock">
              {/* Outer Glow Path */}
              <path
                d="M 240 270 C 275 270, 275 260, 310 260"
                stroke="rgba(56, 189, 248, 0.25)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              {/* Active Current Flowing SVG Path */}
              <path
                d="M 240 270 C 275 270, 275 260, 310 260"
                stroke="url(#powerCableGlow)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="blueprint-flowing-cable"
              />
              {/* Endpoints */}
              <circle cx="240" cy="270" r="4.5" fill="#38bdf8" />
              <circle cx="310" cy="260" r="4.5" fill="#f59e0b" />

              {/* Dynamic Flow Badge */}
              <g transform="translate(255, 240)">
                <rect x="0" y="0" width="46" height="16" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="23" y="11" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                  {profile.host_connector}
                </text>
              </g>
            </g>
          )}

          {/* Cable 2: Dock to Monitor (High-Definition Digital Video Stream) */}
          {hasDock && hasMonitor && (
            <g className="cable-group dock-to-monitor">
              {/* Outer Glow Path */}
              <path
                d="M 440 260 C 475 260, 475 220, 510 220"
                stroke="rgba(212, 175, 55, 0.25)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
              />
              {/* Active Current Flowing SVG Path */}
              <path
                d="M 440 260 C 475 260, 475 220, 510 220"
                stroke="url(#videoCableGlow)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="blueprint-flowing-cable video"
              />
              {/* Endpoints */}
              <circle cx="440" cy="260" r="4.5" fill="#f59e0b" />
              <circle cx="510" cy="220" r="4.5" fill="#38bdf8" />

              {/* Video Stream Protocol Badge */}
              <g transform="translate(455, 218)">
                <rect x="0" y="0" width="46" height="16" rx="4" fill="#0f172a" stroke="#d4af37" strokeWidth="1" />
                <text x="23" y="11" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold">
                  {(dock.video_outputs || dock.dock_video_outputs || ['HDMI'])[0]}
                </text>
              </g>
            </g>
          )}

          {/* Cable 3: Dock to Accessories Bus */}
          {hasDock && (hasKeyboard || hasMouse) && (
            <g className="cable-group dock-to-peripherals">
              <path
                d="M 410 340 C 410 380, 450 390, 480 390"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Real-time Status Footer Bar */}
      <div className="blueprint-status-bar">
        {isFullyConnected ? (
          <div className="status-badge success-badge">
            <span className="badge-icon">✓</span>
            <div className="badge-details">
              <strong>100% Hardware Verified Setup</strong>
              <span>
                {profile?.label} seamlessly powered by {dock?.title} ({dockWatts}W PD) driving {monitor?.title}.
              </span>
            </div>
          </div>
        ) : !hasProfile ? (
          <div className="status-badge pending-badge">
            <span className="badge-icon">1</span>
            <span>Step 1: Select your device profile on the left to verify charging & ports.</span>
          </div>
        ) : !hasDock ? (
          <div className="status-badge pending-badge">
            <span className="badge-icon">2</span>
            <span>Step 2: Choose a compatible dock providing at least {profile.required_charging_watts}W charging.</span>
          </div>
        ) : !hasMonitor ? (
          <div className="status-badge pending-badge">
            <span className="badge-icon">3</span>
            <span>Step 3: Add a monitor matching your dock's video output ports ({(dock.video_outputs || dock.dock_video_outputs || ['HDMI']).join(', ')}).</span>
          </div>
        ) : (
          <div className="status-badge warning-badge">
            <span className="badge-icon">⚠️</span>
            <span>Checking component compatibility...</span>
          </div>
        )}
      </div>
    </div>
  );
}
