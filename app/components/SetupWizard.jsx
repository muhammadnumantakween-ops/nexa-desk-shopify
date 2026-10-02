import {useState, useEffect, useMemo} from 'react';
import {useSearchParams, Link} from 'react-router';
import {useSetupSession} from '~/hooks/useSetupSession';
import {
  evaluateDockCompatibility,
  evaluateMonitorCompatibility,
} from '~/utils/compatibility';
import {
  DEVICE_PROFILES,
  CATALOGUE_DOCKS,
  CATALOGUE_MONITORS,
  CATALOGUE_ACCESSORIES,
} from '~/data/setupCatalogue';
import {WorkstationBlueprint} from './WorkstationBlueprint';
import {IncompatibilityModal} from './IncompatibilityModal';
import {BundleCheckoutDrawer} from './BundleCheckoutDrawer';
import {
  AppleBrandIcon,
  WindowsBrandIcon,
  LightningPowerIcon,
  UsbPortIcon,
  MonitorDisplayIcon,
  DockHubIcon,
  CheckCircleIcon,
} from './SetupIcons';

/**
 * UI-BUILD-01: Fluid 4-Step Animated Setup Configurator
 * Multi-step full-page wizard (Profile -> Dock -> Monitor -> Accessories)
 * with zero page reloads, horizontal swipe transitions, live blueprint split-pane,
 * real-time compatibility validation, and single-click bundle checkout handoff.
 */
export function SetupWizard({initialProfileCode = null, onComplete}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {session, setProfile, setDock, setMonitor, toggleAccessory, resetSession} = useSetupSession();

  // Wizard active step (0: Device, 1: Dock, 2: Monitor, 3: Accessories, 4: Review)
  const [activeStep, setActiveStep] = useState(0);

  // Incompatibility modal state
  const [incompatibleFeedback, setIncompatibleFeedback] = useState(null);

  // Bundle checkout drawer state
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);

  // Mobile blueprint toggle
  const [isMobileBlueprintOpen, setIsMobileBlueprintOpen] = useState(false);

  // Sync initial query params (?profile=P1, ?profile=P2, etc.)
  useEffect(() => {
    const queryProfileCode = searchParams.get('profile') || initialProfileCode;
    if (queryProfileCode && !session.selectedProfile) {
      const match = DEVICE_PROFILES.find(
        (p) => p.code.toUpperCase() === queryProfileCode.toUpperCase(),
      );
      if (match) {
        setProfile(match);
        setActiveStep(1); // advance to dock
      }
    }
  }, [searchParams, initialProfileCode, session.selectedProfile, setProfile]);

  const activeProfile = useMemo(() => {
    if (!session.selectedProfile) return null;
    return (
      DEVICE_PROFILES.find((p) => p.code === session.selectedProfile.code) ||
      session.selectedProfile
    );
  }, [session.selectedProfile]);

  const activeDock = session.selectedDock;
  const activeMonitor = session.selectedMonitor;
  const activeAccessories = session.selectedAccessories || [];

  // Steps definition
  const STEPS = [
    {id: 0, title: 'Device Profile', subtitle: 'Choose your laptop', icon: '💻'},
    {id: 1, title: 'Connection Dock', subtitle: 'Power & display hub', icon: '⚡'},
    {id: 2, title: 'Monitor Display', subtitle: 'Primary workspace screen', icon: '🖥️'},
    {id: 3, title: 'Ergonomics', subtitle: 'Keyboards & stands', icon: '✨'},
    {id: 4, title: 'Review Setup', subtitle: 'Summary & bundle checkout', icon: '📦'},
  ];

  // Helper to test compatibility for a dock
  const getDockStatus = (dock) => {
    if (!activeProfile) return {status: 'not-confirmed', compatible: true, reasons: []};
    return evaluateDockCompatibility(activeProfile, dock);
  };

  // Helper to test compatibility for a monitor
  const getMonitorStatus = (monitor) => {
    if (!activeDock) return {status: 'not-confirmed', compatible: true, reasons: []};
    return evaluateMonitorCompatibility(activeDock, monitor);
  };

  // Dock Selection Handler with UI-BUILD-03 Rejection Explainer
  const handleDockClick = (dock) => {
    if (!activeProfile) {
      setActiveStep(0);
      return;
    }

    const evaluation = evaluateDockCompatibility(activeProfile, dock);

    if (!evaluation.compatible) {
      // Trigger Rejection Reason Modal
      setIncompatibleFeedback({
        title: dock.title,
        itemType: 'dock',
        reasons: evaluation.reasons,
        reason: evaluation.reason,
        profileName: activeProfile.label,
        recommendedAction:
          dock.charging_output_watts < activeProfile.required_charging_watts
            ? `Your ${activeProfile.label} requires ${activeProfile.required_charging_watts}W charging. Choose the 100W D2 Link 100 or D3 Pro 100.`
            : 'Select a compatible dock with matching host connector and operating system support.',
      });
      return;
    }

    setDock(dock);
    setActiveStep(2); // Advance to monitor
  };

  // Monitor Selection Handler with UI-BUILD-03 Rejection Explainer
  const handleMonitorClick = (monitor) => {
    if (!activeDock) {
      setActiveStep(1);
      return;
    }

    const evaluation = evaluateMonitorCompatibility(activeDock, monitor);

    if (!evaluation.compatible) {
      setIncompatibleFeedback({
        title: monitor.title,
        itemType: 'monitor',
        reasons: evaluation.reasons,
        reason: evaluation.reason,
        profileName: activeDock.title,
        recommendedAction: `Choose a display equipped with ${(activeDock.video_outputs || ['HDMI']).join(' or ')} to connect directly to ${activeDock.title}.`,
      });
      return;
    }

    setMonitor(monitor);
    setActiveStep(3); // Advance to accessories
  };

  // Profile Selection Handler
  const handleProfileClick = (profile) => {
    setProfile(profile);
    setSearchParams({profile: profile.code});
    setActiveStep(1);
  };

  // Render Step 0: Device Profile
  const renderStep0 = () => (
    <div className="wizard-step-pane" role="tabpanel" aria-label="Step 1: Select Device Profile">
      <div className="pane-header">
        <span className="pane-step-counter">Step 1 of 5</span>
        <h2 className="pane-title">What Laptop Or Computer Are You Using?</h2>
        <p className="pane-desc">
          We match the exact charging wattage, host connector, and video protocol your computer requires.
        </p>
      </div>

      <div className="device-cards-grid">
        {DEVICE_PROFILES.map((prof) => {
          const isSelected = activeProfile?.code === prof.code;
          return (
            <button
              key={prof.code}
              type="button"
              className={`setup-profile-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleProfileClick(prof)}
            >
              <div className="card-top-row">
                <div className="profile-brand-icon">
                  {prof.operating_system.includes('macOS') ? (
                    <AppleBrandIcon size={24} />
                  ) : prof.host_connector === 'USB-A' ? (
                    <UsbPortIcon size={24} />
                  ) : prof.required_charging_watts >= 100 ? (
                    <LightningPowerIcon size={24} />
                  ) : (
                    <WindowsBrandIcon size={24} />
                  )}
                </div>
                <span className="profile-code-pill">{prof.code}</span>
              </div>

              <div className="profile-text-content">
                <h3 className="profile-title">{prof.label}</h3>
                <span className="profile-sub">{prof.subTitle}</span>
                <p className="profile-description">{prof.description}</p>
              </div>

              <div className="profile-spec-badges">
                <span className="spec-chip">🔌 {prof.host_connector}</span>
                <span className="spec-chip">
                  {prof.required_charging_watts > 0
                    ? `⚡ ${prof.required_charging_watts}W Charge`
                    : '⚡ 0W Charge'}
                </span>
                <span className={`spec-chip ${prof.usb_c_video_support ? 'chip-green' : 'chip-amber'}`}>
                  {prof.usb_c_video_support ? '🖥️ Display Support' : '⚠️ No Native Video'}
                </span>
              </div>

              <div className="card-footer-action">
                {isSelected ? (
                  <span className="selected-tag">
                    <CheckCircleIcon size={16} /> Selected Profile
                  </span>
                ) : (
                  <span className="select-prompt">Select & Find Docks →</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="wizard-help-banner">
        <div className="help-icon">💡</div>
        <div className="help-text">
          <strong>Not sure which model you have?</strong> All modern Apple MacBooks (M1, M2, M3, M4) work with{' '}
          <strong>Creator 65 (P3)</strong>. Standard Dell, HP, Lenovo use <strong>Studio 65 (P1)</strong>. Or{' '}
          <Link to="/help" className="inline-help-link">
            view our port identification guide
          </Link>
          .
        </div>
      </div>
    </div>
  );

  // Render Step 1: Docks
  const renderStep1 = () => (
    <div className="wizard-step-pane" role="tabpanel" aria-label="Step 2: Choose Dock">
      <div className="pane-header">
        <span className="pane-step-counter">Step 2 of 5</span>
        <h2 className="pane-title">Choose Your One-Cable Connection Dock</h2>
        <p className="pane-desc">
          Matched to power your {activeProfile?.label || 'computer'} at full speed while driving external displays.
        </p>
      </div>

      <div className="docks-selector-grid">
        {CATALOGUE_DOCKS.map((dock) => {
          const evalResult = getDockStatus(dock);
          const isCompatible = evalResult.compatible;
          const isSelected = activeDock?.id === dock.id;

          return (
            <div
              key={dock.id}
              className={`setup-dock-card ${isSelected ? 'is-selected' : ''} ${
                !isCompatible ? 'is-incompatible' : ''
              }`}
            >
              <div className="dock-card-header">
                <span className="dock-role-badge">
                  {dock.product_role === 'hub-only' ? 'Peripheral Hub' : 'Full Dock'}
                </span>
                <span className="dock-price">£{dock.price}</span>
              </div>

              <div className="dock-title-block">
                <h3 className="dock-title">{dock.title}</h3>
                <p className="dock-desc">{dock.description}</p>
              </div>

              <div className="dock-hardware-specs">
                <div className="spec-cell">
                  <span className="spec-label">Power Delivery</span>
                  <strong className="spec-val">⚡ {dock.charging_output_watts}W</strong>
                </div>
                <div className="spec-cell">
                  <span className="spec-label">Display Outputs</span>
                  <strong className="spec-val">
                    🖥️ {dock.video_outputs.length > 0 ? dock.video_outputs.join(' & ') : 'None'}
                  </strong>
                </div>
                <div className="spec-cell">
                  <span className="spec-label">Host Connection</span>
                  <strong className="spec-val">🔌 {dock.host_connector}</strong>
                </div>
              </div>

              {/* Compatibility verdict badge */}
              <div className="dock-card-footer">
                {isCompatible ? (
                  <button
                    type="button"
                    className={`btn-select-component ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDockClick(dock)}
                  >
                    {isSelected ? '✓ Dock Configured' : 'Select This Dock →'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-incompatible-component"
                    onClick={() => handleDockClick(dock)}
                  >
                    <span>⚠️ Incompatible (Tap for details)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render Step 2: Monitors
  const renderStep2 = () => (
    <div className="wizard-step-pane" role="tabpanel" aria-label="Step 3: Select Monitor">
      <div className="pane-header">
        <span className="pane-step-counter">Step 3 of 5</span>
        <h2 className="pane-title">Add A High-Definition Computer Screen</h2>
        <p className="pane-desc">
          Filtered to displays that connect directly to your {activeDock?.title || 'dock'}'s video outputs.
        </p>
      </div>

      <div className="monitors-selector-grid">
        {CATALOGUE_MONITORS.map((monitor) => {
          const evalResult = getMonitorStatus(monitor);
          const isCompatible = evalResult.compatible;
          const isSelected = activeMonitor?.id === monitor.id;

          return (
            <div
              key={monitor.id}
              className={`setup-monitor-card ${isSelected ? 'is-selected' : ''} ${
                !isCompatible ? 'is-incompatible' : ''
              }`}
            >
              <div className="monitor-card-header">
                <span className="monitor-tag">{monitor.tag}</span>
                <span className="monitor-price">£{monitor.price}</span>
              </div>

              <div className="monitor-title-block">
                <h3 className="monitor-title">{monitor.title}</h3>
                <span className="monitor-res">{monitor.resolution}</span>
                <p className="monitor-desc">{monitor.description}</p>
              </div>

              <div className="monitor-specs-strip">
                <span className="spec-chip">Screen: {monitor.screen_size}</span>
                <span className="spec-chip">Video: {monitor.video_inputs.join(' & ')}</span>
              </div>

              <div className="monitor-card-footer">
                {isCompatible ? (
                  <button
                    type="button"
                    className={`btn-select-component ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMonitorClick(monitor)}
                  >
                    {isSelected ? '✓ Screen Configured' : 'Select This Screen →'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-incompatible-component"
                    onClick={() => handleMonitorClick(monitor)}
                  >
                    <span>⚠️ Port Mismatch (Tap to explain)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render Step 3: Optional Accessories
  const renderStep3 = () => (
    <div className="wizard-step-pane" role="tabpanel" aria-label="Step 4: Optional Ergonomic Peripherals">
      <div className="pane-header">
        <span className="pane-step-counter">Step 4 of 5 (Optional)</span>
        <h2 className="pane-title">Ergonomic Peripherals & Desk Accessories</h2>
        <p className="pane-desc">
          Universal plug-and-play accessories designed to eliminate neck strain and wrist soreness.
        </p>
      </div>

      <div className="accessories-selector-grid">
        {CATALOGUE_ACCESSORIES.map((acc) => {
          const isSelected = activeAccessories.some((a) => a.id === acc.id);

          return (
            <div
              key={acc.id}
              className={`accessory-card ${isSelected ? 'is-added' : ''}`}
            >
              <div className="acc-card-header">
                <span className="acc-category">{acc.category}</span>
                <span className="acc-price">£{acc.price}</span>
              </div>

              <h3 className="acc-title">{acc.title}</h3>
              <p className="acc-desc">{acc.description}</p>

              <button
                type="button"
                className={`btn-toggle-accessory ${isSelected ? 'is-active' : ''}`}
                onClick={() => toggleAccessory(acc)}
              >
                {isSelected ? '✓ Added to Setup' : '+ Add to Setup'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="step-footer-cta-row">
        <button
          type="button"
          className="btn-primary btn-large-proceed"
          onClick={() => setActiveStep(4)}
        >
          Proceed to Setup Review →
        </button>
      </div>
    </div>
  );

  // Render Step 4: Review and Summary
  const renderStep4 = () => {
    const dockPrice = parseFloat(activeDock?.price || '0');
    const monitorPrice = parseFloat(activeMonitor?.price || '0');
    const accessoriesPrice = activeAccessories.reduce(
      (sum, item) => sum + parseFloat(item.price || '0'),
      0,
    );
    const subtotal = dockPrice + monitorPrice + accessoriesPrice;
    const qualifiesForDesk10 = subtotal >= 200;
    const desk10Savings = qualifiesForDesk10 ? subtotal * 0.1 : 0;
    const postDiscount = subtotal - desk10Savings;
    const qualifiesForFreeShipping = postDiscount >= 300;

    return (
      <div className="wizard-step-pane" role="tabpanel" aria-label="Step 5: Review & Checkout Setup">
        <div className="pane-header">
          <span className="pane-step-counter">Final Step</span>
          <h2 className="pane-title">Review Your Complete Desk Workstation</h2>
          <p className="pane-desc">
            All components are tested, verified for compatibility, and packaged with next-day UK dispatch.
          </p>
        </div>

        <div className="review-setup-grid">
          {/* Component Summary Cards */}
          <div className="setup-summary-breakdown">
            {/* 1. Device */}
            <div className="summary-block">
              <div className="summary-block-header">
                <span className="block-label">Computer / Host</span>
                <button
                  type="button"
                  className="btn-change-link"
                  onClick={() => setActiveStep(0)}
                >
                  Change
                </button>
              </div>
              <div className="summary-block-content">
                <strong>{activeProfile?.label || 'No laptop selected'}</strong>
                <span>
                  {activeProfile?.host_connector} • {activeProfile?.required_charging_watts}W Required
                </span>
              </div>
            </div>

            {/* 2. Dock */}
            <div className="summary-block">
              <div className="summary-block-header">
                <span className="block-label">Power & Connection Hub</span>
                <button
                  type="button"
                  className="btn-change-link"
                  onClick={() => setActiveStep(1)}
                >
                  Change
                </button>
              </div>
              <div className="summary-block-content">
                <strong>{activeDock?.title || 'No dock selected'}</strong>
                <span>
                  ⚡ {activeDock?.charging_output_watts || activeDock?.dock_charging_output}W Power Delivery • £{activeDock?.price}
                </span>
              </div>
            </div>

            {/* 3. Monitor */}
            <div className="summary-block">
              <div className="summary-block-header">
                <span className="block-label">Display Screen</span>
                <button
                  type="button"
                  className="btn-change-link"
                  onClick={() => setActiveStep(2)}
                >
                  Change
                </button>
              </div>
              <div className="summary-block-content">
                <strong>{activeMonitor?.title || 'No screen selected'}</strong>
                <span>
                  🖥️ {activeMonitor?.resolution} • £{activeMonitor?.price}
                </span>
              </div>
            </div>

            {/* 4. Accessories */}
            {activeAccessories.length > 0 && (
              <div className="summary-block">
                <div className="summary-block-header">
                  <span className="block-label">Ergonomic Peripherals ({activeAccessories.length})</span>
                  <button
                    type="button"
                    className="btn-change-link"
                    onClick={() => setActiveStep(3)}
                  >
                    Edit
                  </button>
                </div>
                <ul className="summary-acc-list">
                  {activeAccessories.map((a) => (
                    <li key={a.id}>
                      <span>{a.title}</span>
                      <strong>£{a.price}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pricing & Checkout Column */}
          <div className="setup-pricing-card">
            <h3 className="pricing-title">Bundle Investment</h3>

            <div className="pricing-line">
              <span>Hardware Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>

            {qualifiesForDesk10 ? (
              <div className="pricing-line discount">
                <span>🏷️ DESK10 (10% Off)</span>
                <span>-£{desk10Savings.toFixed(2)}</span>
              </div>
            ) : (
              <div className="pricing-line promo">
                <span>Spend £200+ for DESK10 (10% off)</span>
              </div>
            )}

            <div className="pricing-line">
              <span>Tracked UK Shipping</span>
              <span>{qualifiesForFreeShipping ? 'FREE' : '£7.95'}</span>
            </div>

            <div className="pricing-divider" />

            <div className="pricing-total-row">
              <span>Total Setup</span>
              <span className="total-gold">
                £{(qualifiesForFreeShipping ? postDiscount : postDiscount + 7.95).toFixed(2)}
              </span>
            </div>

            {qualifiesForFreeShipping && (
              <div className="free-shipping-pill">
                ✨ Free UK Hub Shipping Unlocked (≥ £300)
              </div>
            )}

            {/* Single-Click Checkout Trigger (UI-BUILD-04) */}
            <button
              type="button"
              className="btn-primary btn-checkout-bundle-cta"
              onClick={() => setIsCheckoutDrawerOpen(true)}
              disabled={!activeDock || !activeMonitor}
            >
              <span>⚡ Open Bundle Checkout Drawer</span>
            </button>

            <button
              type="button"
              className="btn-reset-wizard"
              onClick={resetSession}
            >
              Reset Setup & Start Over
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nexa-setup-wizard-root">
      {/* Interactive Step Navigator / Horizontal Breadcrumb */}
      <nav className="wizard-stepper-navigation" aria-label="Setup Wizard Steps">
        <div className="stepper-track-line" />
        {STEPS.map((step) => {
          const isDone = step.id < activeStep;
          const isCurrent = step.id === activeStep;

          return (
            <button
              key={step.id}
              type="button"
              className={`stepper-node ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="stepper-icon-circle">
                {isDone ? <CheckCircleIcon size={16} /> : step.id + 1}
              </div>
              <div className="stepper-labels">
                <span className="step-name">{step.title}</span>
                <span className="step-sub">{step.subtitle}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Main Split-Pane Workspace: Left Configurator / Right Live CAD Blueprint */}
      <div className="wizard-split-layout">
        {/* Left Side: Wizard Content Step Panels with Horizontal Transitions */}
        <div className="wizard-config-pane">
          <div className="step-content-animator">
            {activeStep === 0 && renderStep0()}
            {activeStep === 1 && renderStep1()}
            {activeStep === 2 && renderStep2()}
            {activeStep === 3 && renderStep3()}
            {activeStep === 4 && renderStep4()}
          </div>

          {/* Wizard Step Controls (Back / Next) */}
          <div className="wizard-sticky-controls">
            <button
              type="button"
              className="btn-secondary btn-nav-back"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            >
              ← Back
            </button>

            {/* Mobile Blueprint Toggle Trigger */}
            <button
              type="button"
              className="btn-toggle-mobile-blueprint"
              onClick={() => setIsMobileBlueprintOpen(!isMobileBlueprintOpen)}
            >
              📐 {isMobileBlueprintOpen ? 'Hide Blueprint' : 'View Blueprint'}
            </button>

            {activeStep < 4 ? (
              <button
                type="button"
                className="btn-primary btn-nav-next"
                disabled={
                  (activeStep === 0 && !activeProfile) ||
                  (activeStep === 1 && !activeDock) ||
                  (activeStep === 2 && !activeMonitor)
                }
                onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary btn-nav-checkout"
                onClick={() => setIsCheckoutDrawerOpen(true)}
              >
                Checkout Setup ⚡
              </button>
            )}
          </div>
        </div>

        {/* Right Side (Desktop) / Collapsible Drawer (Mobile): Live Workstation Blueprint */}
        <aside
          className={`wizard-blueprint-pane ${isMobileBlueprintOpen ? 'mobile-drawer-open' : ''}`}
          aria-label="Workstation Schematic Visualizer"
        >
          <div className="blueprint-sticky-container">
            <WorkstationBlueprint
              profile={activeProfile}
              dock={activeDock}
              monitor={activeMonitor}
              accessories={activeAccessories}
            />
          </div>
        </aside>
      </div>

      {/* UI-BUILD-03: Rejection Reason Explainer Modal */}
      {incompatibleFeedback && (
        <IncompatibilityModal
          item={incompatibleFeedback}
          onClose={() => setIncompatibleFeedback(null)}
          onSwitchDevice={() => {
            setIncompatibleFeedback(null);
            setActiveStep(0);
          }}
          onSelectRecommended={() => {
            // Find recommended 100W dock D2 Link 100
            const recommendedDock = CATALOGUE_DOCKS.find((d) => d.charging_output_watts === 100);
            if (recommendedDock) {
              setDock(recommendedDock);
              setActiveStep(2);
            }
          }}
        />
      )}

      {/* UI-BUILD-04: Single-Click Bundle Checkout Drawer */}
      <BundleCheckoutDrawer
        isOpen={isCheckoutDrawerOpen}
        bundle={{
          profile: activeProfile,
          dock: activeDock,
          monitor: activeMonitor,
          accessories: activeAccessories,
        }}
        onClose={() => setIsCheckoutDrawerOpen(false)}
      />
    </div>
  );
}
