
import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {useSetupSession} from '~/hooks/useSetupSession';

/**
 * @param {{
 *   productOptions: MappedProductOptions[];
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 *   product?: any;
 * }}
 */
export function ProductForm({productOptions, selectedVariant, product}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const {setDock, setMonitor} = useSetupSession();
  const [justAdded, setJustAdded] = useState(false);

  // Compute 3 payments instalment preview
  const priceAmount = parseFloat(selectedVariant?.price?.amount || '0');
  const currencyCode = selectedVariant?.price?.currencyCode || 'GBP';
  const instalmentAmount = priceAmount > 0 ? (priceAmount / 3).toFixed(2) : null;
  const currencySymbol = currencyCode === 'GBP' ? '£' : currencyCode === 'EUR' ? '€' : '$';

  const isAvailable = selectedVariant?.availableForSale;

  const isDock =
    product?.productType?.toLowerCase().includes('dock') ||
    product?.title?.toLowerCase().includes('dock') ||
    product?.handle?.toLowerCase().includes('dock') ||
    product?.handle?.startsWith('d');

  const isMonitor =
    product?.productType?.toLowerCase().includes('monitor') ||
    product?.title?.toLowerCase().includes('monitor') ||
    product?.handle?.toLowerCase().includes('monitor') ||
    product?.handle?.startsWith('m');

  const handleAssembleInBuilder = () => {
    if (product && selectedVariant) {
      if (isDock) {
        setDock({
          id: product.id,
          variantId: selectedVariant.id,
          code: product.handle?.toUpperCase() || 'DOCK',
          label: product.title,
          charging_power_output: Number(product.dockChargingOutput?.value || 65),
          host_connector: product.hostConnector?.value || 'USB-C',
          video_outputs: product.dockVideoOutputs?.value
            ? JSON.parse(product.dockVideoOutputs.value)
            : ['HDMI'],
          price: selectedVariant.price.amount,
          image_url: selectedVariant.image?.url || product.featuredImage?.url,
        });
      } else if (isMonitor) {
        setMonitor({
          id: product.id,
          variantId: selectedVariant.id,
          code: product.handle?.toUpperCase() || 'MONITOR',
          label: product.title,
          video_inputs: product.monitorVideoInputs?.value
            ? JSON.parse(product.monitorVideoInputs.value)
            : ['HDMI'],
          resolution: '4K',
          price: selectedVariant.price.amount,
          image_url: selectedVariant.image?.url || product.featuredImage?.url,
        });
      }
    }
    void navigate('/find-my-setup');
  };

  const handleAddToCartClick = () => {
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      open('cart');
    }, 750);
  };

  return (
    <div className="product-form pro-product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid #38bdf8'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`product-options-item${exists && !selected ? ' link' : ''}`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid #38bdf8'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}

      {/* Dynamic 'In 30 Seconds' Plain-English Hero Pill */}
      <div className="pdp-plain-summary-card">
        <div className="summary-badge-header">
          <span className="summary-spark-icon">✨</span>
          <span className="summary-badge-text">
            {isDock
              ? 'One-Cable Laptop Command Center'
              : isMonitor
              ? 'Ultra-Sharp Workstation Display'
              : 'Certified High-Speed Interconnect'}
          </span>
        </div>
        <p className="summary-body-text">
          {isDock
            ? 'Turns 1 laptop plug into a full desk command center: charges your laptop battery at full speed while connecting extra monitors, keyboard, mouse, and rock-solid wired internet.'
            : isMonitor
            ? 'Gives you 2x more screen space with crisp text, vivid colors, and anti-glare glass that keeps your eyes comfortable through long workdays.'
            : 'Guaranteed to carry full 100W charging power and crisp 4K/8K video signals between your computer and desk devices with zero flickering.'}
        </p>
      </div>

      {/* PRO CRO: Scarcity & Dispatch Micro-Banner */}
      <div className="pdp-urgency-strip">
        <span className="stock-pulse-dot" />
        <span className="stock-pulse-text">
          <strong>Low UK Stock</strong> — 4 units remaining in Heathrow Fulfilment Centre
        </span>
      </div>

      {/* UI-PDP-04 Pro: Dual-Tier Power Bar */}
      <div id="primary-pdp-buy-button" className="primary-buy-button-wrapper pro-buy-wrapper">
        <div className="pdp-dual-tier-cta-grid">
          {/* Main Hero Add To Cart Button */}
          <AddToCartButton
            disabled={!selectedVariant || !isAvailable}
            onClick={handleAddToCartClick}
            className={`pro-hero-add-to-cart-btn ${justAdded ? 'is-added' : ''}`}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {({isSubmitting}) => {
              if (justAdded) {
                return (
                  <span className="btn-content-inner success-anim">
                    <span className="btn-icon">✓</span>
                    <span className="btn-label-text">Added to Setup</span>
                  </span>
                );
              }
              if (isSubmitting) {
                return (
                  <span className="btn-content-inner">
                    <span className="btn-spinner" />
                    <span className="btn-label-text">Securing Hardware...</span>
                  </span>
                );
              }
              if (!isAvailable) {
                return (
                  <span className="btn-content-inner">
                    <span className="btn-label-text">Sold Out — Notify When Restocked</span>
                  </span>
                );
              }
              return (
                <span className="btn-content-inner">
                  <span className="btn-lightning-icon">⚡</span>
                  <span className="btn-label-text">Add to cart</span>
                  <span className="btn-price-bullet">•</span>
                  <span className="btn-inline-price">
                    <Money data={selectedVariant.price} />
                  </span>
                </span>
              );
            }}
          </AddToCartButton>

          {/* Secondary Action: Assemble in Setup Builder */}
          {(isDock || isMonitor) && (
            <button
              type="button"
              className="pro-hero-builder-btn"
              onClick={handleAssembleInBuilder}
              title="Configure in interactive 4-step setup builder"
            >
              <span className="builder-pill-icon">⚙️</span>
              <span className="builder-pill-label">Assemble in Builder</span>
              <span className="builder-pill-arrow">→</span>
            </button>
          )}
        </div>

        {/* Flexible Payment Terms preview */}
        {instalmentAmount && (
          <div className="pdp-instalment-note">
            <span>or 3 interest-free payments of </span>
            <strong className="instalment-val">{currencySymbol}{instalmentAmount}</strong>
            <span> with Klarna / Clearpay</span>
          </div>
        )}

        {/* 3-Point Reassurance Trust Matrix */}
        <div className="pdp-trust-badge-matrix">
          <div className="trust-item">
            <span className="trust-icon">✓</span>
            <span className="trust-text">In Stock (Dispatches in 24h)</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span className="trust-text">2-Year UK Warranty</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📦</span>
            <span className="trust-text">Free Tracked UK Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   swatch?: Maybe<ProductOptionValueSwatch> | undefined;
 *   name: string;
 * }}
 */
function ProductOptionSwatch({swatch, name}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

/** @typedef {import('@shopify/hydrogen').MappedProductOptions} MappedProductOptions */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Maybe} Maybe */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductOptionValueSwatch} ProductOptionValueSwatch */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
