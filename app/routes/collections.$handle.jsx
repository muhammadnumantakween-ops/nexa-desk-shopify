import {useState, useMemo} from 'react';
import {redirect, useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CollectionFilters} from '~/components/CollectionFilters';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {Route.LoaderArgs}
 */
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  // Handle common alias redirects (e.g. docks-and-hubs -> docks-hubs, laptop-stands -> stands)
  const HANDLE_ALIASES = {
    'docks-and-hubs': 'docks-hubs',
    'laptop-stands': 'stands',
  };

  const resolvedHandle = HANDLE_ALIASES[handle] || handle;

  // If a known alias was requested directly, redirect gracefully to the canonical handle
  if (HANDLE_ALIASES[handle]) {
    const url = new URL(request.url);
    url.pathname = `/collections/${resolvedHandle}`;
    throw redirect(url.toString(), 301);
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle: resolvedHandle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();

  // Faceted Search State
  const [filters, setFilters] = useState({
    os: [],
    minWattage: 0,
    ports: [],
    inStockOnly: false,
    sortBy: 'featured',
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Filter updates handler
  const handleFilterChange = (updatedFields) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      os: [],
      minWattage: 0,
      ports: [],
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.os && filters.os.length > 0) count += filters.os.length;
    if (filters.minWattage > 0) count += 1;
    if (filters.ports && filters.ports.length > 0) count += filters.ports.length;
    if (filters.inStockOnly) count += 1;
    return count;
  }, [filters]);

  // Client-side faceted filter & sort calculation
  const rawProducts = collection?.products?.nodes || [];

  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product) => {
      // 1. Stock availability filter
      if (filters.inStockOnly && !product.availableForSale) {
        return false;
      }

      // Helper for metadata parsing
      const parseList = (raw) => {
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [raw];
        } catch {
          return raw.split(',').map((s) => s.trim());
        }
      };

      const supportedOS = parseList(product.supportedOS?.value);
      const wattage = Number(product.dockChargingOutput?.value || 0);
      const videoOutputs = parseList(product.dockVideoOutputs?.value);
      const videoInputs = parseList(product.monitorVideoInputs?.value);
      const hostConnector = product.hostConnector?.value || '';

      // 2. OS Compatibility check
      if (filters.os && filters.os.length > 0) {
        const matchesOS = filters.os.some((selectedOS) => {
          if (selectedOS === 'Universal') return true;
          if (supportedOS.length === 0) return true; // generic accessory
          return supportedOS.some(
            (os) => os.toLowerCase().includes(selectedOS.toLowerCase()),
          );
        });
        if (!matchesOS) return false;
      }

      // 3. Minimum wattage charging check
      if (filters.minWattage > 0) {
        // If it is a dock, check dock charging output
        if (wattage > 0 && wattage < filters.minWattage) {
          return false;
        }
      }

      // 4. Ports & video connectivity check
      if (filters.ports && filters.ports.length > 0) {
        const allPorts = [
          ...videoOutputs,
          ...videoInputs,
          hostConnector,
        ].map((p) => p.toLowerCase());

        const matchesPorts = filters.ports.every((reqPort) => {
          if (reqPort === 'Dual Display') {
            return videoOutputs.length >= 2 || product.title.toLowerCase().includes('dual');
          }
          if (reqPort === 'USB-C') {
            return hostConnector.toLowerCase().includes('usb-c') || allPorts.some((p) => p.includes('usb-c') || p.includes('thunderbolt'));
          }
          return allPorts.some((p) => p.includes(reqPort.toLowerCase()));
        });

        if (!matchesPorts) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = parseFloat(a.priceRange?.minVariantPrice?.amount || '0');
      const priceB = parseFloat(b.priceRange?.minVariantPrice?.amount || '0');
      if (filters.sortBy === 'price-low') return priceA - priceB;
      if (filters.sortBy === 'price-high') return priceB - priceA;
      return 0;
    });
  }, [rawProducts, filters]);

  return (
    <div className="collection-page-layout">
      {/* Collection Hero Header */}
      <header className="collection-hero-banner">
        <div className="collection-hero-inner">
          <nav className="collection-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/collections">Collections</Link>
            <span aria-hidden="true">/</span>
            <span className="current">{collection.title}</span>
          </nav>

          <h1 className="collection-hero-title">{collection.title}</h1>
          {collection.description && (
            <p className="collection-hero-desc">{collection.description}</p>
          )}

          {/* Quick Stats Bar */}
          <div className="collection-meta-bar">
            <span className="meta-pill">
              <span className="meta-dot pulse" />
              <span>UK Hub • 24h Free Delivery on £300+</span>
            </span>
            <span className="meta-pill-outline">
              1-Cord Plug &amp; Play Guaranteed
            </span>
          </div>
        </div>
      </header>

      {/* Main Faceted Discovery Layout: Sticky Sidebar + Products Grid */}
      <div className="collection-discovery-container">
        {/* Mobile & Desktop Filter Toggle & Quick Sorter Bar */}
        <div className="collection-toolbar-row">
          <div className="toolbar-left-group">
            {/* Mobile Filter Sheet Button */}
            <button
              type="button"
              className="mobile-filter-open-trigger"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-expanded={isMobileDrawerOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="trigger-badge">{activeFilterCount}</span>
              )}
            </button>

            {/* Desktop Show / Hide Filter Panel Button */}
            <button
              type="button"
              className="desktop-filter-toggle-btn"
              onClick={() => setIsSidebarVisible((prev) => !prev)}
              aria-expanded={isSidebarVisible}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>{isSidebarVisible ? 'Hide Filters' : 'Show Filters'}</span>
              {activeFilterCount > 0 && (
                <span className="trigger-badge">{activeFilterCount}</span>
              )}
            </button>

            <div className="toolbar-stats-text">
              Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          <div className="toolbar-sort-wrap">
            <label htmlFor="collection-sort-select" className="sort-label">Sort by:</label>
            <select
              id="collection-sort-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({sortBy: e.target.value})}
              className="collection-sort-select"
            >
              <option value="featured">Featured Workstations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid: Sticky Sidebar + Products Showcase */}
        <div className={`collection-main-layout ${!isSidebarVisible ? 'sidebar-hidden' : ''}`}>
          {/* UI-COL-01 Sticky Faceted Sidebar & Mobile Bottom Sheet */}
          <CollectionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredProducts.length}
            activeFilterCount={activeFilterCount}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible(false)}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
            collectionHandle={collection.handle}
          />

          {/* Products Grid Area */}
          <main className="collection-products-area">
            {filteredProducts.length === 0 ? (
              <div className="empty-filters-box">
                <div className="empty-filters-icon">🔍</div>
                <h3>No setups match these exact filters</h3>
                <p>
                  Try widening your power requirements or clearing specific port selections.
                </p>
                <button
                  type="button"
                  className="empty-reset-btn"
                  onClick={handleResetFilters}
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 6 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 2) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    productRole: metafield(namespace: "nexadesk", key: "product_role") {
      value
    }
    supportedOS: metafield(namespace: "nexadesk", key: "supported_os") {
      value
    }
    hostConnector: metafield(namespace: "nexadesk", key: "host_connector") {
      value
    }
    dockChargingOutput: metafield(namespace: "nexadesk", key: "charging_output_watts") {
      value
    }
    dockVideoOutputs: metafield(namespace: "nexadesk", key: "video_outputs") {
      value
    }
    monitorVideoInputs: metafield(namespace: "nexadesk", key: "video_inputs") {
      value
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
        price {
          ...MoneyProductItem
        }
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
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
`;

/** @typedef {import('./+types/collections.$handle').Route} Route */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
