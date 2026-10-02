import {useState, useMemo} from 'react';

/**
 * Scalable brand and hardware icons for Faceted Filters
 */
function RealAppleIcon({size = 14}) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-label="Apple logo" style={{display: 'inline-block'}}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

function WindowsIcon({size = 13}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="Windows logo" style={{display: 'inline-block'}}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
    </svg>
  );
}

function LightningIcon({size = 14}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
  );
}

/**
 * UI-COL-01: Faceted Search & Discovery Sticky Sidebar
 *
 * Provides:
 * 1. OS Compatibility Tags (Apple macOS, Windows, ChromeOS / Linux) with real brand logos.
 * 2. Wattage charging slider / presets (0W to 100W Power Delivery).
 * 3. Video & Host Port toggles (HDMI, DisplayPort, USB-C, Dual Display).
 * 4. Price & Sorting controls (Price Low-to-High, High-to-Low, Featured).
 * 5. Smooth accordion collapse/expand sections.
 * 6. Sticky top scroll lock on desktop.
 * 7. Mobile responsive slide-up drawer with backdrop blur.
 * 8. Live matching counter and Clear Filters button.
 */
export function CollectionFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  activeFilterCount = 0,
  isSidebarVisible = true,
  onToggleSidebar,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer,
  collectionHandle = 'all',
}) {
  // Determine which filters to show based on collection type
  const getFilterConfig = (handle) => {
    const config = {
      showOS: false,
      showWattage: false,
      showPorts: false,
      showAvailability: true, // Always show availability
    };

    if (handle.includes('dock') || handle === 'all') {
      config.showOS = true;
      config.showWattage = true;
      config.showPorts = true;
    } else if (handle.includes('monitor')) {
      config.showPorts = true;
    }
    // Keyboards, Mice, Stands only show availability

    return config;
  };

  const filterConfig = getFilterConfig(collectionHandle);

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    os: filterConfig.showOS,
    wattage: filterConfig.showWattage,
    ports: filterConfig.showPorts,
    price: filterConfig.showAvailability,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleOsToggle = (osName) => {
    const current = filters.os || [];
    const next = current.includes(osName)
      ? current.filter((item) => item !== osName)
      : [...current, osName];
    onFilterChange({os: next});
  };

  const handlePortToggle = (portName) => {
    const current = filters.ports || [];
    const next = current.includes(portName)
      ? current.filter((item) => item !== portName)
      : [...current, portName];
    onFilterChange({ports: next});
  };

  const handleWattageChange = (val) => {
    onFilterChange({minWattage: Number(val)});
  };

  const handleWattagePreset = (watts) => {
    onFilterChange({
      minWattage: filters.minWattage === watts ? 0 : watts,
    });
  };

  const filterContent = (
    <div className="faceted-filter-content">
      {/* Top Header Row with Active Counter, Collapse & Reset */}
      <div className="filter-header-bar">
        <div className="filter-title-wrap">
          <svg className="filter-title-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span className="filter-main-title">Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-active-pill">{activeFilterCount} active</span>
          )}
        </div>
        <div className="filter-header-actions">
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="filter-reset-btn"
              onClick={onResetFilters}
              aria-label="Clear all filters"
            >
              Reset
            </button>
          )}
          {onToggleSidebar && (
            <button
              type="button"
              className="filter-hide-sidebar-btn"
              onClick={onToggleSidebar}
              title="Collapse filter sidebar"
              aria-label="Collapse filters"
            >
              <span>Hide</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Accordion 1: Computer / Device Compatibility */}
      {filterConfig.showOS && (
      <div className={`filter-accordion-item ${openSections.os ? 'is-open' : ''}`}>
        <button
          type="button"
          className="filter-accordion-header header-os"
          onClick={() => toggleSection('os')}
          aria-expanded={openSections.os}
        >
          <div className="accordion-header-left">
            <span className="accordion-section-icon os-icon">💻</span>
            <span className="accordion-label">
              <span>What computer do you use?</span>
              <small className="accordion-sublabel">Guarantees 1-cord plug &amp; play</small>
            </span>
          </div>
          <div className="accordion-header-right">
            <span className="accordion-count-badge">3</span>
            <span className={`accordion-chevron ${openSections.os ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </button>

        {openSections.os && (
          <div className="filter-accordion-body">
            <div className="os-badge-grid">
              <button
                type="button"
                className={`os-pill-btn ${(filters.os || []).includes('macOS') ? 'is-selected' : ''}`}
                onClick={() => handleOsToggle('macOS')}
                aria-pressed={(filters.os || []).includes('macOS')}
              >
                <span className="os-icon-box apple">
                  <RealAppleIcon size={15} />
                </span>
                <span className="os-text-wrap">
                  <span className="os-name">Apple Mac / MacBook</span>
                  <span className="os-hint">Air, Pro, Mac mini &amp; iPad</span>
                </span>
              </button>

              <button
                type="button"
                className={`os-pill-btn ${(filters.os || []).includes('Windows') ? 'is-selected' : ''}`}
                onClick={() => handleOsToggle('Windows')}
                aria-pressed={(filters.os || []).includes('Windows')}
              >
                <span className="os-icon-box windows">
                  <WindowsIcon size={14} />
                </span>
                <span className="os-text-wrap">
                  <span className="os-name">Windows PC / Laptop</span>
                  <span className="os-hint">Dell, HP, Lenovo, Surface, Asus</span>
                </span>
              </button>

              <button
                type="button"
                className={`os-pill-btn ${(filters.os || []).includes('Universal') ? 'is-selected' : ''}`}
                onClick={() => handleOsToggle('Universal')}
                aria-pressed={(filters.os || []).includes('Universal')}
              >
                <span className="os-icon-box universal">
                  <span style={{display: 'flex', gap: '2px', alignItems: 'center'}}>
                    <RealAppleIcon size={11} />
                    <WindowsIcon size={10} />
                  </span>
                </span>
                <span className="os-text-wrap">
                  <span className="os-name">Works on Both (Mac &amp; PC)</span>
                  <span className="os-hint">Great for shared home desks</span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Accordion 2: Laptop Charging (No heavy brick needed) */}
      {filterConfig.showWattage && (
      <div className={`filter-accordion-item ${openSections.wattage ? 'is-open' : ''}`}>
        <button
          type="button"
          className="filter-accordion-header header-wattage"
          onClick={() => toggleSection('wattage')}
          aria-expanded={openSections.wattage}
        >
          <div className="accordion-header-left">
            <span className="accordion-section-icon wattage-icon">⚡</span>
            <span className="accordion-label">
              <span>Laptop Fast Charging</span>
              <small className="accordion-sublabel">Powers battery through 1 cable</small>
            </span>
          </div>
          <div className="accordion-header-right">
            <span className="accordion-count-badge">3</span>
            <span className={`accordion-chevron ${openSections.wattage ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </button>

        {openSections.wattage && (
          <div className="filter-accordion-body">
            <div className="wattage-slider-wrap">
              <div className="wattage-val-display">
                <span className="wattage-current-badge">
                  <LightningIcon size={13} />
                  <span>
                    {filters.minWattage > 0
                      ? `Fast Charges at ${filters.minWattage}W+`
                      : 'Any Gear (Docks, Screens & Stands)'}
                  </span>
                </span>
                {filters.minWattage > 0 && (
                  <button
                    type="button"
                    className="wattage-clear-btn"
                    onClick={() => handleWattageChange(0)}
                  >
                    Reset
                  </button>
                )}
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minWattage || 0}
                onChange={(e) => handleWattageChange(e.target.value)}
                className="wattage-range-slider"
                aria-label="Minimum laptop charging power"
              />

              <div className="wattage-ticks-row">
                <span>Any</span>
                <span>65W (Everyday Laptops)</span>
                <span>100W (Heavy Duty)</span>
              </div>

              {/* Quick Clickable Presets with Human Explanations */}
              <div className="wattage-presets-row">
                {[
                  {watts: 0, label: 'All Workstation Items', desc: 'Browse everything'},
                  {watts: 65, label: '65W+ (MacBook Air / Dell / HP)', desc: 'Charges standard work laptops quickly'},
                  {watts: 100, label: '100W+ (MacBook Pro 16" / Creator)', desc: 'Heavy-duty power for creative work'},
                ].map((preset) => (
                  <button
                    key={preset.watts}
                    type="button"
                    className={`wattage-preset-btn ${
                      filters.minWattage === preset.watts ? 'is-active' : ''
                    }`}
                    onClick={() => handleWattagePreset(preset.watts)}
                  >
                    <span className="preset-label">{preset.label}</span>
                    <span className="preset-desc">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Accordion 3: How many screens & plugs */}
      {filterConfig.showPorts && (
      <div className={`filter-accordion-item ${openSections.ports ? 'is-open' : ''}`}>
        <button
          type="button"
          className="filter-accordion-header header-ports"
          onClick={() => toggleSection('ports')}
          aria-expanded={openSections.ports}
        >
          <div className="accordion-header-left">
            <span className="accordion-section-icon ports-icon">🎬</span>
            <span className="accordion-label">
              <span>Screens &amp; Cord Connections</span>
              <small className="accordion-sublabel">Pick what you want to plug in</small>
            </span>
          </div>
          <div className="accordion-header-right">
            <span className="accordion-count-badge">4</span>
            <span className={`accordion-chevron ${openSections.ports ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </button>

        {openSections.ports && (
          <div className="filter-accordion-body">
            <div className="ports-toggle-list">
              {[
                {
                  id: 'Dual Display',
                  title: '2 Big Screens at Once',
                  desc: 'Run dual monitors from one single wire',
                  tag: 'Dual Monitor',
                },
                {
                  id: 'HDMI',
                  title: 'Standard TV & Screen Plug (HDMI)',
                  desc: 'Fits virtually every monitor or TV in the UK',
                  tag: 'Universal',
                },
                {
                  id: 'DisplayPort',
                  title: 'Pro Monitor Plug (DisplayPort)',
                  desc: 'For ultra-smooth high refresh desk screens',
                  tag: 'Pro Video',
                },
                {
                  id: 'USB-C',
                  title: 'Modern One-Cord Connection (USB-C)',
                  desc: 'Video, power & data in one clean cable',
                  tag: '1-Cable',
                },
              ].map((port) => {
                const isSelected = (filters.ports || []).includes(port.id);
                return (
                  <label
                    key={port.id}
                    className={`port-toggle-row ${isSelected ? 'is-selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handlePortToggle(port.id)}
                      className="port-checkbox sr-only"
                    />
                    <div className="port-custom-box" aria-hidden="true">
                      {isSelected && <span>✓</span>}
                    </div>
                    <div className="port-info">
                      <span className="port-title">{port.title}</span>
                      <span className="port-desc">{port.desc}</span>
                    </div>
                    <span className="port-spec-tag">{port.tag}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Accordion 4: Stock & UK Dispatch */}
      {filterConfig.showAvailability && (
      <div className={`filter-accordion-item ${openSections.price ? 'is-open' : ''}`}>
        <button
          type="button"
          className="filter-accordion-header header-availability"
          onClick={() => toggleSection('price')}
          aria-expanded={openSections.price}
        >
          <div className="accordion-header-left">
            <span className="accordion-section-icon availability-icon">📦</span>
            <span className="accordion-label">
              <span>Availability</span>
              <small className="accordion-sublabel">Direct UK Dispatch</small>
            </span>
          </div>
          <div className="accordion-header-right">
            <span className="accordion-count-badge">1</span>
            <span className={`accordion-chevron ${openSections.price ? 'is-rotated' : ''}`} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </button>

        {openSections.price && (
          <div className="filter-accordion-body">
            <div className="availability-options">
              <label
                className={`port-toggle-row ${filters.inStockOnly ? 'is-selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(filters.inStockOnly)}
                  onChange={() =>
                    onFilterChange({inStockOnly: !filters.inStockOnly})
                  }
                  className="port-checkbox sr-only"
                />
                <div className="port-custom-box" aria-hidden="true">
                  {filters.inStockOnly && <span>✓</span>}
                </div>
                <div className="port-info">
                  <span className="port-title">In Stock for Rapid Delivery</span>
                  <span className="port-desc">Leaves UK warehouse within 24 hours</span>
                </div>
                <span className="in-stock-dot" aria-hidden="true" />
              </label>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Bottom Result Status */}
      <div className="filter-sidebar-footer">
        <span className="filter-footer-count">
          Showing <strong>{totalResults}</strong> matching setups
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      {isSidebarVisible && (
        <div className="sticky-filter-wrapper">{filterContent}</div>
      )}

      {/* Mobile Bottom Sheet Drawer */}
      <div
        className={`mobile-filter-drawer-overlay ${isMobileDrawerOpen ? 'is-open' : ''}`}
        onClick={onCloseMobileDrawer}
        aria-hidden={!isMobileDrawerOpen}
      >
        <div
          className="mobile-filter-drawer-sheet"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Filter Products Drawer"
        >
          <div className="drawer-drag-handle" />
          <div className="drawer-header-row">
            <span className="drawer-title">Filters ({totalResults} Results)</span>
            <button
              type="button"
              className="drawer-close-btn"
              onClick={onCloseMobileDrawer}
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
          <div className="drawer-scroll-body">{filterContent}</div>
          <div className="drawer-sticky-bottom">
            <button
              type="button"
              className="drawer-apply-btn"
              onClick={onCloseMobileDrawer}
            >
              View {totalResults} Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
