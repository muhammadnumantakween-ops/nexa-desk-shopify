import {useState, useMemo} from 'react';

/**
 * UI-PDP-03: Interactive Front & Rear Port Explorer
 *
 * Requirements from tasks_ui.csv:
 * 1. Interactive diagram of the dock displaying HDMI, DisplayPort, USB-C PD, USB-A, Ethernet, and Audio ports.
 * 2. Front & Rear chassis tab toggles.
 * 3. Clickable/hoverable port pins highlighting technical specifications (e.g., 4K@60Hz, 10Gbps, 100W PD).
 * 4. Highlights compatible monitor connectors and hardware compatibility tips.
 * 5. Zoom-to-fit modal on mobile screens with pinch/tap interactions.
 * 6. Responsive embedded diagram adhering to the CalDigit UK / Nexa Desk cyberpunk luxury theme.
 *
 * @param {{
 *   product: {
 *     title: string;
 *     handle: string;
 *     productRole?: {value: string} | null;
 *     hostConnector?: {value: string} | null;
 *     dockChargingOutput?: {value: string} | null;
 *     dockVideoOutputs?: {value: string} | null;
 *     monitorVideoInputs?: {value: string} | null;
 *   };
 * }}
 */
export function PortDiagram({product}) {
  const [activeTab, setActiveTab] = useState('rear'); // 'rear' | 'front'
  const [activePort, setActivePort] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse specifications
  const parseList = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return String(raw).split(',').map((s) => s.trim());
    }
  };

  const wattage = Number(product.dockChargingOutput?.value || 0);
  const videoOutputs = parseList(product.dockVideoOutputs?.value);
  const hasDualDisplay = videoOutputs.length >= 2 || product.title.toLowerCase().includes('dual');
  const hasDisplayPort = videoOutputs.some((v) => v.toLowerCase().includes('displayport') || v.toLowerCase().includes('dp'));
  const isLegacyA = product.handle.includes('d4') || product.title.toLowerCase().includes('usb-a');
  const isMonitor = product.title.toLowerCase().includes('monitor');
  const isCableOrAccessory = !isMonitor && !product.title.toLowerCase().includes('dock') && !product.handle.startsWith('d');

  // Define port configurations based on product type
  const portsConfig = useMemo(() => {
    if (isCableOrAccessory) {
      return {
        front: [
          {id: 'c-plug-1', name: 'USB-C Reversible Head', spec: 'Symmetrical oval design — plugs in either way up', type: 'usbc', tag: 'Connector A', icon: '🔌'},
          {id: 'c-shield', name: 'Alloy Shell & Strain Relief', spec: 'Anodized aluminum collar prevents bending damage', type: 'controls', tag: 'Durability', icon: '🛡️'},
          {id: 'c-braid', name: 'Double-Braided Nylon Jacket', spec: 'Tangle-free, abrasion-resistant outer shielding', type: 'screen', tag: 'Build Quality', icon: '🧵'},
        ],
        rear: [
          {id: 'c-plug-2', name: 'High-Speed Host Connector', spec: 'Gold-plated pins carry 100W power and 40Gbps video', type: 'host', tag: 'Connector B', icon: '⚡'},
          {id: 'c-emarker', name: 'Smart E-Marker Chip', spec: 'Regulates voltage safely to protect your laptop battery', type: 'switch', tag: 'Safety Tech', icon: '🧠'},
          {id: 'c-copper', name: 'Oxygen-Free Copper Core', spec: 'Maximum signal clarity with zero video flicker', type: 'power', tag: 'Signal Wire', icon: '✨'},
        ]
      };
    }

    if (isMonitor) {
      return {
        front: [
          {id: 'm-screen', name: 'Matte IPS Display Panel', spec: 'Anti-glare screen with wide 178° viewing angle — easy on the eyes', type: 'screen', tag: 'Display', icon: '🖥️'},
          {id: 'm-power-led', name: 'Gentle Status Light', spec: 'Soft white glow indicates active connection and sleep mode', type: 'led', tag: 'System', icon: '💡'},
          {id: 'm-osd-btns', name: 'Simple Quick-Settings Buttons', spec: 'Adjust brightness and switch inputs with one tactile click', type: 'controls', tag: 'Controls', icon: '⚙️'},
        ],
        rear: [
          {id: 'm-usbc-in', name: 'USB-C All-in-One Plug', spec: 'Single cable carries laptop screen video AND charges your battery', type: 'usbc', tag: 'Power & Video', icon: '⚡'},
          {id: 'm-hdmi-1', name: 'HDMI 2.0 Port', spec: 'Universal connection for laptops, PCs, Apple TV, or consoles', type: 'video', tag: 'Display In', icon: '📺'},
          {id: 'm-dp-1', name: 'DisplayPort 1.4', spec: 'High-refresh rate input for ultra-smooth scrolling and gaming', type: 'video', tag: 'Display In', icon: '🖥️'},
          {id: 'm-audio-out', name: 'Desktop Speaker Out', spec: '3.5mm jack to connect desktop speakers or wired headphones', type: 'audio', tag: 'Audio', icon: '🎧'},
          {id: 'm-ac-power', name: 'Standard Wall Power', spec: 'Built-in power supply (no bulky adapter box hanging off your desk)', type: 'power', tag: 'Power', icon: '🔌'},
        ]
      };
    }

    if (isLegacyA) {
      return {
        front: [
          {id: 'fa-usb1', name: 'Classic USB Port 1', spec: 'Fast 5Gbps file transfers for flash drives and external hard drives', type: 'usba', tag: 'Data', icon: '💾'},
          {id: 'fa-usb2', name: 'Fast-Charge USB Port 2', spec: 'Charges your smartphone or wireless headphones while you work', type: 'usba', tag: 'Data & Charge', icon: '🔋'},
          {id: 'fa-audio', name: 'Headphone & Mic Jack', spec: 'Standard 3.5mm plug for Zoom calls and crisp stereo music', type: 'audio', tag: 'Audio', icon: '🎧'},
          {id: 'fa-led', name: 'Connection Indicator', spec: 'Illuminates when your computer is safely linked and ready', type: 'led', tag: 'Status', icon: '💡'},
        ],
        rear: [
          {id: 'ra-host', name: 'Computer Host Cable', spec: 'Connects to your laptop via included USB cable', type: 'host', tag: 'Laptop Link', icon: '💻'},
          {id: 'ra-usb3', name: 'Wireless Mouse Port', spec: 'Interference-free connection for mouse dongles', type: 'usba', tag: 'Accessories', icon: '🖱️'},
          {id: 'ra-usb4', name: 'Keyboard / Webcam Port', spec: 'Reliable connection for desktop keyboard or high-def webcam', type: 'usba', tag: 'Accessories', icon: '⌨️'},
          {id: 'ra-eth', name: 'Wired Gigabit Internet', spec: 'Rock-solid wired connection — stops Wi-Fi dropouts on video calls', type: 'lan', tag: 'Ethernet', icon: '🌐'},
          {id: 'ra-pwr', name: 'Wall Power Input', spec: 'Dedicated power supply keeps the dock humming reliably', type: 'power', tag: 'Power', icon: '🔌'},
        ]
      };
    }

    // Default: Modern USB-C / Thunderbolt Docks (D1, D2, D3)
    return {
      front: [
        {id: 'f-pwr-btn', name: 'One-Touch Power Button', spec: 'Sleep or wake your entire workstation with a single press', type: 'switch', tag: 'Power Switch', icon: '🔘'},
        {id: 'f-usbc-10g', name: 'Ultra-Fast USB-C Port', spec: 'Super-speed data for phones, backup drives, and fast file transfers', type: 'usbc', tag: 'Fast Data', icon: '⚡'},
        {id: 'f-usba-10g', name: 'Front Fast-Charge USB', spec: 'Quick-access charging port for phone or earbuds', type: 'usba', tag: 'Fast Charge', icon: '📱'},
        {id: 'f-sd-card', name: 'Camera Memory Card Slots', spec: 'Insert SD or microSD camera cards — copies photos in seconds', type: 'media', tag: 'Photo Reader', icon: '📷'},
        {id: 'f-audio', name: 'Headphone & Microphone Jack', spec: 'Clear 3.5mm connection for crystal-clear work calls and music', type: 'audio', tag: 'Audio', icon: '🎧'},
      ],
      rear: [
        {
          id: 'r-host-pd',
          name: `Laptop Link (${wattage > 0 ? wattage : 100}W Power Delivery)`,
          spec: `One cable powers your laptop battery full speed while connecting all screens and gear`,
          type: 'host',
          tag: 'One-Cable Host',
          icon: '⚡',
          primary: true
        },
        {
          id: 'r-hdmi-1',
          name: 'HDMI Monitor Plug',
          spec: 'Connects your main external monitor with sharp, colorful 4K video',
          type: 'video',
          tag: 'Monitor Plug',
          icon: '📺',
        },
        ...(hasDisplayPort || hasDualDisplay ? [
          {
            id: 'r-dp-1',
            name: 'DisplayPort Monitor Plug',
            spec: 'Connects your second monitor for a dual-screen productivity setup',
            type: 'video',
            tag: 'Monitor Plug',
            icon: '🖥️',
          }
        ] : []),
        {
          id: 'r-lan',
          name: 'Rock-Solid Wired Internet',
          spec: 'High-speed 1000Mbps Ethernet — no more patchy Wi-Fi during video meetings',
          type: 'lan',
          tag: 'Fast Internet',
          icon: '🌐',
        },
        {
          id: 'r-usba-1',
          name: 'Dual Accessory USB Ports (x2)',
          spec: 'Neatly plug in your keyboard, mouse, and webcam out of sight',
          type: 'usba',
          tag: 'Desk Peripherals',
          icon: '⌨️',
        },
        {
          id: 'r-dc-in',
          name: 'Clean Desktop Power Input',
          spec: 'Powers all connected screens, hard drives, and laptop safely',
          type: 'power',
          tag: 'Wall Power',
          icon: '🔌',
        }
      ]
    };
  }, [hasDisplayPort, hasDualDisplay, isLegacyA, isMonitor, isCableOrAccessory, product.handle, product.title, wattage]);

  const currentPorts = portsConfig[activeTab] || [];
  const selectedPort = activePort || currentPorts[0] || null;

  return (
    <div className="pdp-port-explorer-card" role="region" aria-label="Interactive Port Diagram and Hardware Explorer">
      {/* Explorer Header */}
      <div className="port-explorer-header">
        <div className="explorer-title-box">
          <div className="explorer-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            <span>Hardware Architecture</span>
          </div>
          <h4>Interactive Port & Pinout Explorer</h4>
          <p className="explorer-sub">
            Hover or tap any port to see maximum resolution, transfer bandwidth, and compatible monitor connectors.
          </p>
        </div>

        {/* Tab Controls (Rear Ports vs Front Ports) */}
        <div className="explorer-tab-controls" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rear'}
            className={`explorer-tab-btn ${activeTab === 'rear' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('rear');
              setActivePort(null);
            }}
          >
            <span>Rear Ports ({portsConfig.rear.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'front'}
            className={`explorer-tab-btn ${activeTab === 'front' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('front');
              setActivePort(null);
            }}
          >
            <span>Front Ports ({portsConfig.front.length})</span>
          </button>
          <button
            type="button"
            className="mobile-zoom-btn"
            onClick={() => setIsModalOpen(true)}
            aria-label="Open fullscreen port layout modal"
            title="Enlarge Diagram"
          >
            <span>Enlarge ⤢</span>
          </button>
        </div>
      </div>

      {/* Visual Blueprint Diagram Stage */}
      <div className="port-blueprint-stage">
        <div className="chassis-diagram-surface">
          <div className="chassis-header-bar">
            <span className="chassis-label">
              NEXA {product.title.split(' ')[0]} • {activeTab.toUpperCase()} PANEL
            </span>
            <span className="chassis-status-indicator">
              <span className="indicator-led" />
              <span>LIVE PINOUT</span>
            </span>
          </div>

          {/* Interactive Port Grid / Pins */}
          <div className="chassis-ports-row">
            {currentPorts.map((port, idx) => {
              const isSelected = selectedPort?.id === port.id;
              return (
                <button
                  key={port.id}
                  type="button"
                  className={`port-pin-slot ${port.type} ${isSelected ? 'active' : ''}`}
                  onClick={() => setActivePort(port)}
                  onMouseEnter={() => setActivePort(port)}
                  aria-label={`${port.name}: ${port.spec}`}
                >
                  <span className="pin-number">0{idx + 1}</span>
                  <div className="port-icon-wrap">
                    <span className="port-emoji">{port.icon}</span>
                  </div>
                  <span className="port-pin-label">{port.tag}</span>
                  {isSelected && <span className="pin-active-glow" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Port Detailed Spec Card */}
        {selectedPort && (
          <div className="port-detail-callout" role="status" aria-live="polite">
            <div className="callout-header">
              <div className="callout-tag-row">
                <span className="callout-chip">{selectedPort.tag}</span>
                <span className="callout-type-badge">{selectedPort.type.toUpperCase()}</span>
              </div>
              <h5 className="callout-title">{selectedPort.name}</h5>
            </div>
            <p className="callout-desc">{selectedPort.spec}</p>

            {/* Hardware Compatibility Advice Tag */}
            <div className="callout-compat-footer">
              <span className="compat-bullet">💡 Recommendation:</span>
              <span className="compat-text">
                {selectedPort.type === 'video'
                  ? 'Connect directly to your HDMI or DisplayPort monitor for native 4K refresh rates without latency.'
                  : selectedPort.type === 'host'
                  ? `Plug the included Thunderbolt / USB-C cable here to charge your laptop up to ${wattage > 0 ? wattage : 100}W.`
                  : selectedPort.type === 'lan'
                  ? 'Plug in your router cable for maximum stability during video calls and large file transfers.'
                  : 'Plug & Play compatible with zero drivers needed.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Zoom-to-fit Modal */}
      {isModalOpen && (
        <div
          className="port-modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size Port Blueprint Modal"
        >
          <div className="port-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="port-modal-header">
              <h5>{product.title} • Complete Port Blueprint</h5>
              <button
                type="button"
                className="port-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="port-modal-body">
              <div className="modal-section">
                <h6>Rear Panel Ports</h6>
                <div className="modal-ports-list">
                  {portsConfig.rear.map((p, i) => (
                    <div key={p.id} className="modal-port-item">
                      <span className="item-idx">R0{i + 1}</span>
                      <div className="item-text">
                        <strong>{p.name}</strong>
                        <span>{p.spec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h6>Front Panel Ports</h6>
                <div className="modal-ports-list">
                  {portsConfig.front.map((p, i) => (
                    <div key={p.id} className="modal-port-item">
                      <span className="item-idx">F0{i + 1}</span>
                      <div className="item-text">
                        <strong>{p.name}</strong>
                        <span>{p.spec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
