import {useState} from 'react';
import {useLoaderData, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * Curated content fallback for NexaDesk UK pages
 * Ensures all navigation links (FAQ, About, etc.) render beautifully even before CMS creation
 */
const FAQ_ITEMS = [
  {
    q: 'Will a 65W or 100W dock damage my laptop if it only requires 45W?',
    category: 'Power & Charging',
    a: 'No, absolutely not. Modern USB-C Power Delivery (PD 3.0) operates through intelligent hardware handshaking. The dock negotiates with your laptop and delivers only the exact wattage requested by your battery management controller. Using a 100W GaN dock on a 45W or 65W ultrabook is 100% safe, runs cooler, and provides head-room for future upgrades.',
  },
  {
    q: 'Can I connect dual 4K external displays to Apple Silicon (M1/M2/M3/M4)?',
    category: 'Displays & Video',
    a: 'Yes, provided you pair with the right dock architecture. Base M1, M2, and M3 chips natively support only one external screen via USB-C Alt Mode. However, our D2 Link 100 and D3 Pro 100 docks feature discrete dual hardware display controllers that deliver two fully extended 4K@60Hz desktops without laggy or driver-heavy DisplayLink software.',
  },
  {
    q: 'What is the practical difference between USB-C and USB-A docks?',
    category: 'Cables & Connectivity',
    a: 'USB-C carries high-bandwidth DisplayPort 1.4/2.1 video, 10Gbps high-speed data, and up to 100W bi-directional power delivery all across a single reversible cable. Legacy USB-A ports (such as our D4 Connect A) only transmit data and peripheral signals; they cannot charge your laptop battery or output uncompressed video natively.',
  },
  {
    q: 'What are your UK dispatch times, couriers, and delivery costs?',
    category: 'Shipping & Warranty',
    a: 'All orders placed before 3:00 PM GMT (Monday–Friday) are dispatched the very same day from our Northamptonshire fulfilment centre. Orders over £300 qualify for FREE Next-Working-Day Delivery via Royal Mail Tracked 24 or DPD Carbon-Neutral. For smaller orders, tracked UK delivery is £7.95.',
  },
  {
    q: 'How does the 30-Day Desk Trial and 2-Year Warranty work?',
    category: 'Guarantee & Returns',
    a: 'Every NexaDesk dock, stand, and monitor comes with a 30-Day Risk-Free Trial. Set it up on your actual desk, test it with your monitors and daily workflow, and if you are not completely satisfied, return it for a 100% full refund with prepaid UK return shipping. Additionally, every hardware product includes our comprehensive 2-year UK replacement warranty.',
  },
];

const FALLBACK_PAGES = {
  'compatibility-faq': {
    title: 'Frequently Asked Questions & Hardware Compatibility',
    category: 'Technical Support & Desk FAQs',
    subtitle: 'Clear, engineering-backed answers on laptop wattage, multi-monitor setups, and single-cable docking.',
    isFaq: true,
  },
  about: {
    title: 'About NexaDesk UK',
    category: 'Our Heritage & Philosophy',
    subtitle: 'Engineered in the UK to eliminate dongle clutter and build serene, ergonomic workspaces.',
    isAbout: true,
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `NexaDesk | ${data?.page?.title ?? 'Workspace Info'}`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

/**
 * Load page data with fallback support
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  const handle = params.handle || 'about';

  try {
    const data = await context.storefront.query(PAGE_QUERY, {
      variables: {
        handle,
      },
    });

    const page = data?.page;

    if (page && page.body) {
      redirectIfHandleIsLocalized(request, {handle, data: page});
      return {page};
    }

    // Check curated fallback
    const fallback = FALLBACK_PAGES[handle];
    if (fallback) {
      return {
        page: {
          ...fallback,
          handle,
          id: `gid://shopify/Page/${handle}`,
        },
      };
    }

    throw new Response('Not Found', {status: 404});
  } catch (error) {
    const fallback = FALLBACK_PAGES[handle];
    if (fallback) {
      return {
        page: {
          ...fallback,
          handle,
          id: `gid://shopify/Page/${handle}`,
        },
      };
    }
    throw new Response('Not Found', {status: 404});
  }
}

function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="impeccable-static-page">
      {/* Background Decorative Ambient Glows */}
      <div className="ambient-glow ambient-glow-gold" />
      <div className="ambient-glow ambient-glow-cyan" />

      <div className="impeccable-page-container">
        {/* Breadcrumb Navigation */}
        <nav className="luxury-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-active">{page.title}</span>
        </nav>

        {/* Page Hero Header */}
        <header className="page-luxury-hero">
          {page.category && (
            <span className="page-luxury-badge">
              <span className="badge-sparkle">✦</span> {page.category}
            </span>
          )}
          <h1 className="page-luxury-title">{page.title}</h1>
          {page.subtitle && (
            <p className="page-luxury-subtitle">{page.subtitle}</p>
          )}
        </header>

        {/* Main Content Area */}
        {page.isFaq ? (
          <div className="faq-interactive-showcase">
            <div className="faq-quick-stats">
              <div className="faq-stat-pill">
                <span className="stat-icon">⚡</span>
                <span className="stat-text">100W GaN Safe</span>
              </div>
              <div className="faq-stat-pill">
                <span className="stat-icon">🖥️</span>
                <span className="stat-text">Dual 4K Ready</span>
              </div>
              <div className="faq-stat-pill">
                <span className="stat-icon">🇬🇧</span>
                <span className="stat-text">Same-Day UK Dispatch</span>
              </div>
              <div className="faq-stat-pill">
                <span className="stat-icon">🛡️</span>
                <span className="stat-text">2-Year UK Warranty</span>
              </div>
            </div>

            <div className="faq-accordion-list">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`faq-accordion-card ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-card-header"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-question-content">
                        <span className="faq-category-label">{item.category}</span>
                        <h3 className="faq-question-title">{item.q}</h3>
                      </div>
                      <div className="faq-toggle-icon">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line
                            x1="5"
                            y1="12"
                            x2="19"
                            y2="12"
                            className="faq-icon-horizontal"
                          ></line>
                        </svg>
                      </div>
                    </button>
                    {isOpen && (
                      <div className="faq-card-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : page.isAbout ? (
          <div className="about-showcase-grid">
            <div className="about-hero-card">
              <div className="about-manifesto">
                <span className="about-tag">Engineered in the UK</span>
                <h2>One Cable. Zero Clutter. Uncompromised Power.</h2>
                <p className="about-lead-para">
                  We believe your desk should be a sanctuary of focus—not a chaotic web of tangled
                  power bricks, buzzing video adapters, and awkward laptop dongles.
                </p>
                <p>
                  Founded by hardware and workplace ergonomics specialists in Northamptonshire,
                  NexaDesk designs unified single-cable workstations that pair high-bandwidth 4K video,
                  ultra-reliable 10Gbps data, and intelligent 100W GaN power delivery.
                </p>
              </div>
            </div>

            {/* Core Values 3-Column Grid */}
            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="pillar-icon-box">⚡</div>
                <h3>100% Hardware Certified</h3>
                <p>
                  Every docking station, riser, and cable in our catalogue is rigorously bench-tested
                  with macOS, Windows 11, and Linux hardware to ensure 100% plug-and-play reliability.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box">🛡️</div>
                <h3>2-Year UK Warranty</h3>
                <p>
                  We stand by the engineering caliber of every component. If anything fails under
                  normal workspace operation, our UK depot provides immediate replacement support.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box">📦</div>
                <h3>Next-Day Delivery</h3>
                <p>
                  Stocked locally in Northamptonshire. Orders placed before 3:00 PM GMT dispatch
                  the same afternoon with full Royal Mail Tracked 24 and DPD notifications.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="page-card-surface">
            <main
              dangerouslySetInnerHTML={{__html: page.body}}
              className="prose-luxury-content"
            />
          </div>
        )}

        {/* Premium Bottom Configurator CTA */}
        <section className="luxury-cta-banner">
          <div className="cta-ambient-circle" />
          <div className="cta-inner-layout">
            <div className="cta-text-block">
              <span className="cta-eyebrow">Interactive Compatibility Wizard</span>
              <h2 className="cta-heading">Find Hardware That Fits Your Exact Laptop</h2>
              <p className="cta-description">
                Answer 4 quick questions about your monitors and laptop to generate a guaranteed
                single-cable workstation bundle with zero driver headaches.
              </p>
            </div>
            <div className="cta-action-block">
              <Link to="/find-my-setup" className="btn-luxury-primary">
                Launch Setup Finder →
              </Link>
              <Link to="/compare" className="btn-luxury-secondary">
                Compare Docks Side-by-Side
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
