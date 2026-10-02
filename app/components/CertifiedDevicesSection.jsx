import {useState} from 'react';

/**
 * Module C: 'Tested & Certified Devices' (Social Proof by Laptop Model)
 *
 * Filter pills by laptop brand (Apple MacBook, Dell XPS, Lenovo ThinkPad, Microsoft Surface)
 * with verified lab bench test results:
 * - Verified charging power
 * - Verified external screen counts
 * - Plug-and-play sleep/wake performance
 *
 * @param {{
 *   dockProduct: any;
 * }}
 */
export function CertifiedDevicesSection({dockProduct}) {
  const [selectedBrand, setSelectedBrand] = useState('Apple');

  const wattage = Number(dockProduct?.dockChargingOutput?.value || 65);
  const title = dockProduct?.title || 'Nexa Dock';

  const DEVICE_BENCHMARKS = [
    {
      brand: 'Apple',
      model: 'MacBook Pro 14" & 16" (M1 / M2 / M3 / M4 Pro/Max)',
      status: 'Verified Optimal',
      chargingNote: wattage >= 100 ? '⚡ Full 100W Fast Charge - Keeps battery topped under 100% CPU/GPU render loads' : '⚡ 65W Steady Workstation Power - Charges fully during typical productivity',
      displayNote: title.includes('D1') ? '🖥️ Single 4K@60Hz native display via HDMI' : '🖥️ Dual 4K@60Hz extended desktop without screen mirroring limits',
      sleepWake: '0ms instant wake from clamshell or lid-open',
      testedWith: 'macOS Sequoia & Sonoma 14.x',
    },
    {
      brand: 'Apple',
      model: 'MacBook Air 13" & 15" (M1 / M2 / M3)',
      status: 'Verified Optimal',
      chargingNote: '⚡ Rapid 65W/100W Charging - Exceeds factory 30W Apple charger speed by 2x',
      displayNote: '🖥️ 4K Ultra HD crisp retina scaling',
      sleepWake: '100% silent sleep/wake cycling',
      testedWith: 'macOS Sequoia 15.0',
    },
    {
      brand: 'Dell',
      model: 'Dell XPS 13, 15 & 17 (9300, 9520, 9720)',
      status: 'Verified Optimal',
      chargingNote: '⚡ Certified USB-PD compliance - No "Slow Charger" BIOS warnings',
      displayNote: '🖥️ High Refresh & 4K@60Hz verified with zero frame dropping',
      sleepWake: 'Verified instant resume from S3/Modern Standby',
      testedWith: 'Windows 11 Pro 23H2',
    },
    {
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon & T14 Gen 4',
      status: 'Verified Optimal',
      chargingNote: '⚡ Sustained Rapid Charge support over USB-C',
      displayNote: '🖥️ Dual external monitors supported natively via MST',
      sleepWake: 'Lenovo Commercial Vantage sleep certified',
      testedWith: 'Windows 11 Pro & Ubuntu 24.04 LTS',
    },
    {
      brand: 'Microsoft',
      model: 'Surface Laptop 5, 6 & Surface Pro 9/10',
      status: 'Verified Optimal',
      chargingNote: '⚡ High speed USB-C PD replaces proprietary Surface Connect',
      displayNote: '🖥️ Crisp PixelSense 3:2 and 16:9 monitor pairing',
      sleepWake: 'Verified InstantGo sleep/wake cycles',
      testedWith: 'Windows 11 Home & Pro',
    },
  ];

  const filteredDevices = DEVICE_BENCHMARKS.filter((d) => d.brand === selectedBrand);

  return (
    <section className="pdp-certified-devices-section" aria-labelledby="certified-devices-heading">
      <div className="certified-header">
        <span className="certified-badge">Hardware Test-Bench Lab</span>
        <h2 id="certified-devices-heading" className="certified-title">
          Tested & Certified Laptop Pairings
        </h2>
        <p className="certified-subtitle">
          Every Nexa product undergoes rigorous 72-hour continuous thermal and data-integrity testing with the UK's most popular laptops.
        </p>

        {/* Brand Selector Filter */}
        <div className="brand-filter-pills" role="tablist">
          {['Apple', 'Dell', 'Lenovo', 'Microsoft'].map((brand) => (
            <button
              key={brand}
              type="button"
              role="tab"
              aria-selected={selectedBrand === brand}
              className={`brand-pill-btn ${selectedBrand === brand ? 'active' : ''}`}
              onClick={() => setSelectedBrand(brand)}
            >
              {brand === 'Apple' && '🍎 Apple Mac'}
              {brand === 'Dell' && '💻 Dell XPS'}
              {brand === 'Lenovo' && '💼 Lenovo ThinkPad'}
              {brand === 'Microsoft' && '🪟 Microsoft Surface'}
            </button>
          ))}
        </div>
      </div>

      <div className="certified-cards-list">
        {filteredDevices.map((device, idx) => (
          <div key={idx} className="device-cert-card">
            <div className="cert-card-top">
              <div className="cert-model-info">
                <span className="cert-brand-tag">{device.brand} Ecosystem</span>
                <h3 className="cert-model-title">{device.model}</h3>
              </div>
              <div className="cert-status-badge">
                <span className="cert-dot" aria-hidden="true" />
                {device.status}
              </div>
            </div>

            <div className="cert-metrics-grid">
              <div className="cert-metric-box">
                <span className="metric-label">Power & Charging</span>
                <p className="metric-value">{device.chargingNote}</p>
              </div>

              <div className="cert-metric-box">
                <span className="metric-label">Display Output</span>
                <p className="metric-value">{device.displayNote}</p>
              </div>

              <div className="cert-metric-box">
                <span className="metric-label">Sleep / Wake Stability</span>
                <p className="metric-value">{device.sleepWake}</p>
              </div>

              <div className="cert-metric-box">
                <span className="metric-label">Verified OS</span>
                <p className="metric-value">{device.testedWith}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lab-guarantee-strip">
        <span className="lab-icon">🛡️</span>
        <div className="lab-text">
          <strong>Nexa 30-Day Zero-Friction Compatibility Guarantee</strong>
          <span>If this dock does not flawlessly charge and drive your laptop, return it within 30 days for a 100% refund with free prepaid UK return shipping.</span>
        </div>
      </div>
    </section>
  );
}
