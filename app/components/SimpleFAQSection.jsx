import {useState, useMemo} from 'react';

/**
 * Helper to safely parse JSON arrays or comma-delimited strings from Shopify metafields
 */
function parseMetafieldList(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

/**
 * Resolves product category role: 'dock', 'monitor', 'stand', 'keyboard', 'mouse', or 'accessory'
 */
function resolveProductRole(product) {
  const roleVal = product?.productRole?.value?.toLowerCase() || '';
  if (roleVal.includes('dock') || roleVal.includes('hub')) return 'dock';
  if (roleVal.includes('monitor') || roleVal.includes('screen')) return 'monitor';
  if (roleVal.includes('stand') || roleVal.includes('riser')) return 'stand';
  if (roleVal.includes('keyboard')) return 'keyboard';
  if (roleVal.includes('mouse')) return 'mouse';

  const title = (product?.title || '').toLowerCase();
  const handle = (product?.handle || '').toLowerCase();
  const productType = (product?.productType || '').toLowerCase();

  if (handle.startsWith('d') || title.includes('link') || title.includes('dock') || title.includes('hub') || productType.includes('dock')) {
    return 'dock';
  }
  if (handle.startsWith('m') || title.includes('monitor') || title.includes('screen') || title.includes('display') || productType.includes('monitor')) {
    return 'monitor';
  }
  if (handle.startsWith('s') || title.includes('stand') || productType.includes('stand')) {
    return 'stand';
  }
  if (title.includes('keyboard') || productType.includes('keyboard')) {
    return 'keyboard';
  }
  if (title.includes('mouse') || productType.includes('mouse')) {
    return 'mouse';
  }

  return 'dock'; // default fallback for NexaDesk core collection
}

/**
 * Dynamic FAQ Section - Contextual, spec-driven answers per product
 */
export function SimpleFAQSection({product}) {
  const [openIdx, setOpenIdx] = useState(0);

  const role = resolveProductRole(product);

  const faqs = useMemo(() => {
    const title = product?.title || 'This product';
    const chargingWatts = product?.dockChargingOutput?.value || (title.includes('100') ? '100' : '65');
    const hostConnector = product?.hostConnector?.value || (title.includes('USB-A') ? 'USB-A' : 'USB-C');
    const rawVideoOutputs = parseMetafieldList(product?.dockVideoOutputs?.value);
    const videoOutputs = rawVideoOutputs.length > 0 ? rawVideoOutputs.join(' & ') : 'HDMI';
    const rawSupportedOS = parseMetafieldList(product?.supportedOS?.value);
    const supportedOS = rawSupportedOS.length > 0 ? rawSupportedOS.join(' and ') : 'Windows and macOS';
    const rawVideoInputs = parseMetafieldList(product?.monitorVideoInputs?.value);
    const videoInputs = rawVideoInputs.length > 0 ? rawVideoInputs.join(' & ') : 'HDMI & DisplayPort';

    if (role === 'dock') {
      return [
        {
          q: `Will ${title} charge my laptop while connected?`,
          a: `Yes! It provides up to ${chargingWatts}W Power Delivery through its ${hostConnector} host connection. That delivers full-speed charging to your laptop battery while simultaneously transmitting high-definition video, audio, and USB peripherals through a single cable.`,
        },
        {
          q: `What monitors and screens can I connect?`,
          a: `This model features dedicated ${videoOutputs} output ports. You can connect modern monitors running up to 4K resolution at 60Hz. Standard HDMI or DisplayPort cables plug directly in without requiring additional dongles.`,
        },
        {
          q: `Does it work with ${supportedOS}?`,
          a: `Yes, officially verified and certified for ${supportedOS}. Simply connect the host cable to your computer and it starts working immediately with plug-and-play simplicity.`,
        },
        {
          q: 'Do I need to install drivers or configure software?',
          a: 'Nope! It is 100% driver-free and hardware plug-and-play. Your laptop or desktop operating system automatically configures the ports within seconds.',
        },
        {
          q: 'Will it keep cool and fit on my desk?',
          a: 'Engineered with an aerospace-grade anodised aluminum chassis that naturally dissipates heat without noisy fans. Its slim, low-profile footprint fits neatly under monitors or alongside laptop stands.',
        },
        {
          q: 'What warranty and delivery coverage is included?',
          a: 'Every unit includes our 2-Year NexaDesk UK Warranty, 30-Day Risk-Free Trial, and Free Tracked UK Delivery on orders over £300 (or £7.95 standard dispatched in 24h).',
        },
      ];
    }

    if (role === 'monitor') {
      return [
        {
          q: `What video inputs does ${title} have?`,
          a: `It comes equipped with ${videoInputs} input ports. This makes it compatible with any modern workstation dock, desktop PC, MacBook, or gaming console.`,
        },
        {
          q: 'What is the screen resolution and visual clarity?',
          a: 'Provides ultra-crisp 4K UHD clarity with accurate color reproduction, wide 178° viewing angles, and flicker-free anti-glare coating to eliminate eye strain during long working sessions.',
        },
        {
          q: 'Is the height and angle adjustable?',
          a: 'Yes, features a heavy-duty ergonomic tilt and height-adjustable stand. It also includes standard VESA 100x100 mounting holes for single or dual monitor arms.',
        },
        {
          q: 'Are video cables included in the box?',
          a: 'Yes! We include high-speed video cables and the UK power lead in the box so you can plug in and begin working immediately.',
        },
        {
          q: 'Is this screen suitable for gaming and casual entertainment?',
          a: 'Definitely. With rapid pixel response times, smooth refresh rates, and HDR contrast, it delivers vivid visuals for movies, console gaming, and PC gaming alongside productivity.',
        },
      ];
    }

    if (role === 'stand') {
      return [
        {
          q: 'What laptop sizes and weights are supported?',
          a: 'Designed to support laptops from 11" up to 17" (including heavy 16" MacBook Pros and 17" mobile workstations) with high-tensile aluminum and non-slip silicone pads.',
        },
        {
          q: 'Does it improve laptop cooling and airflow?',
          a: 'Yes, elevates your computer above the desk surface allowing 360° airflow around heat vents, reducing thermal throttling and keeping fan noise minimal.',
        },
        {
          q: 'Is it adjustable to eye level?',
          a: 'Features multi-angle ergonomic articulation allowing you to align your laptop screen directly at eye level to prevent neck and back fatigue.',
        },
      ];
    }

    // Default accessory / gear FAQ
    return [
      {
        q: 'Is this compatible with NexaDesk docks and setups?',
        a: '100% compatible and tested across all NexaDesk workstation docking stations, monitors, and laptop profiles.',
      },
      {
        q: 'What warranty and returns apply?',
        a: 'Backed by our 2-Year UK Warranty and 30-Day Money-Back Guarantee with hassle-free UK returns.',
      },
    ];
  }, [product, role]);

  return (
    <section className="faq-section">
      <div className="section-header">
        <h2 className="section-title">Common Questions</h2>
        <p className="section-subtitle">Real answers for real people</p>
      </div>

      <div className="faq-accordion">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`faq-item ${openIdx === idx ? 'open' : ''}`}
          >
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              aria-expanded={openIdx === idx}
            >
              <span>{faq.q}</span>
              <span className="faq-toggle">▼</span>
            </button>
            <div className="faq-answer">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
