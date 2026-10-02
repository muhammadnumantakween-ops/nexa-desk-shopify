import {Link, useLoaderData} from 'react-router';

/**
 * Standard legal fallbacks conforming to UK e-commerce regulations & DESIGN.md
 */
const FALLBACK_POLICIES = {
  shippingPolicy: {
    title: 'UK Shipping & Delivery Policy',
    body: `
      <h2>Free UK Express Shipping on Orders Over £300</h2>
      <p>All orders shipped within mainland United Kingdom qualify for <strong>FREE Next-Working-Day Delivery</strong> when the order subtotal is £300 or more. For orders under £300, standard UK tracked shipping is £7.95.</p>

      <h2>Same-Day UK Dispatch (3:00 PM Cutoff)</h2>
      <p>Every order placed before <strong>3:00 PM GMT</strong> (Monday through Friday) is inspected, packed, and dispatched the exact same day from our Northamptonshire logistics hub.</p>

      <h2>Trusted Courier Partners</h2>
      <ul>
        <li><strong>Royal Mail Tracked 24:</strong> Typically delivered within 24 to 48 hours with SMS and email tracking updates.</li>
        <li><strong>DPD Carbon-Neutral Express:</strong> Guaranteed next working day delivery with a 1-hour delivery window notification.</li>
      </ul>
    `,
  },
  refundPolicy: {
    title: '30-Day Money-Back Guarantee & Return Policy',
    body: `
      <h2>30-Day Risk-Free Home & Office Trial</h2>
      <p>We want you to feel 100% confident that your NexaDesk hardware fits your laptop and workspace setup. You may return any undamaged item in its original packaging within <strong>30 days of delivery</strong> for a full refund.</p>

      <h2>Hassle-Free UK Returns</h2>
      <ol>
        <li>Contact our UK support team at <a href="mailto:support@nexadesk.co.uk">support@nexadesk.co.uk</a> with your order number.</li>
        <li>Receive a pre-paid tracked UK return shipping label.</li>
        <li>Drop off your package at any local Post Office or DPD drop-off point.</li>
        <li>Refunds are processed back to your original payment method within 3 business days of return receipt.</li>
      </ol>
    `,
  },
  termsOfService: {
    title: 'Terms of Service',
    body: `
      <h2>Welcome to NexaDesk</h2>
      <p>These terms govern your purchase and use of hardware products sold by NexaDesk Ltd, registered in England & Wales.</p>

      <h2>2-Year Manufacturer Warranty</h2>
      <p>All NexaDesk docking stations, monitors, and precision desktop peripherals are backed by our comprehensive 2-year warranty against hardware defects, power delivery failures, and component malfunction.</p>

      <h2>Pricing & Payment</h2>
      <p>All prices displayed on this storefront are in British Pounds (GBP) and include standard UK VAT. We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay.</p>
    `,
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    body: `
      <h2>Your Privacy Matters</h2>
      <p>NexaDesk Ltd complies strictly with the UK Data Protection Act 2018 and UK GDPR regulations. We never sell, rent, or trade your personal data with third parties.</p>

      <h2>Data We Collect</h2>
      <p>We only collect the essential information required to fulfill your order, process delivery tracking, and provide technical hardware support.</p>
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
      return {policy};
    }

    const fallback = FALLBACK_POLICIES[policyName];
    if (fallback) {
      return {policy: fallback};
    }

    throw new Response('Could not find the policy', {status: 404});
  } catch (error) {
    const fallback = FALLBACK_POLICIES[policyName];
    if (fallback) {
      return {policy: fallback};
    }
    throw new Response('Could not find the policy', {status: 404});
  }
}

export default function Policy() {
  /** @type {LoaderReturnData} */
  const {policy} = useLoaderData();

  return (
    <div className="page-static-wrapper policy-page-wrapper">
      <div className="page-hero-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{policy.title}</span>
        </div>
        <h1 className="page-main-title">{policy.title}</h1>
      </div>

      <div className="page-card-body">
        <main
          dangerouslySetInnerHTML={{__html: policy.body}}
          className="page-prose-content policy-prose-content"
        />
      </div>

      <div className="page-bottom-cta">
        <div className="cta-box-inner">
          <h3>Need Help Finding Compatible Hardware?</h3>
          <p>
            Use our interactive Setup Configurator to match your laptop with certified docks and
            displays.
          </p>
          <Link to="/find-my-setup" className="btn-builder-gold">
            Launch Setup Configurator →
          </Link>
        </div>
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
