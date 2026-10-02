import {useSearchParams, Link} from 'react-router';
import {SetupWizard} from '~/components/SetupWizard';

/**
 * Find My Setup - Interactive Setup Configurator
 * Routes to: /find-my-setup
 * Implements:
 * - UI-BUILD-01: Fluid 4-Step Animated Setup Configurator
 * - UI-BUILD-02: Live Interactive Workstation Blueprint
 * - UI-BUILD-03: Rejection Reason Explainer Modal
 * - UI-BUILD-04: Single-Click Bundle Checkout Drawer
 */
export function meta() {
  return [
    {title: 'Find My Setup & Workstation Configurator | NexaDesk UK'},
    {
      name: 'description',
      content:
        'Build your dream ergonomic desk setup in 4 interactive steps. Certified one-cable laptop power delivery, dual-monitor matching, and single-click checkout with UK next-day dispatch.',
    },
  ];
}

export default function FindMySetup() {
  const [searchParams] = useSearchParams();
  const profileParam = searchParams.get('profile');

  return (
    <div className="page-find-my-setup">
      {/* Top Breadcrumb & Trust Banner */}
      <div className="setup-hero-intro">
        <div className="setup-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Workstation Configurator</span>
        </div>

        <div className="setup-header-badge">
          <span className="sparkle-icon">✨</span>
          <span>Zero Cable Clutter • 100% Certified Hardware Compatibility</span>
        </div>

        <h1 className="setup-main-title">Configure Your Complete Desk Setup</h1>
        <p className="setup-lead-paragraph">
          Tell us which laptop or workstation you use. We calculate exact wattage charging requirements,
          filter certified video connections, and assemble your dream desk in minutes.
        </p>

        {/* UK Hub Trust Strip */}
        <div className="setup-trust-ribbon">
          <div className="ribbon-item">
            <span className="ribbon-icon">⚡</span>
            <span>Up to 100W One-Cable Laptop Charging</span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-icon">🖥️</span>
            <span>Single & Dual 4K Screen Compatibility</span>
          </div>
          <div className="ribbon-item">
            <span className="ribbon-icon">📦</span>
            <span>Free UK Delivery over £300 • 30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Main Setup Configurator Component */}
      <SetupWizard initialProfileCode={profileParam} onComplete={() => {}} />

      {/* Bottom FAQ / Help Accordion Quick Access */}
      <div className="setup-page-bottom-help">
        <div className="bottom-help-card">
          <h3>Need Help Finding Your Model?</h3>
          <p>
            Have a custom workstation or questions regarding macOS multi-display limits?
            Our UK engineering team is on hand to confirm hardware compatibility.
          </p>
          <div className="help-buttons-row">
            <Link to="/help" className="btn-secondary">
              Browse Compatibility FAQs
            </Link>
            <Link to="/compare" className="btn-outline">
              Compare All Docks Side-by-Side
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
