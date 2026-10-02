import {useLoaderData} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {WhatsInTheBoxSection} from '~/components/WhatsInTheBoxSection';
import {SimpleBenefitsSection} from '~/components/SimpleBenefitsSection';
import {CompatibilityWidget} from '~/components/CompatibilityWidget';
import {PortDiagram} from '~/components/PortDiagram';
import {SimpleFAQSection} from '~/components/SimpleFAQSection';
import {StickyProductBar} from '~/components/StickyProductBar';
import {RecommendedProductsSection} from '~/components/RecommendedProductsSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {Route.MetaFunction}
 */
export const meta = ({data}) => {
  const product = data?.product;
  const variant = product?.selectedOrFirstAvailableVariant;

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.descriptionHtml
          ? product.descriptionHtml.replace(/<[^>]*>/g, '').slice(0, 300)
          : product.title,
        image: variant?.image?.url ? [variant.image.url] : undefined,
        offers: {
          '@type': 'Offer',
          price: variant?.price?.amount || '0.00',
          priceCurrency: variant?.price?.currencyCode || 'GBP',
          availability: variant?.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `/products/${product.handle}`,
        },
      }
    : null;

  return [
    {title: `Nexa Desk | ${product?.title ?? 'Product'}`},
    {
      rel: 'canonical',
      href: `/products/${product?.handle}`,
    },
    ...(productSchema
      ? [
          {
            'script:ld+json': productSchema,
          },
        ]
      : []),
  ];
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}, relatedProductsData] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    storefront
      .query(RELATED_PRODUCTS_QUERY)
      .catch((err) => {
        console.error('Failed to load related products:', err);
        return {products: {nodes: []}};
      }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
    allProducts: relatedProductsData?.products?.nodes || [],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {Route.LoaderArgs}
 */
function loadDeferredData({context, params}) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, allProducts = []} = useLoaderData();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  // Metadata parsing for Spec-Sync Callouts
  const parseList = (raw) => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [raw];
    } catch {
      return raw.split(',').map((s) => s.trim());
    }
  };

  const wattage = Number(product.dockChargingOutput?.value || 0);
  const videoOutputs = parseList(product.dockVideoOutputs?.value);
  const videoInputs = parseList(product.monitorVideoInputs?.value);
  const hostConnector = product.hostConnector?.value || '';

  const specPills = [];
  if (wattage > 0) {
    specPills.push(`⚡ ${wattage}W Fast Charge`);
  }
  if (videoOutputs.length > 0) {
    if (videoOutputs.length >= 2 || title.toLowerCase().includes('dual')) {
      specPills.push('🖥️ 2 Screens at Once');
    } else {
      specPills.push(`🖥️ ${videoOutputs[0]} Plug`);
    }
  } else if (videoInputs.length > 0) {
    specPills.push(`🖥️ ${videoInputs.join(' & ')} Ready`);
  } else if (hostConnector) {
    specPills.push(`🔌 ${hostConnector} Cable`);
  }

  return (
    <div className="pdp-root-wrapper">
      <div className="product pdp-page-layout">
        {/* UI-PDP-01: Sticky Spec-Sync Product Gallery */}
      <ProductGallery
        images={product.images?.nodes || []}
        selectedVariantImage={selectedVariant?.image}
        productTitle={title}
        specPills={specPills}
      />
      <div className="product-main pdp-details-sidebar">
        <h1 className="pdp-product-title">{title}</h1>
        <div className="pdp-price-rating-row">
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <span className="pdp-dispatch-tag">In Stock • Free Next-Day UK Delivery</span>
        </div>
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
          product={product}
        />
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
      {/* Explicit JSON-LD Structured Data for Search Engine Crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            offers: {
              '@type': 'Offer',
              price: selectedVariant?.price?.amount || '0.00',
              priceCurrency: selectedVariant?.price?.currencyCode || 'GBP',
              availability: selectedVariant?.availableForSale
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
    </div>

    {/* Below-the-fold extended sections */}
    <div className="pdp-extended-wrapper">
      <div className="pdp-extended-container">
        {/* Benefits Section */}
        <SimpleBenefitsSection product={product} />

        {/* UI-PDP-02: Interactive 'Will It Fit My Device?' Checkbox & Specs */}
        <CompatibilityWidget product={product} />

        {/* UI-PDP-03: Interactive Front & Rear Port Explorer */}
        <PortDiagram product={product} />

        {/* What's Included */}
        <WhatsInTheBoxSection
          productTitle={product.title}
          isDock={!product.productRole?.value?.includes('monitor')}
        />

        {/* FAQ Section */}
        <SimpleFAQSection product={product} />

        {/* Recommended Products */}
        <RecommendedProductsSection
          currentProduct={product}
          allProducts={allProducts}
        />
      </div>
    </div>

    {/* UI-PDP-04: Sticky Bottom Bar with Selected Variant Price, Builder CTA & Add to Cart */}
    <StickyProductBar
      product={product}
      selectedVariant={selectedVariant}
    />
  </div>
);
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    productRole: metafield(namespace: "custom", key: "product_role") {
      value
    }
    supportedOS: metafield(namespace: "custom", key: "supported_operating_systems") {
      value
    }
    hostConnector: metafield(namespace: "custom", key: "host_connector") {
      value
    }
    dockChargingOutput: metafield(namespace: "custom", key: "dock_charging_output") {
      value
    }
    dockVideoOutputs: metafield(namespace: "custom", key: "dock_video_outputs") {
      value
    }
    monitorVideoInputs: metafield(namespace: "custom", key: "monitor_video_inputs") {
      value
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const RELATED_PRODUCTS_QUERY = `#graphql
  query RelatedProducts {
    products(first: 24) {
      nodes {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          nodes {
            id
            url
            altText
          }
        }
        variants(first: 1) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
          }
        }
        productRole: metafield(namespace: "custom", key: "product_role") {
          value
        }
        dockChargingOutput: metafield(namespace: "custom", key: "dock_charging_output") {
          value
        }
        dockVideoOutputs: metafield(namespace: "custom", key: "dock_video_outputs") {
          value
        }
        monitorVideoInputs: metafield(namespace: "custom", key: "monitor_video_inputs") {
          value
        }
      }
    }
  }
`;

/** @typedef {import('./+types/products.$handle').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
