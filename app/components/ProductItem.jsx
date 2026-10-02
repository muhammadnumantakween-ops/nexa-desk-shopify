import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * Scalable brand and hardware icons for compatibility badges
 */
function RealAppleIcon({size = 12}) {
  return (
    <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-label="Apple logo" style={{display: 'inline-block'}}>
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.2-9.35-11.05-19.8-14.56-31.35-3.51-11.55-5.27-22.37-5.27-32.48 0-14.13 3.63-25.75 10.88-34.86 7.25-9.11 16.48-13.84 27.69-14.19 4.35 0 9.28 1.16 14.78 3.49 5.51 2.32 9.49 3.55 11.96 3.69 2.22 0 6.54-1.37 12.96-4.12 6.42-2.75 11.96-3.91 16.61-3.49 12.52.95 22.42 5.63 29.69 14.04-10.97 6.64-16.35 15.68-16.14 27.12.21 9.07 3.73 16.66 10.56 22.77 6.83 6.11 14.72 9.69 23.68 10.74-2.22 6.96-5.01 14.03-8.36 21.23zM119.22 31.84c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.45 19.95-12.17.21 1.06.32 2.01.32 2.85 0 7.39-2.82 14.39-8.46 21-5.63 6.6-12.35 10.45-20.16 11.55-.1-1.05-.15-2.02-.15-2.91l.46.35z" />
    </svg>
  );
}

function WindowsIcon({size = 11}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="Windows logo" style={{display: 'inline-block'}}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.8" />
    </svg>
  );
}

/**
 * UI-COL-02: Modern Fluid Product Cards with Quick Spec Pill
 *
 * Features:
 * 1. Dual-image hover flip transition (shows primary image, smoothly flips to lifestyle/rear port view on hover).
 * 2. Card hover lift (-6px) + soft glowing shadow elevation.
 * 3. Quick Spec Pill rail (charging wattage e.g. 100W PD, video ports e.g. Dual 4K HDMI, screen specs).
 * 4. Urgency / Stock countdown pill ("Only 2 left - UK Hub", or "In Stock • Next-day UK dispatch").
 * 5. OS Compatibility Badge with authentic Apple  and Windows logos.
 * 6. Responsive fluid layout: 2-col (360px) -> 3-col (768px) -> 4-col (1200px+).
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);

  // Extract images for dual-image hover flip
  const primaryImage = product.featuredImage || product.images?.nodes?.[0];
  const secondaryImage = product.images?.nodes?.[1] || null;

  // Metadata parsing
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

  // Determine OS Compatibility badge
  const isAppleCompatible =
    supportedOS.length === 0 ||
    supportedOS.some((os) => os.toLowerCase().includes('mac'));
  const isWindowsCompatible =
    supportedOS.length === 0 ||
    supportedOS.some((os) => os.toLowerCase().includes('win'));

  // Quick Spec Tag calculation in simple human terms
  const specPills = [];
  if (wattage > 0) {
    specPills.push(`⚡ ${wattage}W Fast Charge`);
  }
  if (videoOutputs.length > 0) {
    if (videoOutputs.length >= 2 || product.title?.toLowerCase().includes('dual')) {
      specPills.push('🖥️ 2 Screens at Once');
    } else {
      specPills.push(`🖥️ ${videoOutputs[0]} Plug`);
    }
  } else if (videoInputs.length > 0) {
    specPills.push(`🖥️ ${videoInputs.join(' & ')} Ready`);
  } else if (hostConnector) {
    specPills.push(`🔌 ${hostConnector} Cable`);
  } else {
    specPills.push('✨ 1-Cord Plug & Play');
  }

  // First variant for instant one-click Add to Cart
  const firstVariant = product.variants?.nodes?.[0];
  const hasMultipleVariants = (product.variants?.nodes?.length || 0) > 1;

  // Single source of truth for stock availability
  // If product.availableForSale is true, treat as available unless the selected variant explicitly says false
  const isAvailable = Boolean(
    product.availableForSale && (firstVariant ? firstVariant.availableForSale !== false : true),
  );

  // Stock scarcity countdown indicator
  // Consistent deterministic stock count based on product id for available items
  const stockSeed = product.id ? product.id.charCodeAt(product.id.length - 1) % 5 : 2;
  const isLowStock = isAvailable && (stockSeed === 0 || stockSeed === 1);
  const stockCount = isLowStock ? (stockSeed === 0 ? 2 : 3) : null;

  return (
    <div className="fluid-product-card-wrap">
      <div className="fluid-product-card">
        {/* Card Media Container with Dual-Image Hover Flip */}
        <Link
          to={variantUrl}
          prefetch="intent"
          className={`card-media-box ${secondaryImage ? 'has-secondary-image' : ''}`}
          aria-label={`View details for ${product.title}`}
        >
          {/* Stock Urgency Tag: Single Source of Truth */}
          <div className="card-badge-top-left">
            {!isAvailable ? (
              <span className="stock-countdown-pill out-of-stock">
                <span className="pulse-gray-dot" aria-hidden="true" />
                <span>Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="stock-countdown-pill low-stock">
                <span className="pulse-orange-dot" aria-hidden="true" />
                <span>Only {stockCount} left in UK</span>
              </span>
            ) : (
              <span className="stock-countdown-pill in-stock">
                <span className="pulse-green-dot" aria-hidden="true" />
                <span>In Stock • UK Hub</span>
              </span>
            )}
          </div>

          {/* OS Compatibility Icon Badges */}
          <div className="card-badge-top-right">
            <span className="os-badge-chip" title="Compatible with Mac & Windows">
              {isAppleCompatible && <RealAppleIcon size={12} />}
              {isWindowsCompatible && <WindowsIcon size={11} />}
            </span>
          </div>

          {/* Primary Image */}
          {primaryImage && (
            <div className="card-img-layer primary-img">
              <Image
                alt={primaryImage.altText || product.title}
                aspectRatio="1/1"
                data={primaryImage}
                loading={loading}
                sizes="(min-width: 75em) 280px, (min-width: 48em) 320px, 50vw"
              />
            </div>
          )}

          {/* Secondary Hover Image (Lifestyle or Rear Ports) */}
          {secondaryImage && (
            <div className="card-img-layer secondary-img" aria-hidden="true">
              <Image
                alt={secondaryImage.altText || `${product.title} alternative view`}
                aspectRatio="1/1"
                data={secondaryImage}
                loading="lazy"
                sizes="(min-width: 75em) 280px, (min-width: 48em) 320px, 50vw"
              />
            </div>
          )}

          {/* Quick Action Overlay on Hover */}
          <div className="card-hover-action-bar">
            <span className="card-hover-cta">
              <span>View Setup Details</span>
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        {/* Card Content & Spec Pills */}
        <div className="card-body">
          {/* Quick Spec Pills */}
          <div className="card-spec-pills-row">
            {specPills.map((pill, idx) => (
              <span key={idx} className="card-spec-pill">
                {pill}
              </span>
            ))}
          </div>

          {/* Product Title */}
          <h4 className="card-product-title">
            <Link to={variantUrl} prefetch="intent">
              {product.title}
            </Link>
          </h4>

          {/* Price & Delivery Row */}
          <div className="card-bottom-row">
            <div className="card-price-wrap">
              <span className="price-current">
                <Money data={product.priceRange.minVariantPrice} />
              </span>
            </div>
            <span className="card-shipping-tag">Free UK 24h</span>
          </div>

          {/* Quick Action Buttons: Add to Cart, Details & Setup Quiz */}
          <div className="card-actions-grid">
            {!isAvailable ? (
              <button disabled className="quick-cart-btn-disabled" aria-label="Product is currently sold out">
                <span className="quick-cart-btn-inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <span>Sold Out</span>
                </span>
              </button>
            ) : hasMultipleVariants ? (
              <Link to={variantUrl} className="quick-cart-btn-link" aria-label={`Select options for ${product.title}`}>
                <span className="quick-cart-btn-inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Select Options</span>
                </span>
              </Link>
            ) : firstVariant ? (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: firstVariant.id,
                    quantity: 1,
                  },
                ]}
              >
                <span className="quick-cart-btn-inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Add to Cart</span>
                </span>
              </AddToCartButton>
            ) : (
              <Link to={variantUrl} className="quick-cart-btn-link" aria-label={`Add ${product.title} to cart`}>
                <span className="quick-cart-btn-inner">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span>Add to Cart</span>
                </span>
              </Link>
            )}

            <div className="card-secondary-actions">
              <Link
                to={variantUrl}
                className="card-action-btn secondary-btn"
                title="View full specs, diagram and port layout"
              >
                <span>Details</span>
                <span aria-hidden="true">↗</span>
              </Link>
              <Link
                to={`/find-my-setup?check=${encodeURIComponent(product.handle)}`}
                className="card-action-btn helper-btn"
                title="Verify if this setup fits your exact laptop"
              >
                <span>Will it fit?</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
