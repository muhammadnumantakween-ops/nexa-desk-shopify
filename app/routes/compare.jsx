import {useState, useEffect, useMemo} from 'react';
import {useLoaderData, Link} from 'react-router';
import {
  evaluateDockCompatibility,
  normalizeList,
} from '~/utils/compatibility';
import {DEVICE_PROFILES} from '~/data/setupCatalogue';

export const meta = () => {
  return [
    {title: 'NexaDesk | Compare Docks & Hubs Side-by-Side'},
    {
      name: 'description',
      content:
        'Compare docking station specifications side-by-side: Host connector, OS compatibility, charging power, video outputs, and hardware difference highlighting.',
    },
  ];
};

/**
 * Fallback static fixtures for Docks D1-D4
 * Matching DESIGN.md Section 5.2 exactly
 */
const FALLBACK_DOCKS = [
  {
    id: 'gid://shopify/Product/D1',
    handle: 'd1-link-65',
    title: 'D1 Link 65 Standard Dock',
    price: '99.00',
    currency: 'GBP',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 65,
    dock_video_outputs: ['HDMI'],
    product_role: 'dock',
    availableForSale: true,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/D1_Link_65.png?v=1',
      altText: 'D1 Link 65 Docking Station',
    },
    tag: 'Best for MacBook Air & 65W PC',
  },
  {
    id: 'gid://shopify/Product/D2',
    handle: 'd2-link-100',
    title: 'D2 Link 100 Dual-Screen Flagship Dock',
    price: '120.00',
    currency: 'GBP',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 100,
    dock_video_outputs: ['HDMI', 'DisplayPort'],
    product_role: 'dock',
    availableForSale: true,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/D2_Link_100.png?v=1',
      altText: 'D2 Link 100 Dual Screen Dock',
    },
    tag: 'Flagship Dual-Screen Pick',
  },
  {
    id: 'gid://shopify/Product/D3',
    handle: 'd3-pro-100',
    title: 'D3 Pro 100 High-Speed Workstation Dock',
    price: '149.00',
    currency: 'GBP',
    host_connector: 'USB-C',
    supported_operating_systems: ['Windows'],
    dock_charging_output: 100,
    dock_video_outputs: ['DisplayPort'],
    product_role: 'dock',
    availableForSale: true,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/D3_Pro_100.png?v=1',
      altText: 'D3 Pro 100 Enterprise Dock',
    },
    tag: 'Windows CAD & Heavy Workstation',
  },
  {
    id: 'gid://shopify/Product/D4',
    handle: 'd4-connect-a',
    title: 'D4 Connect A Legacy Peripheral Hub',
    price: '59.00',
    currency: 'GBP',
    host_connector: 'USB-A',
    supported_operating_systems: ['Windows', 'macOS'],
    dock_charging_output: 0,
    dock_video_outputs: [],
    product_role: 'hub-only',
    availableForSale: true,
    image: {
      url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/D4_Connect_A.png?v=1',
      altText: 'D4 Connect A Peripheral Hub',
    },
    tag: 'USB-A Data Hub Only',
  },
];

const DOCKS_QUERY = `#graphql
  query CompareDocksQuery {
    products(first: 24, query: "tag:dock OR product_type:dock OR product_type:hub") {
      nodes {
        id
        title
        handle
        availableForSale
        featuredImage {
          url
          altText
        }
        images(first: 1) {
          nodes {
            url
            altText
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        productRoleCustom: metafield(namespace: "custom", key: "product_role") {
          value
        }
        productRoleNexa: metafield(namespace: "nexadesk", key: "product_role") {
          value
        }
        supportedOSCustom: metafield(namespace: "custom", key: "supported_operating_systems") {
          value
        }
        supportedOSNexa: metafield(namespace: "nexadesk", key: "supported_os") {
          value
        }
        hostConnectorCustom: metafield(namespace: "custom", key: "host_connector") {
          value
        }
        hostConnectorNexa: metafield(namespace: "nexadesk", key: "host_connector") {
          value
        }
        dockChargingOutputCustom: metafield(namespace: "custom", key: "dock_charging_output") {
          value
        }
        dockChargingOutputNexa: metafield(namespace: "nexadesk", key: "charging_output_watts") {
          value
        }
        dockVideoOutputsCustom: metafield(namespace: "custom", key: "dock_video_outputs") {
          value
        }
        dockVideoOutputsNexa: metafield(namespace: "nexadesk", key: "video_outputs") {
          value
        }
      }
    }
  }
`;

export async function loader({context}) {
  try {
    const data = await context.storefront.query(DOCKS_QUERY);
    const nodes = data?.products?.nodes || [];

    const parsedDocks = nodes
      .filter((p) => {
        const role =
          p.productRoleNexa?.value?.toLowerCase() ||
          p.productRoleCustom?.value?.toLowerCase() ||
          '';
        const titleLower = p.title.toLowerCase();
        return (
          role === 'dock' ||
          role === 'hub-only' ||
          titleLower.includes('dock') ||
          titleLower.includes('link') ||
          titleLower.includes('connect')
        );
      })
      .map((p) => {
        const parseList = (raw) => {
          if (!raw) return [];
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [raw];
          } catch {
            return raw.split(',').map((s) => s.trim());
          }
        };

        const role =
          p.productRoleNexa?.value ||
          p.productRoleCustom?.value ||
          (p.title.toLowerCase().includes('connect-a') ? 'hub-only' : 'dock');

        const osRaw = p.supportedOSNexa?.value || p.supportedOSCustom?.value;
        const wattsRaw =
          p.dockChargingOutputNexa?.value || p.dockChargingOutputCustom?.value;
        const videoRaw =
          p.dockVideoOutputsNexa?.value || p.dockVideoOutputsCustom?.value;
        const connectorRaw =
          p.hostConnectorNexa?.value || p.hostConnectorCustom?.value;

        const img = p.featuredImage || p.images?.nodes?.[0] || null;

        return {
          id: p.id,
          handle: p.handle,
          title: p.title,
          price: p.priceRange?.minVariantPrice?.amount || '0.00',
          currency: p.priceRange?.minVariantPrice?.currencyCode || 'GBP',
          host_connector: connectorRaw || (p.title.includes('USB-A') ? 'USB-A' : 'USB-C'),
          supported_operating_systems: parseList(osRaw),
          dock_charging_output: Number(wattsRaw || 0),
          dock_video_outputs: parseList(videoRaw),
          product_role: role,
          availableForSale: p.availableForSale,
          image: img,
        };
      });

    return {
      docks: parsedDocks.length >= 2 ? parsedDocks : FALLBACK_DOCKS,
    };
  } catch (error) {
    console.error('Failed to query docks for compare:', error);
    return {
      docks: FALLBACK_DOCKS,
    };
  }
}

const STORAGE_KEY_COMPARE = 'nexadesk_compare_dock_ids';
const STORAGE_KEY_PROFILE = 'nexadesk_setup_session';

export default function CompareRoute() {
  const {docks} = useLoaderData();

  // Selected dock IDs (persisted in localStorage, max 3)
  const [selectedIds, setSelectedIds] = useState(() => {
    return docks.slice(0, 3).map((d) => d.id);
  });

  // Highlight Differences toggle
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  // Selected Device Profile for real-time compatibility evaluation
  const [selectedProfileCode, setSelectedProfileCode] = useState('');

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMPARE);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify valid ids
          const validIds = parsed.filter((id) => docks.some((d) => d.id === id));
          if (validIds.length > 0) {
            setSelectedIds(validIds.slice(0, 3));
          }
        }
      }

      // Check if user has an active profile from /find-my-setup
      const storedSession = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (storedSession) {
        const sessionData = JSON.parse(storedSession);
        if (sessionData?.selectedProfile?.code) {
          setSelectedProfileCode(sessionData.selectedProfile.code);
        }
      }
    } catch {
      // localStorage error fallback
    }
  }, [docks]);

  // Persist selected IDs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(selectedIds));
    } catch {
      // Storage unavailable
    }
  }, [selectedIds]);

  const toggleDock = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Shift out oldest to keep max 3
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const removeDock = (id) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const selectedDocks = useMemo(() => {
    return docks.filter((d) => selectedIds.includes(d.id));
  }, [docks, selectedIds]);

  const activeProfile = useMemo(() => {
    if (!selectedProfileCode) return null;
    return DEVICE_PROFILES.find((p) => p.code === selectedProfileCode) || null;
  }, [selectedProfileCode]);

  // Model-specific code tag (e.g., D1, D2, D3, D4)
  const getDockCode = (dock) => {
    const match = dock.title.match(/D[1-4]/i) || dock.handle.match(/d[1-4]/i);
    if (match) return match[0].toUpperCase();
    if (dock.handle.includes('65')) return 'D1';
    if (dock.handle.includes('100') && !dock.handle.includes('pro')) return 'D2';
    if (dock.handle.includes('pro')) return 'D3';
    if (dock.handle.includes('connect')) return 'D4';
    return 'DOCK';
  };

  // Specification definitions for side-by-side comparison
  const specs = useMemo(() => {
    return [
      {
        id: 'price',
        label: 'Price (GBP)',
        category: 'Pricing & Availability',
        getValue: (dock) => `£${dock.price}`,
        render: (dock) => (
          <div>
            <span style={{fontWeight: 700, color: '#22c55e', fontSize: '1.05rem'}}>
              £{dock.price}
            </span>
            <div style={{fontSize: '0.75rem', color: '#94a3b8'}}>Inc. UK VAT</div>
          </div>
        ),
      },
      {
        id: 'host_connector',
        label: 'Host Interface',
        category: 'Connectivity',
        getValue: (dock) => dock.host_connector || 'USB-C',
        render: (dock) => (
          <span>
            {dock.host_connector === 'USB-C' ? '⚡ USB-C (Thunderbolt Compatible)' : '🔌 USB-A 3.0'}
          </span>
        ),
      },
      {
        id: 'charging_output',
        label: 'Laptop Power Delivery',
        category: 'Power & Charging',
        getValue: (dock) => `${dock.dock_charging_output}W`,
        render: (dock) => (
          <div>
            {dock.dock_charging_output > 0 ? (
              <span style={{color: '#fbbf24', fontWeight: 600}}>
                ⚡ {dock.dock_charging_output}W GaN Power Delivery
              </span>
            ) : (
              <span style={{color: '#94a3b8'}}>Bus-Powered (No Laptop Charge)</span>
            )}
          </div>
        ),
      },
      {
        id: 'os_support',
        label: 'OS Compatibility',
        category: 'Platform Support',
        getValue: (dock) => {
          const list = dock.supported_operating_systems || [];
          return list.join(', ') || 'Windows, macOS';
        },
        render: (dock) => {
          const list = dock.supported_operating_systems || [];
          const osStr = list.join(', ') || 'Windows, macOS';
          const hasMac = osStr.toLowerCase().includes('mac');
          const hasWin = osStr.toLowerCase().includes('win');
          return (
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
              {hasMac && (
                <span
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                   macOS
                </span>
              )}
              {hasWin && (
                <span
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  田 Windows
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'video_outputs',
        label: 'Video Outputs & Displays',
        category: 'Displays',
        getValue: (dock) =>
          dock.dock_video_outputs && dock.dock_video_outputs.length > 0
            ? dock.dock_video_outputs.join(', ')
            : 'None (Data Hub Only)',
        render: (dock) => {
          const outputs = dock.dock_video_outputs || [];
          if (outputs.length === 0) {
            return <span style={{color: '#94a3b8'}}>None (Data Hub Only)</span>;
          }
          return (
            <div>
              <div style={{fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem'}}>
                {outputs.length >= 2 ? '🖥️ Dual Displays (HDMI + DP)' : `🖥️ Single 4K (${outputs[0]})`}
              </div>
              <div style={{fontSize: '0.78rem', color: '#94a3b8'}}>
                Ports: {outputs.join(' + ')}
              </div>
            </div>
          );
        },
      },
      {
        id: 'max_resolution',
        label: 'Max Video Resolution',
        category: 'Displays',
        getValue: (dock) =>
          dock.dock_video_outputs?.length > 0 ? '4K @ 60Hz' : 'N/A',
        render: (dock) =>
          dock.dock_video_outputs?.length > 0 ? (
            <span style={{color: '#38bdf8', fontWeight: 600}}>Up to 4K @ 60Hz</span>
          ) : (
            <span style={{color: '#64748b'}}>—</span>
          ),
      },
      {
        id: 'availability',
        label: 'UK Stock & Delivery',
        category: 'Shipping',
        getValue: (dock) => (dock.availableForSale ? 'In Stock' : 'Pre-order'),
        render: (dock) => (
          <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: dock.availableForSale ? '#22c55e' : '#f59e0b',
                display: 'inline-block',
                boxShadow: dock.availableForSale
                  ? '0 0 8px #22c55e'
                  : '0 0 8px #f59e0b',
              }}
            />
            <span style={{fontSize: '0.85rem', color: '#cbd5e1'}}>
              {dock.availableForSale
                ? 'In Stock • Next-Day UK Delivery'
                : 'Limited Stock • 24h Dispatch'}
            </span>
          </div>
        ),
      },
      {
        id: 'warranty',
        label: 'Warranty & Guarantee',
        category: 'Assurance',
        getValue: () => '2-Year UK Warranty • 30-Day Money Back',
        render: () => (
          <span style={{color: '#94a3b8', fontSize: '0.85rem'}}>
            🛡️ 2-Year UK Warranty • 30-Day Money Back
          </span>
        ),
      },
    ];
  }, []);

  // Compute differing status for each spec row
  const specDiffMap = useMemo(() => {
    const map = {};
    if (selectedDocks.length <= 1) {
      specs.forEach((s) => (map[s.id] = false));
      return map;
    }
    specs.forEach((spec) => {
      const values = selectedDocks.map((dock) => spec.getValue(dock));
      const firstVal = values[0];
      const hasDiff = values.some((val) => val !== firstVal);
      map[spec.id] = hasDiff;
    });
    return map;
  }, [specs, selectedDocks]);

  const differingCount = useMemo(() => {
    return Object.values(specDiffMap).filter(Boolean).length;
  }, [specDiffMap]);

  return (
    <div className="page-compare-docks">
      {/* Top Breadcrumb & Hero Header */}
      <div className="compare-hero-header">
        <div className="compare-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Compare Docks</span>
        </div>

        <div className="compare-badge-pill">
          <span>⚖️ Side-by-Side Docking Station Matrix</span>
        </div>

        <h1 className="compare-title">Compare NexaDesk Docks & Hubs</h1>
        <p className="compare-lead">
          Find the perfect docking match for your specific laptop, monitor inputs, and charging
          wattage. Select up to 3 docks to inspect power delivery, display capabilities, and OS
          support.
        </p>
      </div>

      {/* Control Bar: Device Profile Selector & Spec Diff Toggle */}
      <div className="compare-controls-card">
        {/* Device Profile Filter */}
        <div className="compare-profile-picker">
          <span className="picker-label-title">
            <span>💻 Filter by Your Device:</span>
          </span>
          <select
            className="profile-select-dropdown"
            value={selectedProfileCode}
            onChange={(e) => setSelectedProfileCode(e.target.value)}
            aria-label="Select device profile to evaluate dock compatibility"
          >
            <option value="">No Profile Selected (Compare All)</option>
            {DEVICE_PROFILES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code}: {p.label} ({p.required_charging_watts}W)
              </option>
            ))}
          </select>
          {selectedProfileCode && (
            <button
              className="clear-profile-btn"
              onClick={() => setSelectedProfileCode('')}
              title="Clear selected profile"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* UI-COMP-02: Spec Diff Interactive Toggle Switch */}
        <div className="compare-diff-toggle-wrapper">
          <label className="toggle-switch-container">
            <input
              type="checkbox"
              className="toggle-switch-input"
              checked={showDifferencesOnly}
              onChange={(e) => setShowDifferencesOnly(e.target.checked)}
              aria-label="Toggle highlight differences mode"
            />
            <span className="toggle-slider" />
            <span className="toggle-switch-label">
              <span>Highlight Differences</span>
              {differingCount > 0 && (
                <span className="diff-count-badge">
                  {differingCount} differing {differingCount === 1 ? 'spec' : 'specs'}
                </span>
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Dock Quick Selector Pills Strip */}
      <div className="compare-selector-section">
        <div className="selector-section-header">
          <span>Choose docks to compare (max 3):</span>
          <span className="selector-count-badge">
            {selectedDocks.length} of 3 selected
          </span>
        </div>
        <div className="compare-pills-row">
          {docks.map((dock) => {
            const isSelected = selectedIds.includes(dock.id);
            const dockCode = getDockCode(dock);
            return (
              <button
                key={dock.id}
                type="button"
                onClick={() => toggleDock(dock.id)}
                className={`dock-pill-btn ${isSelected ? 'is-active' : ''}`}
                aria-pressed={isSelected}
              >
                {isSelected ? (
                  <span className="pill-check-indicator">✓</span>
                ) : (
                  <span className="pill-plus-indicator">+</span>
                )}
                <span>
                  <strong>{dockCode}</strong> {dock.title.replace(/\(D[1-4]\)/i, '').trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {selectedDocks.length === 0 ? (
        <div className="compare-empty-state">
          <div className="empty-state-icon">⚖️</div>
          <h2 className="empty-state-title">No Docks Selected</h2>
          <p className="empty-state-desc">
            Select up to 3 docks or hubs from the pills above to view a comprehensive side-by-side
            specification comparison.
          </p>
          <button
            type="button"
            className="btn-launch-builder"
            onClick={() => setSelectedIds(docks.slice(0, 3).map((d) => d.id))}
          >
            Compare All 3 Default Docks
          </button>
        </div>
      ) : (
        /* UI-COMP-01: 3-Column Floating Dock Comparison Grid */
        <div
          className={`compare-matrix-container ${
            showDifferencesOnly ? 'compare-diff-active' : ''
          }`}
        >
          <div className="compare-matrix-scrollable">
            <table
              className="compare-table"
              data-spec-type="dock-comparison"
              data-currency="GBP"
            >
              {/* Sticky Header Row */}
              <thead>
                <tr className="compare-header-row">
                  <th className="th-feature-label-col">
                    <div className="feature-col-header-content">
                      <span className="feature-col-title">Specifications</span>
                      <span className="feature-col-subtitle">
                        Comparing {selectedDocks.length} models
                      </span>
                    </div>
                  </th>
                  {selectedDocks.map((dock) => {
                    const dockCode = getDockCode(dock);
                    return (
                      <th key={dock.id} className="th-dock-col">
                        <div className="dock-header-card">
                          <div className="dock-header-top-row">
                            <span className="dock-code-tag">{dockCode} MODEL</span>
                            {selectedDocks.length > 1 && (
                              <button
                                type="button"
                                className="dock-remove-btn"
                                onClick={() => removeDock(dock.id)}
                                title={`Remove ${dock.title} from comparison`}
                                aria-label={`Remove ${dock.title}`}
                              >
                                ✕
                              </button>
                            )}
                          </div>

                          {/* Image Box */}
                          <div className="dock-img-box">
                            {dock.image?.url ? (
                              <img
                                src={dock.image.url}
                                alt={dock.image.altText || dock.title}
                                loading="lazy"
                              />
                            ) : (
                              <span style={{fontSize: '2.5rem'}}>🔌</span>
                            )}
                          </div>

                          {/* Title & Price */}
                          <h3 className="dock-header-title">{dock.title}</h3>
                          <div className="dock-header-price-row">
                            <span className="dock-header-price">£{dock.price}</span>
                            <span className="dock-header-tax-pill">Free UK Delivery</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="dock-header-actions">
                            <Link
                              to={`/products/${dock.handle}`}
                              className="btn-dock-view"
                            >
                              <span>View Product Details</span>
                              <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Specification Rows */}
              <tbody>
                {/* Optional Device Profile Compatibility Row */}
                {activeProfile && (
                  <tr className="compare-row is-differing">
                    <td className="td-feature-label">
                      <strong>Compatibility with {activeProfile.code}</strong>
                      <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem'}}>
                        {activeProfile.label} ({activeProfile.required_charging_watts}W)
                      </div>
                    </td>
                    {selectedDocks.map((dock) => {
                      const evalResult = evaluateDockCompatibility(activeProfile, {
                        ...dock,
                        charging_output_watts: dock.dock_charging_output,
                        video_outputs: dock.dock_video_outputs,
                      });

                      const isCompat = evalResult.status === 'compatible';
                      const isNotCompat = evalResult.status === 'not-compatible';

                      return (
                        <td key={dock.id} className="td-dock-val">
                          <span
                            className={`compat-badge-cell ${
                              isCompat
                                ? 'is-compatible'
                                : isNotCompat
                                ? 'is-not-compatible'
                                : 'is-not-confirmed'
                            }`}
                          >
                            <span>{isCompat ? '✓ Certified Compatible' : '✕ Incompatible'}</span>
                          </span>
                          {!isCompat && evalResult.reason && (
                            <span className="compat-explain-reason">
                              {evalResult.reason}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Specs List */}
                {specs.map((spec) => {
                  const isDiff = specDiffMap[spec.id];
                  return (
                    <tr
                      key={spec.id}
                      className={`compare-row ${isDiff ? 'is-differing' : 'is-identical'}`}
                    >
                      <td className="td-feature-label">
                        {isDiff && showDifferencesOnly && (
                          <span className="diff-sparkle-marker">✨</span>
                        )}
                        <span>{spec.label}</span>
                      </td>
                      {selectedDocks.map((dock) => (
                        <td key={dock.id} className="td-dock-val">
                          {spec.render ? spec.render(dock) : spec.getValue(dock)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom Builder CTA Banner */}
      <div className="compare-bottom-builder-cta">
        <span className="cta-inner-badge">✨ Complete Workstation Configurator</span>
        <h2 className="cta-heading">Want a Guaranteed Zero-Guesswork Setup?</h2>
        <p className="cta-subtext">
          Use our interactive 4-step wizard to automatically pair your laptop with compatible docks,
          certified monitors, and precision desktop accessories.
        </p>
        <Link to="/find-my-setup" className="btn-launch-builder">
          <span>Launch Interactive Setup Builder</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
