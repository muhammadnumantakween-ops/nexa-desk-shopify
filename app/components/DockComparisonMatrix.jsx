import {useState} from 'react';
import {Link} from 'react-router';

/**
 * Module B: Inline 'Which Nexa Model Fits You?' Comparison Matrix
 *
 * Compares D1 vs D2 vs D3 vs D4 with clear differentiation:
 * - Current product column highlighted with glowing accent border
 * - Highlights charging power, max external screens, host interface, audio, and price
 * - Quick switch links directly to other models
 *
 * @param {{
 *   currentHandle: string;
 *   allProducts: any[];
 * }}
 */
export function DockComparisonMatrix({currentHandle, allProducts = []}) {
  const [viewMode, setViewMode] = useState('docks'); // 'docks' or 'monitors'

  // Model comparison specs
  const DOCK_MODELS = [
    {
      handle: 'd1-link-65',
      name: 'D1 Link 65',
      badge: 'Essential Pro',
      charging: '65W GaN',
      screens: '1x Screen (4K@60Hz)',
      videoPorts: '1x HDMI 2.1',
      usbPorts: '4x USB Ports (10Gbps)',
      ethernet: '1Gbps RJ45',
      bestFor: 'MacBook Air, Thin & Light Ultrabooks, Home Office',
      price: '£99.00',
    },
    {
      handle: 'd2-power-100',
      name: 'D2 Power 100',
      badge: 'Dual Screen Champion',
      charging: '100W GaN Pass-Through',
      screens: '2x Dual 4K@60Hz',
      videoPorts: '1x HDMI 2.1 + 1x DP 1.4',
      usbPorts: '5x USB (10Gbps + USB-C PD)',
      ethernet: '1Gbps RJ45 Gigabit',
      bestFor: 'MacBook Pro 14"/16", Dell XPS, Multi-Tasking Creators',
      price: '£149.00',
    },
    {
      handle: 'd3-pro-max',
      name: 'D3 Pro Max',
      badge: 'Triple 4K Powerhouse',
      charging: '100W Dedicated Host',
      screens: '3x Screens (Triple 4K)',
      videoPorts: '2x HDMI 2.1 + 1x DP 1.4',
      usbPorts: '6x High-Speed I/O + SD Card 4.0',
      ethernet: '2.5Gbps Ultra-Fast LAN',
      bestFor: 'Heavy Workstations, Financial Trading, 3D/VFX Studios',
      price: '£199.00',
    },
    {
      handle: 'd4-connect-a',
      name: 'D4 Connect A',
      badge: 'Legacy Champion',
      charging: 'Data-Only (Bus-Powered)',
      screens: 'No Video (Peripheral Hub)',
      videoPorts: 'None',
      usbPorts: '4x USB-A 3.0 (5Gbps)',
      ethernet: 'Optional Dongle',
      bestFor: 'Older Desktops, USB-A Laptops, Peripheral Expansion',
      price: '£39.00',
    },
  ];

  const MONITOR_MODELS = [
    {
      handle: 'm1-studio-27',
      name: 'M1 Studio 27',
      size: '27" 4K IPS',
      refresh: '60Hz Pro Color',
      inputs: 'HDMI 2.1, DisplayPort 1.4, USB-C',
      idealDock: 'D1 or D2',
      bestFor: 'Graphic Designers, Photographers, General Office',
      price: '£329.00',
    },
    {
      handle: 'm2-view-32',
      name: 'M2 View 32',
      size: '32" 4K HDR',
      refresh: '60Hz High Contrast',
      inputs: '2x HDMI 2.1, 1x DP 1.4',
      idealDock: 'D2 or D3',
      bestFor: 'Video Editors, Coders, Large Canvas Multi-Window',
      price: '£429.00',
    },
    {
      handle: 'm3-dual-curved',
      name: 'M3 Curved 34',
      size: '34" Ultrawide WQHD',
      refresh: '100Hz Smooth Motion',
      inputs: 'HDMI 2.1, DP 1.4, USB-C 65W',
      idealDock: 'D2 or D3',
      bestFor: 'Immersive Workstations, Financial Spreadsheets',
      price: '£499.00',
    },
  ];

  const isCurrentDock = currentHandle?.startsWith('d') || currentHandle?.includes('dock') || currentHandle?.includes('link') || currentHandle?.includes('power') || currentHandle?.includes('connect');

  return (
    <section className="pdp-comparison-matrix-section" aria-labelledby="matrix-heading">
      <div className="matrix-header">
        <span className="matrix-badge">Hardware Benchmarks</span>
        <h2 id="matrix-heading" className="matrix-title">
          Which Nexa Model Fits Your Setup?
        </h2>
        <p className="matrix-subtitle">
          Side-by-side performance spec matrix across charging output, display protocols, and I/O architecture.
        </p>

        <div className="matrix-tab-toggles" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'docks'}
            className={`matrix-tab-btn ${viewMode === 'docks' ? 'active' : ''}`}
            onClick={() => setViewMode('docks')}
          >
            ⚡ Nexa Dock Series (D1–D4)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'monitors'}
            className={`matrix-tab-btn ${viewMode === 'monitors' ? 'active' : ''}`}
            onClick={() => setViewMode('monitors')}
          >
            🖥️ Nexa Studio Display Series (M1–M3)
          </button>
        </div>
      </div>

      <div className="matrix-table-container">
        {viewMode === 'docks' ? (
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="matrix-feature-col">Specification</th>
                {DOCK_MODELS.map((dock) => {
                  const isCurrent = currentHandle === dock.handle;
                  return (
                    <th key={dock.handle} className={`matrix-model-col ${isCurrent ? 'is-current-model' : ''}`}>
                      {isCurrent && <span className="current-model-tag">Viewing This Model</span>}
                      <span className="model-badge">{dock.badge}</span>
                      <h3 className="model-name">{dock.name}</h3>
                      <div className="model-price">{dock.price}</div>
                      {!isCurrent && (
                        <Link to={`/products/${dock.handle}`} className="model-switch-btn">
                          View {dock.name} →
                        </Link>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="matrix-label">Laptop Host Charging</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={currentHandle === d.handle ? 'is-current-model' : ''}>
                    <strong className="spec-val-highlight">{d.charging}</strong>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">External Screen Support</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={currentHandle === d.handle ? 'is-current-model' : ''}>
                    {d.screens}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Video Connectors</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={currentHandle === d.handle ? 'is-current-model' : ''}>
                    {d.videoPorts}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">USB Expansion Ports</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={currentHandle === d.handle ? 'is-current-model' : ''}>
                    {d.usbPorts}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Wired Ethernet LAN</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={currentHandle === d.handle ? 'is-current-model' : ''}>
                    {d.ethernet}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Recommended Workflow</td>
                {DOCK_MODELS.map((d) => (
                  <td key={d.handle} className={`spec-workflow-cell ${currentHandle === d.handle ? 'is-current-model' : ''}`}>
                    <small>{d.bestFor}</small>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="matrix-feature-col">Specification</th>
                {MONITOR_MODELS.map((mon) => {
                  const isCurrent = currentHandle === mon.handle;
                  return (
                    <th key={mon.handle} className={`matrix-model-col ${isCurrent ? 'is-current-model' : ''}`}>
                      {isCurrent && <span className="current-model-tag">Viewing This Model</span>}
                      <h3 className="model-name">{mon.name}</h3>
                      <div className="model-price">{mon.price}</div>
                      {!isCurrent && (
                        <Link to={`/products/${mon.handle}`} className="model-switch-btn">
                          View {mon.name} →
                        </Link>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="matrix-label">Display Size & Panel</td>
                {MONITOR_MODELS.map((m) => (
                  <td key={m.handle} className={currentHandle === m.handle ? 'is-current-model' : ''}>
                    <strong>{m.size}</strong>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Refresh & Color</td>
                {MONITOR_MODELS.map((m) => (
                  <td key={m.handle} className={currentHandle === m.handle ? 'is-current-model' : ''}>
                    {m.refresh}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Video Input Interfaces</td>
                {MONITOR_MODELS.map((m) => (
                  <td key={m.handle} className={currentHandle === m.handle ? 'is-current-model' : ''}>
                    {m.inputs}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Compatible Nexa Dock</td>
                {MONITOR_MODELS.map((m) => (
                  <td key={m.handle} className={currentHandle === m.handle ? 'is-current-model' : ''}>
                    <span className="matrix-rec-pill">⚡ {m.idealDock}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="matrix-label">Best Suited For</td>
                {MONITOR_MODELS.map((m) => (
                  <td key={m.handle} className={`spec-workflow-cell ${currentHandle === m.handle ? 'is-current-model' : ''}`}>
                    <small>{m.bestFor}</small>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
