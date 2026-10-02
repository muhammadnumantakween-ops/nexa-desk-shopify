import {Link, useLoaderData} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * Editorial workspace guides & tips fixture for NexaDesk UK
 */
const FALLBACK_BLOGS = {
  journal: {
    title: 'NexaDesk Journal & Workspace Guides',
    handle: 'journal',
    description: 'Expert UK advice on ergonomic desk posture, dual-screen productivity, and cable management.',
    articles: {
      nodes: [
        {
          id: 'gid://shopify/Article/guide-1',
          handle: 'dual-4k-monitors-mac-guide',
          title: 'How to Connect Dual 4K Screens to a Mac Without Driver Glitches',
          publishedAt: '2026-09-28T09:00:00Z',
          excerpt: 'Why macOS handles multi-stream transport (MST) differently from Windows, and how our D2 Link 100 dock solves it with clean hardware dual-output feeds.',
          contentHtml: `
            <p>Connecting two external displays to Apple Silicon (M1/M2/M3/M4) or Intel MacBooks is one of the most common challenges remote workers face.</p>
            <h3>Why macOS Handles Dual Displays Differently</h3>
            <p>Unlike Windows machines that support DisplayPort MST (Multi-Stream Transport) daisy-chaining over a single cable, macOS requires separate display streams or Thunderbolt architecture to output extended independent desktops.</p>
            <h3>The NexaDesk Solution</h3>
            <p>Our <strong>D2 Link 100 Dual-Screen Flagship Dock</strong> routes dual dedicated 4K@60Hz video channels with 100W GaN power delivery over a single USB-C cable—eliminating messy external DisplayLink software drivers.</p>
          `,
          image: {
            id: 'art-img-1',
            url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/dual_monitor_setup.jpg?v=1',
            altText: 'Dual 4K workstation setup with clean cable management',
            width: 1200,
            height: 800,
          },
          author: {name: 'NexaDesk UK Engineering Team'},
          blog: {handle: 'journal'},
        },
        {
          id: 'gid://shopify/Article/guide-2',
          handle: 'zero-cable-desk-ergonomics',
          title: 'The Ergonomic Desk Blueprint: Banishing Neck Strain & Cable Clutter',
          publishedAt: '2026-09-25T11:30:00Z',
          excerpt: 'Learn the 90-degree arm angle rule, monitor eye-level alignment, and why single-cable docking improves daily focus.',
          contentHtml: `
            <p>Spending 8+ hours a day at your desk shouldn't lead to chronic neck stiffness or a tangle of charging cords.</p>
            <h3>1. The Eye-Level Monitor Rule</h3>
            <p>Your primary screen’s top third should sit directly at eye level. Pair our adjustable aluminum laptop stands with an external monitor to maintain healthy spinal alignment.</p>
            <h3>2. 100W Clean Power Delivery</h3>
            <p>Consolidate your heavy OEM charging brick and video dongles into a single desktop dock that charges your laptop and powers all peripherals simultaneously.</p>
          `,
          image: {
            id: 'art-img-2',
            url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/ergonomic_desk_workspace.jpg?v=1',
            altText: 'Ergonomic tidy workspace with laptop riser',
            width: 1200,
            height: 800,
          },
          author: {name: 'Ergonomics Specialist, NexaDesk UK'},
          blog: {handle: 'journal'},
        },
        {
          id: 'gid://shopify/Article/guide-3',
          handle: 'usb-c-alt-mode-explained',
          title: 'USB-C Alt Mode vs Thunderbolt 4: What You Actually Need',
          publishedAt: '2026-09-20T14:15:00Z',
          excerpt: 'A plain-English guide decoding charging wattages, DisplayPort Alt Mode bandwidth, and matching the right dock to your laptop.',
          contentHtml: `
            <p>Not all USB-C ports on laptops are created equal. Some carry high-speed data only, while others deliver DisplayPort video and 100W bi-directional charging.</p>
            <p>We test every NexaDesk hardware component in our UK depot to guarantee 100% plug-and-play compliance with Windows and macOS laptops.</p>
          `,
          image: {
            id: 'art-img-3',
            url: 'https://cdn.shopify.com/s/files/1/0688/1755/1584/files/usb_c_cables_dock.jpg?v=1',
            altText: 'Close up of high speed USB-C cable and docking station',
            width: 1200,
            height: 800,
          },
          author: {name: 'NexaDesk UK Engineering Team'},
          blog: {handle: 'journal'},
        },
      ],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: '1',
        endCursor: '3',
      },
    },
  },
};

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `NexaDesk | ${data?.blog?.title ?? 'Desk Tips & Guides'}`}];
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
 * Load data necessary for rendering content above the fold.
 * Gracefully falls back to curated editorial guides if the blog or articles
 * haven't been created yet in the Shopify admin.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, request, params}) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 6,
  });

  const requestedHandle = params.blogHandle || 'journal';

  try {
    const data = await context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: requestedHandle,
        ...paginationVariables,
      },
    });

    const blog = data?.blog;

    if (blog && blog.articles && blog.articles.nodes && blog.articles.nodes.length > 0) {
      redirectIfHandleIsLocalized(request, {handle: requestedHandle, data: blog});
      return {blog};
    }

    // If Shopify returned an empty blog or no articles, fall back to our editorial guide collection
    const fallback = FALLBACK_BLOGS[requestedHandle] || FALLBACK_BLOGS.journal;
    return {
      blog: {
        ...fallback,
        handle: requestedHandle,
      },
    };
  } catch (error) {
    console.error('Failed to load blog from Shopify storefront API, using curated fallback:', error);
    const fallback = FALLBACK_BLOGS[requestedHandle] || FALLBACK_BLOGS.journal;
    return {
      blog: {
        ...fallback,
        handle: requestedHandle,
      },
    };
  }
}

function loadDeferredData({context}) {
  return {};
}

export default function Blog() {
  /** @type {LoaderReturnData} */
  const {blog} = useLoaderData();
  const articles = blog?.articles || {nodes: []};

  return (
    <div className="page-blog-wrapper">
      <div className="blog-hero-header">
        <div className="blog-breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Desk Tips & Guides</span>
        </div>
        <span className="blog-badge-pill">💡 Workspace Ergonomics & Engineering Guides</span>
        <h1 className="blog-main-title">{blog.title}</h1>
        <p className="blog-lead-text">
          {blog.description ||
            'Honest, practical guidance on setting up dual monitors, eradicating cable clutter, and maximizing your desk comfort.'}
        </p>
      </div>

      <div className="blog-articles-container">
        {articles.nodes && articles.nodes.length > 0 ? (
          <div className="blog-cards-grid">
            {articles.nodes.map((article, index) => (
              <ArticleCard
                article={article}
                key={article.id || index}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <div className="blog-empty-box">
            <h3>No articles published yet</h3>
            <p>Check back soon for new guides and desk advice from our UK engineering team.</p>
            <Link to="/" className="btn-return-home">
              Return to Store
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Builder CTA */}
      <div className="blog-bottom-cta">
        <div className="cta-content">
          <h3>Ready to upgrade your desk setup?</h3>
          <p>
            Use our interactive setup builder to find certified docks and displays that work
            flawlessly with your exact laptop model.
          </p>
          <Link to="/find-my-setup" className="btn-builder-gold">
            Launch Setup Configurator →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({article, loading}) {
  const publishedAt = article.publishedAt
    ? new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(article.publishedAt))
    : 'Recent';

  const blogHandle = article.blog?.handle || 'journal';

  return (
    <article className="blog-card-item">
      <Link
        to={`/blogs/${blogHandle}/${article.handle}`}
        className="blog-card-media-box"
        prefetch="intent"
      >
        {article.image?.url ? (
          <img
            src={article.image.url}
            alt={article.image.altText || article.title}
            loading={loading}
            className="blog-card-img"
          />
        ) : (
          <div className="blog-card-placeholder-img">
            <span style={{fontSize: '2.5rem'}}>🖥️</span>
          </div>
        )}
        <span className="blog-card-date-badge">{publishedAt}</span>
      </Link>

      <div className="blog-card-body">
        <h2 className="blog-card-title">
          <Link to={`/blogs/${blogHandle}/${article.handle}`} prefetch="intent">
            {article.title}
          </Link>
        </h2>
        {article.excerpt && <p className="blog-card-excerpt">{article.excerpt}</p>}
        <div className="blog-card-footer">
          <span className="blog-author-tag">{article.author?.name || 'NexaDesk Engineering'}</span>
          <Link to={`/blogs/${blogHandle}/${article.handle}`} className="blog-read-more-link">
            Read Guide →
          </Link>
        </div>
      </div>
    </article>
  );
}

const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
`;
