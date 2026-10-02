/**
 * Module D: Interactive 'What's in the Box' Unboxing Gallery
 *
 * Visual unboxing blueprint showing included items with professional SVG icons
 *
 * @param {{
 *   productTitle: string;
 *   isDock: boolean;
 * }}
 */
export function WhatsInTheBoxSection({productTitle, isDock = true}) {
  const DockIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H4V5h16v12zm-6 4h-4v2h4v-2z"/>
    </svg>
  );

  const CableIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M7.02 2c-1.1 0-2 .9-2 2v2h2V4h10v2h2V4c0-1.1-.9-2-2-2H7.02zM5 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7H5zm3 7h1v2H8v-2zm3-4h2v2h-2v-2zm3 4h1v2h-1v-2z"/>
    </svg>
  );

  const PowerIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
    </svg>
  );

  const GuideIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10h-8v2h8v-2zm0-3h-8v2h8V9zm0-3H6v2h10V6z"/>
    </svg>
  );

  const MonitorIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14l4 4v-4h.1c1-.1 1.9-1 1.9-2V5c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2z"/>
    </svg>
  );

  const StandIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-6 3h-2v2h2v-2z"/>
    </svg>
  );

  const titleLower = productTitle.toLowerCase();
  const isMonitor = titleLower.includes('monitor') || (!isDock && titleLower.includes('screen'));
  const isCableOrAccessory = !isDock && !isMonitor;

  const DOCK_BOX_ITEMS = [
    {
      num: '01',
      title: `${productTitle} Docking Station`,
      spec: 'Heavy-duty aluminum unibody. Stays cool and looks clean on your desk.',
      icon: <DockIcon />,
    },
    {
      num: '02',
      title: 'Host USB-C Connection Cable',
      spec: 'High-speed certified cable that delivers power, video, and data in 1 plug.',
      icon: <CableIcon />,
    },
    {
      num: '03',
      title: 'High-Output Power Adapter & UK Plug',
      spec: 'Dedicated isolated power brick for safe laptop battery fast-charging.',
      icon: <PowerIcon />,
    },
    {
      num: '04',
      title: 'Quick-Start Setup Guide & 2-Yr Warranty',
      spec: 'Clear visual instructions. Setup takes less than 2 minutes.',
      icon: <GuideIcon />,
    },
  ];

  const MONITOR_BOX_ITEMS = [
    {
      num: '01',
      title: `${productTitle} Ultra-Sharp Display`,
      spec: 'Anti-glare IPS panel with true-to-life color calibration.',
      icon: <MonitorIcon />,
    },
    {
      num: '02',
      title: 'Ergonomic Counter-Balanced Stand',
      spec: 'Raise, lower, tilt, and swivel to your exact eye-level posture.',
      icon: <StandIcon />,
    },
    {
      num: '03',
      title: 'DisplayPort & HDMI Digital Cables',
      spec: 'High-refresh braided cables included right in the box.',
      icon: <CableIcon />,
    },
    {
      num: '04',
      title: 'Quick Assembly Guide & 2-Yr UK Warranty',
      spec: 'Tool-free latching stand. Assembles in under 3 minutes.',
      icon: <GuideIcon />,
    },
  ];

  const CABLE_BOX_ITEMS = [
    {
      num: '01',
      title: `${productTitle}`,
      spec: 'Reinforced nylon-braided cable with gold-plated connector pins.',
      icon: <CableIcon />,
    },
    {
      num: '02',
      title: 'Silicone Cable Organizer Wrap',
      spec: 'Reusable magnetic wrap to keep your desk free of tangle and clutter.',
      icon: <GuideIcon />,
    },
    {
      num: '03',
      title: 'Protective Dust Caps',
      spec: 'Silicone cap covers to safeguard plugs during travel or storage.',
      icon: <PowerIcon />,
    },
    {
      num: '04',
      title: 'Certification Card & 2-Yr Warranty',
      spec: 'Guaranteed compatibility with all USB-IF and Thunderbolt devices.',
      icon: <GuideIcon />,
    },
  ];

  const items = isDock ? DOCK_BOX_ITEMS : isMonitor ? MONITOR_BOX_ITEMS : CABLE_BOX_ITEMS;

  return (
    <section className="pdp-whats-in-box-section" aria-labelledby="whats-in-box-heading">
      <div className="box-header">
        <span className="box-badge">What You Get</span>
        <h2 id="whats-in-box-heading" className="box-title">
          What's Included
        </h2>
        <p className="box-subtitle">
          Everything you need. No extra shopping. Just unbox and start using.
        </p>
      </div>

      <div className="box-items-grid">
        {items.map((item) => (
          <div key={item.num} className="box-item-tile">
            <div className="box-item-top">
              <span className="box-item-icon-svg" aria-hidden="true">
                {item.icon}
              </span>
              <span className="box-item-num">{item.num}</span>
            </div>
            <h3 className="box-item-title">{item.title}</h3>
            <p className="box-item-spec">{item.spec}</p>
          </div>
        ))}
      </div>

      <div className="box-packaging-note">
        <span className="eco-leaf">🌱</span>
        <span>Packaged responsibly. All materials are recyclable.</span>
      </div>
    </section>
  );
}
