import {useLoaderData, Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * Curated article fallback content for NexaDesk guides
 */
const FALLBACK_ARTICLES = {
  'dual-4k-monitors-mac-guide': {
    title: 'How to Connect Dual 4K Screens to a Mac Without Driver Glitches',
    publishedAt: '2026-09-28T09:00:00Z',
    author: {name: 'NexaDesk UK Engineering Team'},
    tag: 'Mac Hardware',
    readTime: '4 min read',
    image: {
      id: 'art-img-1',
      url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80',
      altText: 'Dual 4K workstation setup with clean cable management',
      width: 1200,
      height: 800,
    },
    contentHtml: `
      <p class="article-lead-paragraph">Connecting two external displays to Apple Silicon (M1/M2/M3/M4) or Intel MacBooks is one of the most common challenges remote workers face.</p>
      
      <h2>Why macOS Handles Dual Displays Differently</h2>
      <p>Unlike Windows machines that support DisplayPort MST (Multi-Stream Transport) daisy-chaining over a single cable, macOS requires separate display streams or Thunderbolt architecture to output extended independent desktops.</p>
      <p>If you connect a standard multi-display USB-C hub to a Mac, both external monitors mirror each other rather than extending your desktop. Many users resort to installing complex third-party DisplayLink software drivers that hog CPU resources and disable HDCP video streaming.</p>

      <h2>The Hardware Solution</h2>
      <p>Our <strong>D2 Link 100 Dual-Screen Flagship Dock</strong> routes dual dedicated 4K@60Hz video channels (HDMI 2.1 + DisplayPort 1.4) with 100W GaN power delivery over a single host cable. No external drivers, no background CPU bloat, and zero latency.</p>

      <h2>Recommended Setup Steps</h2>
      <ol>
        <li>Connect the 100W USB-C host cable to your MacBook Thunderbolt port.</li>
        <li>Plug your primary 4K monitor into the HDMI 2.1 port.</li>
        <li>Plug your secondary display into the DisplayPort 1.4 connection.</li>
        <li>Open <em>System Settings → Displays</em> to arrange your multi-screen layout.</li>
      </ol>
    `,
  },
  'zero-cable-desk-ergonomics': {
    title: 'The Ergonomic Desk Blueprint: Banishing Neck Strain & Cable Clutter',
    publishedAt: '2026-09-25T11:30:00Z',
    author: {name: 'Ergonomics Specialist, NexaDesk UK'},
    tag: 'Ergonomics',
    readTime: '5 min read',
    image: {
      id: 'art-img-2',
      url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
      altText: 'Ergonomic tidy workspace with laptop riser',
      width: 1200,
      height: 800,
    },
    contentHtml: `
      <p class="article-lead-paragraph">Spending 8+ hours a day at your desk shouldn't lead to chronic neck stiffness, shoulder hunching, or a distracting mess of power bricks.</p>

      <h2>1. The Top-Third Eye Level Rule</h2>
      <p>Your primary monitor's upper third should align directly with your horizontal eye line. When looking at a laptop flat on your desk, your cervical spine bears up to 27kg of forward gravitational load. Elevate your screen using an adjustable aluminum riser to keep your spine neutral.</p>

      <h2>2. Single-Cable Power & Docking</h2>
      <p>Eliminate individual charging bricks for your laptop, phone, keyboard, and audio interface. By deploying a central 100W GaN dock under or behind your desk, a single braided cable docks your machine and leaves your tabletop completely clear.</p>

      <h2>3. 90-Degree Forearm Alignment</h2>
      <p>Keep your elbows bent at a relaxed 90–100 degree angle with your wrists straight. Pair an external tactile keyboard with an ergonomic vertical mouse to eliminate forearm pronation and repetitive strain injury (RSI).</p>
    `,
  },
  'usb-c-alt-mode-explained': {
    title: 'USB-C Alt Mode vs Thunderbolt 4: What You Actually Need',
    publishedAt: '2026-09-20T14:15:00Z',
    author: {name: 'NexaDesk UK Engineering Team'},
    tag: 'Specs & Power',
    readTime: '3 min read',
    image: {
      id: 'art-img-3',
      url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      altText: 'Close up of high speed USB-C cable and docking station',
      width: 1200,
      height: 800,
    },
    contentHtml: `
      <p class="article-lead-paragraph">The USB-C connector shape is universal, but the electrical capabilities behind that oval port vary significantly between laptop manufacturers.</p>

      <h2>What is USB-C DisplayPort Alt Mode?</h2>
      <p>DisplayPort Alternate Mode allows a USB-C port to transmit native DisplayPort video signals directly to external screens alongside high-speed USB data and Power Delivery (PD) charging.</p>

      <h2>When Do You Need 100W Power Delivery?</h2>
      <p>Most thin-and-light ultrabooks (such as MacBook Air or Dell XPS 13) require 65W charging. However, workstations with dedicated GPUs (MacBook Pro 16", Lenovo ThinkPad P-series) require 100W PD to prevent battery drainage while rendering video or running complex simulations.</p>
    `,
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `NexaDesk | ${data?.article?.title ?? 'Desk Guide'}`}];
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
 * Load article data with graceful fallback to curated UK guides
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  try {
    const [{blog}] = await Promise.all([
      context.storefront.query(ARTICLE_QUERY, {
        variables: {blogHandle, articleHandle},
      }),
    ]);

    if (blog?.articleByHandle) {
      redirectIfHandleIsLocalized(
        request,
        {
          handle: articleHandle,
          data: blog.articleByHandle,
        },
        {
          handle: blogHandle,
          data: blog,
        },
      );
      return {article: blog.articleByHandle};
    }

    const fallback = FALLBACK_ARTICLES[articleHandle];
    if (fallback) {
      return {
        article: {
          ...fallback,
          handle: articleHandle,
          blog: {handle: blogHandle},
        },
      };
    }

    throw new Response('Article not found', {status: 404});
  } catch (error) {
    const fallback = FALLBACK_ARTICLES[articleHandle];
    if (fallback) {
      return {
        article: {
          ...fallback,
          handle: articleHandle,
          blog: {handle: blogHandle},
        },
      };
    }
    throw new Response('Not found', {status: 404});
  }
}

function loadDeferredData({context}) {
  return {};
}

export default function Article() {
  /** @type {LoaderReturnData} */
  const {article} = useLoaderData();
  const {title, image, contentHtml, author} = article;

  const publishedDate = article.publishedAt
    ? new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(article.publishedAt))
    : 'Recent';

  const tag = article.tag || 'Desk Engineering';
  const readTime = article.readTime || '4 min read';

  return (
    <article className="impeccable-static-page article-page-wrapper">
      <div className="ambient-glow ambient-glow-gold" />
      <div className="ambient-glow ambient-glow-cyan" />

      <div className="impeccable-page-container article-narrow-container">
        {/* Breadcrumb Navigation */}
        <nav className="luxury-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-divider">/</span>
          <Link to="/blogs/journal" className="breadcrumb-link">Desk Tips & Guides</Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-active">{title}</span>
        </nav>

        {/* Article Luxury Hero */}
        <header className="page-luxury-hero article-hero-center">
          <div className="article-pill-group">
            <span className="page-luxury-badge">
              <span className="badge-sparkle">✦</span> {tag}
            </span>
            <span className="read-time-badge">{readTime}</span>
          </div>

          <h1 className="page-luxury-title article-main-headline">{title}</h1>

          <div className="article-author-byline">
            <div className="author-avatar-chip">🇬🇧</div>
            <div className="author-info-text">
              <span className="author-name">{author?.name || 'NexaDesk UK Engineering Team'}</span>
              <span className="article-pub-date">Published on {publishedDate}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {image?.url && (
          <div className="article-cinematic-banner">
            <img
              src={image.url}
              alt={image.altText || title}
              className="cinematic-hero-img"
            />
          </div>
        )}

        {/* Article Prose Surface */}
        <div className="page-card-surface article-reading-surface">
          <main
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="prose-luxury-content article-prose-body"
          />
        </div>

        {/* Bottom Configurator CTA */}
        <section className="luxury-cta-banner">
          <div className="cta-ambient-circle" />
          <div className="cta-inner-layout">
            <div className="cta-text-block">
              <span className="cta-eyebrow">Zero Cable Clutter</span>
              <h2 className="cta-heading">Find Hardware Tested For Your Setup</h2>
              <p className="cta-description">
                Don't guess with dongles. Use our 4-step wizard to find docking stations and
                ergonomic risers engineered to work seamlessly with your exact machine.
              </p>
            </div>
            <div className="cta-action-block">
              <Link to="/find-my-setup" className="btn-luxury-primary">
                Launch Setup Finder →
              </Link>
              <Link to="/blogs/journal" className="btn-luxury-secondary">
                ← Back to All Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
