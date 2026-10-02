/**
 * Simple Benefits Section - "What This Does"
 * Replaces technical specs with everyday language benefits
 */
export function SimpleBenefitsSection({product}) {
  const parseList = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return String(raw).split(',').map((s) => s.trim());
    }
  };

  const titleLower = product?.title?.toLowerCase() || '';
  const typeLower = product?.productType?.toLowerCase() || '';
  const handleLower = product?.handle?.toLowerCase() || '';

  const isDock = titleLower.includes('dock') || typeLower.includes('dock') || handleLower.startsWith('d');
  const isMonitor = titleLower.includes('monitor') || typeLower.includes('monitor') || handleLower.startsWith('m');
  const isCableOrAccessory = !isDock && !isMonitor;

  const wattage = Number(product?.dockChargingOutput?.value || 0);
  const videoOutputs = parseList(product?.dockVideoOutputs?.value);
  const hasDualVideo = videoOutputs.length >= 2 || titleLower.includes('dual');
  const hasVideo = videoOutputs.length > 0;

  const CableIcon = () => (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
      <path d="M7 2c-1.1 0-2 .9-2 2v2h2V4h10v2h2V4c0-1.1-.9-2-2-2H7zm-2 5v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7H5zm3 7h1v2H8v-2zm3-4h2v2h-2V10zm3 4h1v2h-1v-2z" />
    </svg>
  );

  const BatteryIcon = () => (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zm-.34 16H8.67V5.33h6.66v14.67z" />
    </svg>
  );

  const MonitorIcon = () => (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14l4 4v-4h.1c1-.1 1.9-1 1.9-2V5c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2z" />
    </svg>
  );

  const CompatIcon = () => (
    <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );

  const benefits = [];

  if (isDock) {
    benefits.push({
      icon: <CableIcon />,
      title: 'One-Cable Command Center',
      description: 'Plug in one cable to charge your laptop, connect dual monitors, keyboard, mouse, and internet all at once.'
    });

    if (wattage > 0) {
      benefits.push({
        icon: <BatteryIcon />,
        title: `${wattage}W Rapid Laptop Power`,
        description: 'Charges your laptop while you work — keep your bulky manufacturer charger safely packed in your backpack.'
      });
    }

    if (hasDualVideo) {
      benefits.push({
        icon: <MonitorIcon />,
        title: 'Dual 4K Screens Side-by-Side',
        description: 'Plug in two external monitors with crisp, jitter-free video. Spread spreadsheets, code, or video edits with ease.'
      });
    } else if (hasVideo) {
      benefits.push({
        icon: <MonitorIcon />,
        title: 'Ultra-Sharp Monitor Link',
        description: 'Expand your laptop display to a large desktop monitor with instant plug-and-play clarity.'
      });
    }

    benefits.push({
      icon: <CompatIcon />,
      title: 'Universal Apple & PC Fit',
      description: 'Engineered for MacBook Pro, MacBook Air, Dell XPS, Lenovo ThinkPad, and Microsoft Surface laptops.'
    });
  } else if (isMonitor) {
    benefits.push({
      icon: <MonitorIcon />,
      title: '2x More Workspace & Crisp Text',
      description: 'Gives you expansive screen space with sharp text and vivid, accurate colors that reduce eye fatigue all day.'
    });

    benefits.push({
      icon: <CableIcon />,
      title: 'Single-Cable USB-C Input',
      description: 'Sends video from your laptop to the screen while sending charging power back to your battery simultaneously.'
    });

    benefits.push({
      icon: <CompatIcon />,
      title: 'Universal Display Connectivity',
      description: 'Equipped with HDMI, DisplayPort, and USB-C ports to connect any Mac, Windows desktop, or gaming console.'
    });
  } else {
    // Cables & Accessories
    benefits.push({
      icon: <CableIcon />,
      title: 'Certified High-Speed Interconnect',
      description: 'Guaranteed to carry full power and 4K/8K video bandwidth without flickering, stuttering, or dropouts.'
    });

    benefits.push({
      icon: <BatteryIcon />,
      title: '100W Max Fast-Charge Rated',
      description: 'Heavy-gauge internal copper wiring delivers full 100W power safely to your device without overheating.'
    });

    benefits.push({
      icon: <CompatIcon />,
      title: 'Reinforced Metal Strain-Relief',
      description: 'Durable nylon braiding and gold-plated plugs withstand over 15,000 bends for years of reliable daily use.'
    });
  }

  const sectionSubtitle = isDock
    ? 'Designed to replace desktop cable clutter with one seamless plug.'
    : isMonitor
    ? 'Designed for ergonomic comfort and distraction-free clarity.'
    : 'Certified hardware built to link your setup without signal loss.';

  return (
    <section className="benefits-section" aria-label="Product Benefits in Plain English">
      <div className="section-header">
        <h2 className="section-title">In 30 Seconds: What This Does</h2>
        <p className="section-subtitle" style={{color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px'}}>
          {sectionSubtitle}
        </p>
      </div>
      <div className="benefits-grid">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="benefit-card">
            <div className="benefit-icon-svg">{benefit.icon}</div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
