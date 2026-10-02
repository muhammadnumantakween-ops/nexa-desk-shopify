import {useLoaderData, Link} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * Curated content fallback for NexaDesk UK pages
 * Ensures all navigation links (FAQ, About, etc.) render beautifully even before CMS creation
 */
const FALLBACK_PAGES = {
  'compatibility-faq': {
    title: 'Frequently Asked Questions & Hardware Compatibility',
    body: `
      <div class="faq-accordion-block">
        <div class="faq-item">
          <h3>⚡ Will a 65W or 100W dock damage my laptop if it only needs 45W?</h3>
          <p>No. Modern USB-C Power Delivery (PD 3.0) operates on intelligent hardware handshaking. The dock negotiates with your laptop and delivers only the wattage your battery controller requests. Using a 100W dock on a 45W or 65W ultrabook is 100% safe, runs cooler, and allows faster charging when needed.</p>
        </div>

        <div class="faq-item">
          <h3>🖥️ Can I connect two external 4K displays to an Apple Silicon Mac?</h3>
          <p>Yes, provided you use the correct dock hardware. Base M1/M2/M3 chips natively support one external display over standard USB-C Alt Mode. However, our <strong>D2 Link 100 Flagship Dock</strong> and <strong>D3 Pro 100</strong> are engineered to output discrete video channels without requiring CPU-heavy software display drivers.</p>
        </div>

        <div class="faq-item">
          <h3>🔌 What is the difference between USB-C and USB-A docks?</h3>
          <p>USB-C carries high-bandwidth DisplayPort video, 10Gbps data, and up to 100W charging power simultaneously over one reversible cable. Legacy USB-A ports (like our D4 Connect A) only transmit data and peripheral signals—they cannot charge laptops or output native high-refresh video without display adapters.</p>
        </div>

        <div class="faq-item">
          <h3>📦 What are your UK delivery times and warranty?</h3>
          <p>All orders placed before 3:00 PM GMT ship the same working day from our Northamptonshire hub via Royal Mail Tracked 24 or DPD. All desk orders over £300 qualify for free express delivery. Every hardware product includes an unconditional 2-year UK warranty and a 30-day home trial period.</p>
        </div>
      </div>
    `,
  },
  about: {
    title: 'About NexaDesk UK',
    body: `
      <div class="about-company-block">
        <p class="about-lead">We believe that a tidy, well-engineered workspace transforms daily productivity, eliminates cognitive fatigue, and prevents chronic neck and wrist strain.</p>

        <h3>Our UK Mission</h3>
        <p>Founded by workspace ergonomics and hardware engineers in Northamptonshire, NexaDesk was built to solve the frustration of messy dongles, incompatible USB cables, and confusing display protocols.</p>

        <h3>The NexaDesk Difference</h3>
        <ul>
          <li><strong>Tested & Certified:</strong> Every dock, monitor, and stand in our catalogue is cross-tested against modern Windows, macOS, and Linux hardware.</li>
          <li><strong>Zero Guesswork:</strong> Our interactive Setup Configurator checks voltage, wattage, and video bandwidth before you order.</li>
          <li><strong>Same-Day UK Dispatch:</strong> Stocked directly in our UK fulfillment centre with rapid 24h delivery.</li>
        </ul>
      </div>
    `,
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

  return (
    <div className="page-static-wrapper">
      <div className="page-hero-header">
        <div className="page-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{page.title}</span>
        </div>
        <h1 className="page-main-title">{page.title}</h1>
      </div>

      <div className="page-card-body">
        <main
          dangerouslySetInnerHTML={{__html: page.body}}
          className="page-prose-content"
        />
      </div>

      <div className="page-bottom-cta">
        <div className="cta-box-inner">
          <h3>Need Help Finding the Right Hardware?</h3>
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
