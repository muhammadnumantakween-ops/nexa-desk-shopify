import {Link, useLoaderData} from 'react-router';

/**
 * Standard legal fallbacks conforming to UK e-commerce regulations & DESIGN.md
 */
const POLICY_METADATA = {
  shippingPolicy: {
    category: 'Logistics & Fulfilment',
    subtitle: 'Transparent UK delivery rates, same-day dispatch cutoffs, and tracked courier services.',
    stats: [
      {icon: '📦', title: 'Free Over £300', desc: 'Next-day UK express included'},
      {icon: '⏰', title: '3:00 PM Cutoff', desc: 'Same-day depot dispatch Mon–Fri'},
      {icon: '🚚', title: 'Royal Mail & DPD', desc: '100% carbon-neutral tracked delivery'},
    ],
  },
  refundPolicy: {
    category: 'Customer Confidence',
    subtitle: 'Test our hardware on your actual desk with zero risk and free UK return shipping.',
    stats: [
      {icon: '🛡️', title: '30-Day Desk Trial', desc: '100% full money-back guarantee'},
      {icon: '🏷️', title: 'Pre-Paid Labels', desc: 'Free tracked UK drop-off'},
      {icon: '⚡', title: 'Fast Processing', desc: 'Refunds within 3 business days'},
    ],
  },
  privacyPolicy: {
    category: 'Security & Trust',
    subtitle: 'How NexaDesk Ltd safeguards your personal data in strict compliance with UK GDPR.',
    stats: [
      {icon: '🔒', title: 'UK GDPR Compliant', desc: 'Strict data protection compliance'},
      {icon: '🚫', title: 'Never Sold or Shared', desc: 'Zero third-party marketing brokers'},
      {icon: '💳', title: '256-Bit SSL', desc: 'Encrypted checkout transactions'},
    ],
  },
  termsOfService: {
    category: 'Store Agreement',
    subtitle: 'Simple, honest terms governing hardware purchases, warranties, and orders.',
    stats: [
      {icon: '⚖️', title: 'English & Welsh Law', desc: 'Registered UK company standards'},
      {icon: '🔧', title: '2-Year Warranty', desc: 'Unconditional replacement backing'},
      {icon: '💷', title: 'VAT Included', desc: 'Clear transparent GBP pricing'},
    ],
  },
};

const FALLBACK_POLICIES = {
  shippingPolicy: {
    title: 'UK Shipping & Delivery Policy',
    body: `
      <h2>1. Free Express Shipping on Orders Over £300</h2>
      <p>All orders shipped to mainland UK addresses qualify for <strong>FREE Next-Working-Day Express Delivery</strong> when your order total reaches £300 or more. For orders below £300, our flat-rate standard tracked UK courier delivery is £7.95.</p>

      <h2>2. Same-Day UK Dispatch Guarantee (3:00 PM Cutoff)</h2>
      <p>Orders completed Monday through Friday before <strong>3:00 PM GMT</strong> are picked, bench-inspected, and dispatched the exact same afternoon from our central logistics hub in Northamptonshire.</p>

      <h2>3. Premium Tracked Couriers</h2>
      <ul>
        <li><strong>Royal Mail Tracked 24:</strong> Next-day delivery with real-time SMS and email transit alerts.</li>
        <li><strong>DPD Carbon-Neutral Express:</strong> Pinpoint 1-hour delivery time slot sent on the morning of arrival.</li>
      </ul>

      <h2>4. Northern Ireland, Highlands & Islands</h2>
      <p>We deliver across all UK regions. Deliveries to Northern Ireland, the Scottish Highlands, and Isle of Man typically arrive within 2 business days via Royal Mail Tracked 24 at standard delivery rates.</p>
    `,
  },
  refundPolicy: {
    title: '30-Day Money-Back Guarantee & Returns',
    body: `
      <h2>1. 30-Day Risk-Free Desk Trial</h2>
      <p>We want you to experience the clarity of a clean, single-cable workspace firsthand. You may set up, test, and live with any NexaDesk dock, monitor stand, or accessory for <strong>30 days</strong>. If it doesn't transform your productivity, return it for a complete 100% refund.</p>

      <h2>2. Free Pre-Paid UK Return Labels</h2>
      <ol>
        <li>Email our UK support team at <a href="mailto:support@nexadesk.co.uk">support@nexadesk.co.uk</a> with your order number.</li>
        <li>We will instantly generate a pre-paid tracked return postage label for Royal Mail or DPD.</li>
        <li>Drop off your packaged hardware at any local Post Office branch or DPD drop shop.</li>
      </ol>

      <h2>3. Swift Refund Settlement</h2>
      <p>Once scanned into our Northamptonshire depot, your refund will be credited back to your original payment method within 3 business days.</p>
    `,
  },
  termsOfService: {
    title: 'Terms of Service',
    body: `
      <h2>1. About NexaDesk</h2>
      <p>These terms apply to all purchases made from NexaDesk Ltd, a company registered in England and Wales. By placing an order, you agree to these clear and honest conditions of sale.</p>

      <h2>2. Comprehensive 2-Year UK Warranty</h2>
      <p>Every docking station, monitor arm, and cable sold on this storefront is covered by an unconditional <strong>2-year manufacturer hardware warranty</strong> against component defects, power delivery irregularities, and electronic failures.</p>

      <h2>3. Transparent Pricing & Taxes</h2>
      <p>All catalogue prices are shown in British Pounds (GBP) and include standard 20% UK VAT. Full VAT invoices are automatically delivered with order confirmation emails.</p>
    `,
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    body: `
      <h2>1. Your Privacy is Paramount</h2>
      <p>NexaDesk Ltd complies with the UK Data Protection Act 2018 and the UK General Data Protection Regulation (UK GDPR). We hold customer confidentiality to the highest ethical and technical standards.</p>

      <h2>2. Data Collection & Usage</h2>
      <p>We collect only the essential personal details required to process transactions, dispatch shipments, send parcel tracking updates, and provide after-sales hardware support. We never sell, lease, or monetize customer data with external advertising brokers.</p>

      <h2>3. Security Standards</h2>
      <p>All checkout sessions are encrypted via industry-leading 256-bit TLS/SSL protocols. Payment card credentials are tokenized directly by certified PCI-DSS Level 1 payment processors.</p>
    `,
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `NexaDesk | ${data?.policy?.title ?? 'Store Policy'}`}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({params, context}) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(/-([a-z])/g, (_, m1) =>
    m1.toUpperCase(),
  );

  const metaData = POLICY_METADATA[policyName] || {
    category: 'Store Policy',
    subtitle: 'NexaDesk UK operational policies and customer assurances.',
    stats: [],
  };

  try {
    const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
      variables: {
        privacyPolicy: false,
        shippingPolicy: false,
        termsOfService: false,
        refundPolicy: false,
        [policyName]: true,
        language: context.storefront.i18n?.language,
      },
    });

    const policy = data?.shop?.[policyName];

    if (policy && policy.body) {
      return {policy: {...policy, metaData}};
    }

    const fallback = FALLBACK_POLICIES[policyName];
    if (fallback) {
      return {policy: {...fallback, metaData}};
    }

    throw new Response('Could not find the policy', {status: 404});
  } catch (error) {
    const fallback = FALLBACK_POLICIES[policyName];
    if (fallback) {
      return {policy: {...fallback, metaData}};
    }
    throw new Response('Could not find the policy', {status: 404});
  }
}

export default function Policy() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();
  const meta = policy.metaData || {};

  return (
    <div className="impeccable-static-page policy-page-wrapper">
      <div className="ambient-glow ambient-glow-gold" />
      <div className="ambient-glow ambient-glow-cyan" />

      <div className="impeccable-page-container">
        {/* Breadcrumb Navigation */}
        <nav className="luxury-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-active">{policy.title}</span>
        </nav>

        {/* Page Hero Header */}
        <header className="page-luxury-hero">
          {meta.category && (
            <span className="page-luxury-badge">
              <span className="badge-sparkle">✦</span> {meta.category}
            </span>
          )}
          <h1 className="page-luxury-title">{policy.title}</h1>
          {meta.subtitle && (
            <p className="page-luxury-subtitle">{meta.subtitle}</p>
          )}
        </header>

        {/* Trust Badges / Stats Cards */}
        {meta.stats && meta.stats.length > 0 && (
          <div className="policy-stats-strip">
            {meta.stats.map((stat, i) => (
              <div key={i} className="policy-stat-card">
                <span className="policy-stat-icon">{stat.icon}</span>
                <div className="policy-stat-info">
                  <h4 className="policy-stat-title">{stat.title}</h4>
                  <p className="policy-stat-desc">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legal Body Surface */}
        <div className="page-card-surface">
          <main
            dangerouslySetInnerHTML={{__html: policy.body}}
            className="prose-luxury-content"
          />
        </div>

        {/* Bottom Configurator CTA */}
        <section className="luxury-cta-banner">
          <div className="cta-ambient-circle" />
          <div className="cta-inner-layout">
            <div className="cta-text-block">
              <span className="cta-eyebrow">Customer Protection Guarantee</span>
              <h2 className="cta-heading">Ready to Experience NexaDesk?</h2>
              <p className="cta-description">
                Enjoy 30 days to test our docking stations and ergonomics risk-free with free UK returns
                and a 2-year hardware warranty.
              </p>
            </div>
            <div className="cta-action-block">
              <Link to="/find-my-setup" className="btn-luxury-primary">
                Find My Desk Setup →
              </Link>
              <Link to="/collections/all" className="btn-luxury-secondary">
                Browse Catalogue
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
`;
