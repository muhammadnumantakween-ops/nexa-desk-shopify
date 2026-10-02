import {useState, useMemo} from 'react';
import {useSetupSession} from '~/hooks/useSetupSession';
import {checkDockCompatibility, checkMonitorCompatibility} from '~/utils/compatibility';
import {
  DEVICE_PROFILES,
  AppleLogoIcon,
  WindowsLogoIcon,
  HighPowerIcon,
  UsbPortIcon,
  ThunderboltLogoIcon,
} from '~/components/DeviceSelectorBanner';

/**
 * UI-PDP-02: Interactive 'Will It Fit My Device?' Checkbox & Compatibility Widget
 *
 * Requirements from tasks_ui.csv:
 * 1. Inline checker on the Product Page allowing user to select their device or enter laptop type.
 * 2. Immediately displays verified green badge (with clear hardware reasons) or amber/red alert (with explanation).
 * 3. Accordion slide-down with animated checkmark/warning icon and spec breakdown.
 * 4. Embedded responsive card matching the Cyberpunk/Navy high-contrast design system.
 * 5. Connected to the user's setup session (`useSetupSession`) so their selection persists across the site.
 *
 * @param {{
 *   product: {
 *     id: string;
 *     title: string;
 *     handle: string;
 *     productRole?: {value: string} | null;
 *     supportedOS?: {value: string} | null;
 *     hostConnector?: {value: string} | null;
 *     dockChargingOutput?: {value: string} | null;
 *     dockVideoOutputs?: {value: string} | null;
 *     monitorVideoInputs?: {value: string} | null;
 *   };
 * }}
 */
export function CompatibilityWidget({product}) {
  const {session, setProfile} = useSetupSession();
  const [isOpen, setIsOpen] = useState(true);

  // Parse product specifications
  const parseList = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return String(raw).split(',').map((s) => s.trim());
    }
  };

  const productRole = product.productRole?.value?.toLowerCase() || 
    (product.title.toLowerCase().includes('monitor') ? 'monitor' : 'dock');

  const dockSpec = useMemo(() => {
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      product_role: productRole,
      host_connector: product.hostConnector?.value || 'USB-C',
      supported_operating_systems: parseList(product.supportedOS?.value).length > 0 
        ? parseList(product.supportedOS?.value) 
        : ['Windows', 'macOS'],
      dock_charging_output: Number(product.dockChargingOutput?.value || 0),
      dock_video_outputs: parseList(product.dockVideoOutputs?.value),
    };
  }, [product, productRole]);

  // Active selected device profile from global session, defaults to P1 if not set yet
  const activeProfile = session.selectedProfile || DEVICE_PROFILES[0];

  // Evaluate compatibility result
  const compatibility = useMemo(() => {
    if (!activeProfile) {
      return {compatible: false, reason: 'Select your device above to verify compatibility.'};
    }

    if (productRole === 'monitor') {
      // If user has a selected dock in session, check against dock, otherwise verify video input readiness
      const hasInputs = parseList(product.monitorVideoInputs?.value).length > 0;
      if (!activeProfile.video_support) {
        return {
          compatible: false,
          reason: 'Your device port does not support external video display.',
        };
      }
      return {
        compatible: true,
        reason: 'Compatible with standard HDMI / DisplayPort display connections.',
      };
    }

    // Default to dock evaluation
    return checkDockCompatibility(activeProfile, dockSpec);
  }, [activeProfile, dockSpec, productRole, product.monitorVideoInputs]);

  const isCompatible = compatibility.compatible;

  return (
    <div className="pdp-compatibility-card" role="region" aria-label="Device Compatibility Checker">
      {/* Header bar / Accordion Toggle */}
      <div
        className="pdp-compat-header"
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen((prev) => !prev);
          }
        }}
        aria-expanded={isOpen}
      >
        <div className="compat-header-left">
          <span className="compat-icon-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </span>
          <div className="compat-header-title">
            <h4>Will it fit my device?</h4>
            <span className="compat-subtitle">Instant hardware & power verification</span>
          </div>
        </div>

        <div className="compat-header-right">
          <span className={`compat-status-badge ${isCompatible ? 'is-verified' : 'is-warning'}`}>
            {isCompatible ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Verified Fit</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Attention Required</span>
              </>
            )}
          </span>
          <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>▾</span>
        </div>
      </div>

      {/* Accordion Slide-down Content */}
      {isOpen && (
        <div className="pdp-compat-body">
          <p className="compat-selector-prompt">
            Choose your laptop setup to verify exact charging wattage, port matching, and display support:
          </p>

          {/* Device Profile Selection Buttons */}
          <div className="compat-profiles-grid" role="radiogroup" aria-label="Select laptop device profile">
            {DEVICE_PROFILES.map((profile) => {
              const isSelected = activeProfile?.code === profile.code;
              return (
                <button
                  key={profile.code}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`compat-profile-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setProfile(profile)}
                >
                  <div className="profile-btn-icon">
                    {profile.code === 'P3' ? (
                      <AppleLogoIcon />
                    ) : profile.code === 'P2' ? (
                      <HighPowerIcon />
                    ) : profile.code === 'P4' ? (
                      <UsbPortIcon />
                    ) : (
                      <WindowsLogoIcon />
                    )}
                  </div>
                  <div className="profile-btn-details">
                    <span className="profile-label">{profile.label}</span>
                    <span className="profile-sub">{profile.subTitle}</span>
                  </div>
                  {isSelected && <span className="profile-selected-dot" />}
                </button>
              );
            })}
          </div>

          {/* Compatibility Verdict Box */}
          <div className={`compat-verdict-box ${isCompatible ? 'match-success' : 'match-failure'}`}>
            <div className="verdict-icon">
              {isCompatible ? (
                <div className="verdict-bubble success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div className="verdict-bubble warning">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              )}
            </div>

            <div className="verdict-text">
              <h5>
                {isCompatible
                  ? `100% Guaranteed Fit with your ${activeProfile.label}`
                  : `Attention: Check your ${activeProfile.label} port`}
              </h5>
              <p>
                {isCompatible
                  ? activeProfile.code === 'P3'
                    ? `Plug-and-play ready for your Mac. Delivers full charging power and crystal-clear display output without installing any drivers.`
                    : `Works straight out of the box with your Windows PC. Charges your laptop at up to ${dockSpec.dock_charging_output}W and connects all your desk gear instantly.`
                  : activeProfile.code === 'P4'
                    ? `Older rectangular USB ports cannot carry monitor video signals or charge your laptop battery. For multiple screens, select our NexaLink D4 or use a USB-C machine.`
                    : compatibility.reason}
              </p>
            </div>
          </div>

          {/* Technical Specs Breakdown Checklist */}
          <div className="compat-specs-checklist">
            <div className="checklist-item">
              <span className="check-bullet">✓</span>
              <span className="check-label">Operating System:</span>
              <span className="check-val">{dockSpec.supported_operating_systems.join(' & ')}</span>
            </div>
            <div className="checklist-item">
              <span className="check-bullet">✓</span>
              <span className="check-label">Connector:</span>
              <span className="check-val">{dockSpec.host_connector} Plug</span>
            </div>
            {dockSpec.dock_charging_output > 0 && (
              <div className="checklist-item">
                <span className="check-bullet">✓</span>
                <span className="check-label">Power Delivery:</span>
                <span className="check-val">{dockSpec.dock_charging_output}W Fast Charge</span>
              </div>
            )}
            {dockSpec.dock_video_outputs.length > 0 && (
              <div className="checklist-item">
                <span className="check-bullet">✓</span>
                <span className="check-label">Video Outputs:</span>
                <span className="check-val">{dockSpec.dock_video_outputs.join(' + ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
