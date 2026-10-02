import {useState} from 'react';

/**
 * Module E: Collapsible Technical Specifications & Downloads Accordion
 *
 * Detailed spec breakdowns:
 * - Dimensions, Materials & Thermal Design
 * - Chipsets & USB Power Delivery Standards
 * - Display Protocols & Resolutions
 * - Downloads (Quick Start Manual PDF, Port Wiring Map)
 *
 * @param {{
 *   product: any;
 * }}
 */
export function TechSpecsAccordion({product}) {
  const [openSections, setOpenSections] = useState({
    dimensions: true,
    chipsets: false,
    display: false,
    warranty: false,
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({...prev, [sec]: !prev[sec]}));
  };

  const isDock = product.title?.toLowerCase().includes('dock') || product.title?.toLowerCase().includes('link') || product.handle?.startsWith('d');
  const wattage = product.dockChargingOutput?.value || '65W';

  return (
    <section className="pdp-tech-specs-section" aria-labelledby="tech-specs-heading">
      <div className="specs-header">
        <span className="specs-badge">Engineering Deep-Dive</span>
        <h2 id="tech-specs-heading" className="specs-title">
          Detailed Technical Specifications
        </h2>
        <p className="specs-subtitle">
          Full architectural breakdown for IT professionals, pro audio engineers, and power users.
        </p>
      </div>

      <div className="specs-accordion-container">
        {/* Accordion 1: Physical, Materials & Thermal */}
        <div className={`spec-accordion-item ${openSections.dimensions ? 'is-open' : ''}`}>
          <button
            type="button"
            className="spec-accordion-btn"
            onClick={() => toggleSection('dimensions')}
            aria-expanded={openSections.dimensions}
          >
            <div className="accordion-btn-left">
              <span className="accordion-icon">📐</span>
              <strong>Dimensions, Weight & Thermal Architecture</strong>
            </div>
            <span className="accordion-chevron">{openSections.dimensions ? '−' : '+'}</span>
          </button>
          {openSections.dimensions && (
            <div className="spec-accordion-body">
              <div className="specs-dl-grid">
                <div className="dl-item">
                  <span className="dt">Enclosure Material</span>
                  <span className="dd">CNC Anodised Aerospace Aluminium (Space Grey)</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Dimensions</span>
                  <span className="dd">198mm (W) x 74mm (D) x 24mm (H)</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Unit Weight</span>
                  <span className="dd">380g (Solid desktop anti-slip footing)</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Acoustics & Thermals</span>
                  <span className="dd">0dB Silent Fanless Passive Heatsink Chassis</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Operating Temp</span>
                  <span className="dd">0°C to 40°C (Continuous duty cycle)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Chipsets & Power Delivery */}
        <div className={`spec-accordion-item ${openSections.chipsets ? 'is-open' : ''}`}>
          <button
            type="button"
            className="spec-accordion-btn"
            onClick={() => toggleSection('chipsets')}
            aria-expanded={openSections.chipsets}
          >
            <div className="accordion-btn-left">
              <span className="accordion-icon">⚡</span>
              <strong>Chipsets & USB Power Delivery Protocols</strong>
            </div>
            <span className="accordion-chevron">{openSections.chipsets ? '−' : '+'}</span>
          </button>
          {openSections.chipsets && (
            <div className="spec-accordion-body">
              <div className="specs-dl-grid">
                <div className="dl-item">
                  <span className="dt">Hub Controller</span>
                  <span className="dd">Realtek RTS5423 USB 3.2 Gen 2 (10Gbps SuperSpeed+)</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Power Delivery Standard</span>
                  <span className="dd">USB-PD 3.0 with Programmable Power Supply (PPS)</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Laptop Charging Output</span>
                  <span className="dd">{wattage} continuous sustained wattage</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Over-Voltage Protection</span>
                  <span className="dd">Built-in OCP, OVP, and OTP thermal surge suppression</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Host Port Bandwidth</span>
                  <span className="dd">Up to 10Gbps upstream data + DP Alt Mode video</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Display & Resolutions */}
        <div className={`spec-accordion-item ${openSections.display ? 'is-open' : ''}`}>
          <button
            type="button"
            className="spec-accordion-btn"
            onClick={() => toggleSection('display')}
            aria-expanded={openSections.display}
          >
            <div className="accordion-btn-left">
              <span className="accordion-icon">🖥️</span>
              <strong>Display Resolutions & Multi-Monitor Support</strong>
            </div>
            <span className="accordion-chevron">{openSections.display ? '−' : '+'}</span>
          </button>
          {openSections.display && (
            <div className="spec-accordion-body">
              <div className="specs-dl-grid">
                <div className="dl-item">
                  <span className="dt">Single Monitor Output</span>
                  <span className="dd">Up to 4K (3840 x 2160) @ 60Hz or 1440p @ 144Hz</span>
                </div>
                <div className="dl-item">
                  <span className="dt">HDCP Compliance</span>
                  <span className="dd">HDCP 2.3 & 1.4 for 4K Netflix/Apple TV protected streaming</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Color Gamut Support</span>
                  <span className="dd">10-bit Deep Color, HDR10, Rec. 709 & DCI-P3</span>
                </div>
                <div className="dl-item">
                  <span className="dt">macOS Multi-Monitor</span>
                  <span className="dd">Plug-and-play mirroring or extended desktop display</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: Warranty, Downloads & Support */}
        <div className={`spec-accordion-item ${openSections.warranty ? 'is-open' : ''}`}>
          <button
            type="button"
            className="spec-accordion-btn"
            onClick={() => toggleSection('warranty')}
            aria-expanded={openSections.warranty}
          >
            <div className="accordion-btn-left">
              <span className="accordion-icon">📄</span>
              <strong>Warranty, Compliance & Manual Downloads</strong>
            </div>
            <span className="accordion-chevron">{openSections.warranty ? '−' : '+'}</span>
          </button>
          {openSections.warranty && (
            <div className="spec-accordion-body">
              <div className="specs-dl-grid">
                <div className="dl-item">
                  <span className="dt">UK Warranty</span>
                  <span className="dd">24-Month Comprehensive Hardware Replacement</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Compliance & Safety</span>
                  <span className="dd">UKCA, CE, FCC, RoHS, WEEE Certified</span>
                </div>
                <div className="dl-item">
                  <span className="dt">Technical Downloads</span>
                  <span className="dd">
                    <span className="spec-download-link">📥 Quick Start Guide (PDF, 1.4MB)</span>
                    <span className="spec-download-link">📥 Port Wiring & Pinout Schematic (PDF, 850KB)</span>
                  </span>
                </div>
                <div className="dl-item">
                  <span className="dt">Direct Support</span>
                  <span className="dd">London-based technical assistance via email & live chat</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
