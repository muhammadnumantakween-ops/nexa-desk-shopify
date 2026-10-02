import {useState, useEffect, useMemo} from 'react';
import {Link} from 'react-router';
import {useSetupSession} from '~/hooks/useSetupSession';
import {checkDockCompatibility} from '~/utils/compatibility';

/**
 * UI-HOME-02: Interactive Device Selector Banner (Compatibility Teaser)
 *
 * Core Requirements:
 * 1. Quick interactive device selector for Studio 65, Studio 100, Mac, and USB-A.
 * 2. Instant live match counter with animated count increment and glowing badges.
 * 3. Shows exactly how many verified docks and displays match the active profile.
 * 4. Selection change triggers layout morphing and smooth counter increment.
 * 5. Horizontal scrollable chips on mobile (<768px).
 * 6. Written in friendly, plain English for non-technical shoppers.
 */

// Scalable clean brand & hardware SVGs
export function AppleLogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 170 170" fill="currentColor" aria-hidden="true" style={{display: 'inline-block'}}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

export function WindowsLogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display: 'inline-block'}}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  );
}

export function AndroidLogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display: 'inline-block'}}>
      <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9996.4482.9996.9993.0001.5511-.4485.9997-.9996.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9997.4482.9997.9993 0 .5511-.4486.9997-.9997.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5802 8.4144 13.8563 8 12 8s-3.5802.4144-5.1368.9507L4.8409 5.4477a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
    </svg>
  );
}

export function ThunderboltLogoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{display: 'inline-block'}}>
      <path d="M13.5 2L3 13.5h7.5L9 22l12-13.5h-7.5L15 2h-1.5z" />
    </svg>
  );
}

export function LaptopStandardIcon() {
  return <WindowsLogoIcon />;
}

export function HighPowerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function UsbPortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v10M12 12l4-4M12 12L8 8" />
      <rect x="7" y="14" width="10" height="8" rx="1" />
    </svg>
  );
}

export const DEVICE_PROFILES = [
  {
    code: 'P1',
    label: 'Windows & PC',
    subTitle: 'Dell, Lenovo, HP, Surface',
    operating_system: 'Windows',
    host_connector: 'USB-C',
    video_support: true,
    required_charging_power: 65,
    renderIcon: () => <WindowsLogoIcon />,
    tag: 'Dell / Lenovo / HP',
    description: 'Everyday Windows laptops with an oval USB-C plug. Full 65W charging and multi-monitor support.',
  },
  {
    code: 'P2',
    label: 'High-Power Workstation',
    subTitle: 'Gaming or Heavy Creative PC',
    operating_system: 'Windows',
    host_connector: 'USB-C',
    video_support: true,
    required_charging_power: 100,
    renderIcon: () => <HighPowerIcon />,
    tag: '100W Max Power',
    description: 'Performance laptops requiring fast 100W power delivery to stay charged under heavy rendering load.',
  },
  {
    code: 'P3',
    label: 'Apple MacBook',
    subTitle: 'Air, Pro, Mac mini, iMac (M1/M2/M3/M4)',
    operating_system: 'macOS',
    host_connector: 'USB-C',
    video_support: true,
    required_charging_power: 65,
    renderIcon: () => <AppleLogoIcon />,
    tag: 'Apple Official',
    description: 'Apple Silicon or Intel Mac with Thunderbolt / USB-C ports. Fast one-cable charging and display.',
  },
  {
    code: 'P4',
    label: 'Older USB-A Laptop',
    subTitle: 'Only has classic rectangular USB',
    operating_system: 'Windows',
    host_connector: 'USB-A',
    video_support: false,
    required_charging_power: 0,
    renderIcon: () => <UsbPortIcon />,
    tag: 'Classic USB',
    description: 'Older machines with traditional rectangular USB ports. Connects data and peripherals.',
  },
];

// Catalogue of available docks for live matching
export const CATALOGUE_DOCKS = [
  {
    id: 'link-65',
    title: 'NexaLink 65 Standard Dock',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 65,
    dock_video_outputs: ['HDMI'],
    price: '119.00',
  },
  {
    id: 'link-100',
    title: 'NexaLink 100 Dual-Screen Dock',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 100,
    dock_video_outputs: ['HDMI', 'DisplayPort'],
    price: '169.00',
  },
  {
    id: 'pro-100',
    title: 'NexaLink Pro 100 High-Speed Dock',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 100,
    dock_video_outputs: ['HDMI', 'DisplayPort'],
    price: '219.00',
  },
  {
    id: 'connect-a',
    title: 'NexaConnect A Accessory Hub',
    host_connector: 'USB-A',
    supported_operating_systems: ['Windows'],
    dock_charging_output: 0,
    dock_video_outputs: [],
    price: '49.00',
  },
];

export function DeviceSelectorBanner() {
  const {session, setProfile} = useSetupSession();
  const [selectedCode, setSelectedCode] = useState(session.selectedProfile?.code || 'P3');
  const [displayCount, setDisplayCount] = useState(0);

  const activeProfile = useMemo(() => {
    return DEVICE_PROFILES.find((p) => p.code === selectedCode) || DEVICE_PROFILES[2];
  }, [selectedCode]);

  // Compute live matching docks
  const compatibleDocks = useMemo(() => {
    return CATALOGUE_DOCKS.filter((dock) => {
      const result = checkDockCompatibility(activeProfile, dock);
      return result.compatible;
    });
  }, [activeProfile]);

  const targetCount = compatibleDocks.length;

  // Smooth counter increment animation
  useEffect(() => {
    let start = 0;
    const duration = 300;
    const startTime = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.round(progress * targetCount);
      setDisplayCount(current);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [targetCount, selectedCode]);

  const handleSelectProfile = (profile) => {
    setSelectedCode(profile.code);
    setProfile(profile);
  };

  return (
    <section className="device-selector-banner-section" aria-label="Interactive Device Compatibility Checker">
      <div className="selector-container">
        {/* Banner Header */}
        <div className="selector-header">
          <div className="selector-badge-pill">
            <span className="live-sparkle-dot" aria-hidden="true" />
            <span className="selector-badge-text">Instant Compatibility Checker</span>
          </div>

          <h2 className="selector-title">
            What kind of laptop do you have?
          </h2>

          <p className="selector-subtitle">
            Click your computer below. We check the charger, screen cables, and plugs for you so you never buy the wrong adapter.
          </p>
        </div>

        {/* Horizontal Chips / Device Selector Row */}
        <div className="device-chips-scrollable" role="tablist" aria-label="Select laptop device profile">
          {DEVICE_PROFILES.map((profile) => {
            const isSelected = profile.code === selectedCode;
            return (
              <button
                key={profile.code}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`device-profile-chip ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelectProfile(profile)}
              >
                <div className="chip-top-row">
                  <span className="chip-icon-brand" aria-hidden="true">
                    {profile.renderIcon()}
                  </span>
                  <span className={`chip-tag ${profile.code}`}>{profile.tag}</span>
                </div>

                <div className="chip-text-group">
                  <strong className="chip-label">{profile.label}</strong>
                  <span className="chip-sub">{profile.subTitle}</span>
                </div>

                {isSelected ? (
                  <div className="chip-active-indicator" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Selected</span>
                  </div>
                ) : (
                  <div className="chip-idle-indicator" aria-hidden="true">
                    <span>Click to check</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Compatibility Status & Results Morphing Card */}
        <div className={`compatibility-result-card ${targetCount > 0 ? 'is-compatible' : 'is-warning'}`}>
          <div className="result-card-inner">
            {/* Left: Counter & Status in plain human words */}
            <div className="result-status-block">
              <div className="counter-circle-wrapper">
                <div className={`counter-circle ${targetCount > 0 ? 'green-glow' : 'amber-glow'}`}>
                  <span className="counter-number">{displayCount}</span>
                </div>
                <div className="counter-label-group">
                  <strong className="counter-title">
                    {targetCount === 1
                      ? '1 Perfect Match Ready'
                      : targetCount > 1
                      ? `${targetCount} Guaranteed Matches`
                      : 'Needs an Adapter'}
                  </strong>
                  <span className="counter-desc">
                    {targetCount > 0
                      ? `Everything listed here will charge and connect your ${activeProfile.label} with just one cord.`
                      : `Standard rectangular USB ports cannot send video to external screens.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Clear Spec Summary in Everyday Terms */}
            <div className="result-specs-block">
              <div className="spec-chip">
                <span className="spec-chip-label">Your Laptop Plug:</span>
                <strong className="spec-chip-value">
                  {activeProfile.host_connector === 'USB-C' ? 'Oval USB-C / Thunderbolt' : 'Old Rectangular USB'}
                </strong>
              </div>
              <div className="spec-chip">
                <span className="spec-chip-label">Battery Charging:</span>
                <strong className="spec-chip-value">
                  {activeProfile.required_charging_power >= 100
                    ? 'Super-Fast 100W Charging'
                    : activeProfile.required_charging_power > 0
                    ? 'Fast Everyday Charging'
                    : 'Use Your Normal Laptop Charger'}
                </strong>
              </div>
              <div className="spec-chip">
                <span className="spec-chip-label">External Screens:</span>
                <strong className={`spec-chip-value ${activeProfile.video_support ? 'text-green' : 'text-amber'}`}>
                  {activeProfile.video_support ? 'Runs 1 or 2 Big Screens' : 'Accessories Only (No Screens)'}
                </strong>
              </div>
            </div>

            {/* Right: Direct Action CTA */}
            <div className="result-action-block">
              {targetCount > 0 ? (
                <Link
                  to={`/find-my-setup?profile=${activeProfile.code}`}
                  className="result-cta-btn"
                >
                  <span>Build My Complete Setup</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              ) : (
                <Link
                  to="/pages/compatibility-faq"
                  className="result-cta-btn secondary"
                >
                  <span>Read How To Connect Older Laptops</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Quick List of Matching Docks Preview */}
          {targetCount > 0 && (
            <div className="matching-docks-preview">
              <span className="preview-label">Docks tested and ready to dispatch:</span>
              <div className="preview-pills-row">
                {compatibleDocks.map((dock) => (
                  <Link
                    key={dock.id}
                    to="/find-my-setup"
                    className="dock-preview-pill"
                  >
                    <span className="pill-dot" />
                    <span className="pill-title">{dock.title}</span>
                    <span className="pill-price">£{dock.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
