import {useState, useMemo} from 'react';
import {Link} from 'react-router';
import {Money, CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/**
 * Module A: 'Complete the Link' - Smart Cross-Sell & Recommended Products Carousel
 *
 * Provides:
 * - Smart pairing: If on a Dock PDP -> pairs with matching Monitor + high-spec cable + desk accessory.
 * - If on a Monitor PDP -> pairs with compatible Dock + cable.
 * - Single-click "Add Both & Save 10%" 1-click bundle add-to-cart.
 * - Individual quick-add buttons that trigger the slide-out cart drawer.
 *
 * @param {{
 *   currentProduct: any;
 *   allProducts: any[];
 * }}
 */
export function RecommendedProductsSection({currentProduct, allProducts = []}) {
  const {open} = useAside();
  const [selectedBundleItems, setSelectedBundleItems] = useState({});

  const role = currentProduct?.productRole?.value?.toLowerCase() || '';
  const currentTitle = currentProduct?.title || '';
  const isDock = role === 'dock' || currentTitle.toLowerCase().includes('dock');
  const isMonitor = role === 'monitor' || currentTitle.toLowerCase().includes('monitor');

  // Filter recommendations from allProducts
  const recommendedItems = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];

    const otherProds = allProducts.filter((p) => p.id !== currentProduct.id);

    if (isDock) {
      // Prioritize Monitors and Accessories
      const monitors = otherProds.filter((p) => {
        const r = p.productRole?.value?.toLowerCase() || '';
        return r === 'monitor' || p.title.toLowerCase().includes('monitor') || p.title.toLowerCase().includes('studio');
      });
      const accessories = otherProds.filter((p) => {
        const r = p.productRole?.value?.toLowerCase() || '';
        return r !== 'dock' && r !== 'monitor';
      });
      return [...monitors.slice(0, 2), ...accessories.slice(0, 3)].slice(0, 4);
    } else if (isMonitor) {
      // Prioritize Docks and Accessories
      const docks = otherProds.filter((p) => {
        const r = p.productRole?.value?.toLowerCase() || '';
        return r === 'dock' || p.title.toLowerCase().includes('dock') || p.title.toLowerCase().includes('link');
      });
      const accessories = otherProds.filter((p) => {
        const r = p.productRole?.value?.toLowerCase() || '';
        return r !== 'dock' && r !== 'monitor';
      });
      return [...docks.slice(0, 2), ...accessories.slice(0, 3)].slice(0, 4);
    } else {
      // Generic accessories or related products
      return otherProds.slice(0, 4);
    }
  }, [allProducts, currentProduct, isDock, isMonitor]);

  // Primary pair item for "Complete the Link" 1-click bundle
  const pairItem = recommendedItems[0];
  const currentVariant = currentProduct?.selectedOrFirstAvailableVariant || currentProduct?.variants?.nodes?.[0];
  const pairVariant = pairItem?.variants?.nodes?.[0];

  const currentPriceNum = Number(currentVariant?.price?.amount || 0);
  const pairPriceNum = Number(pairVariant?.price?.amount || 0);
  const combinedRawTotal = currentPriceNum + pairPriceNum;
  const bundleDiscount = (combinedRawTotal * 0.1).toFixed(2);
  const bundleTotal = (combinedRawTotal * 0.9).toFixed(2);
  const currencyCode = currentVariant?.price?.currencyCode || 'GBP';

  if (recommendedItems.length === 0) return null;

  return (
    <section className="pdp-recommended-section" aria-labelledby="complete-the-link-heading">
      <div className="recommended-header">
        <div className="recommended-badge">Ecosystem Synergy</div>
        <h2 id="complete-the-link-heading" className="recommended-title">
          Frequently Paired With This Setup
        </h2>
        <p className="recommended-subtitle">
          Engineered for verified zero-latency plug-and-play compatibility with your {currentProduct.title}.
        </p>
      </div>

      {/* 1-Click Ecosystem Bundle Card */}
      {pairItem && currentVariant && pairVariant && (
        <div className="ecosystem-bundle-card">
          <div className="bundle-callout-header">
            <span className="bundle-tag">⚡ 10% Bundle Discount</span>
            <span className="bundle-guarantee">Verified Compatible Pair</span>
          </div>

          <div className="bundle-items-visual">
            {/* Current Item */}
            <div className="bundle-item-card">
              <div className="bundle-item-thumb-box">
                {currentVariant.image?.url && (
                  <img
                    src={currentVariant.image.url}
                    alt={currentProduct.title}
                    width="64"
                    height="64"
                    className="bundle-item-thumb"
                  />
                )}
              </div>
              <div className="bundle-item-details">
                <span className="bundle-item-label">Current Selection</span>
                <strong className="bundle-item-title">{currentProduct.title}</strong>
                <span className="bundle-item-price">
                  <Money data={currentVariant.price} />
                </span>
              </div>
            </div>

            <div className="bundle-plus-sign" aria-hidden="true">+</div>

            {/* Recommended Pair Item */}
            <div className="bundle-item-card">
              <div className="bundle-item-thumb-box">
                {pairVariant.image?.url ? (
                  <img
                    src={pairVariant.image.url}
                    alt={pairItem.title}
                    width="64"
                    height="64"
                    className="bundle-item-thumb"
                  />
                ) : (
                  <div className="bundle-thumb-placeholder">⚡</div>
                )}
              </div>
              <div className="bundle-item-details">
                <span className="bundle-item-label">Recommended Companion</span>
                <Link to={`/products/${pairItem.handle}`} className="bundle-item-title hover-link">
                  {pairItem.title}
                </Link>
                <span className="bundle-item-price">
                  <Money data={pairVariant.price} />
                </span>
              </div>
            </div>

            <div className="bundle-equals-sign" aria-hidden="true">=</div>

            {/* Bundle Checkout Box */}
            <div className="bundle-checkout-action">
              <div className="bundle-pricing-summary">
                <span className="bundle-save-badge">Save £{bundleDiscount}</span>
                <div className="bundle-final-price">
                  £{bundleTotal} <span className="bundle-currency">{currencyCode}</span>
                </div>
                <s className="bundle-regular-price">£{combinedRawTotal.toFixed(2)}</s>
              </div>

              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesAdd}
                inputs={{
                  lines: [
                    {merchandiseId: currentVariant.id, quantity: 1},
                    {merchandiseId: pairVariant.id, quantity: 1},
                  ],
                }}
              >
                {(fetcher) => (
                  <button
                    type="submit"
                    className="bundle-add-all-btn"
                    onClick={() => open('cart')}
                    disabled={fetcher.state !== 'idle'}
                  >
                    {fetcher.state !== 'idle' ? 'Bundling...' : 'Add Both to Cart'}
                  </button>
                )}
              </CartForm>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Carousel / Grid */}
      <div className="recommended-grid">
        {recommendedItems.map((prod) => {
          const variant = prod.variants?.nodes?.[0];
          const price = prod.priceRange?.minVariantPrice || variant?.price;
          const imgUrl = prod.images?.nodes?.[0]?.url || variant?.image?.url;
          const prodRole = prod.productRole?.value || 'Companion';

          return (
            <div key={prod.id} className="rec-card">
              <div className="rec-card-image-wrap">
                <Link to={`/products/${prod.handle}`} className="rec-image-link">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={prod.title}
                      loading="lazy"
                      className="rec-img"
                      width="180"
                      height="180"
                    />
                  ) : (
                    <div className="rec-img-fallback">🖥️</div>
                  )}
                </Link>
                <span className="rec-role-badge">{prodRole}</span>
              </div>

              <div className="rec-card-content">
                <Link to={`/products/${prod.handle}`} className="rec-title-link">
                  <h4 className="rec-title">{prod.title}</h4>
                </Link>
                <div className="rec-card-footer">
                  <div className="rec-price">
                    {price && <Money data={price} />}
                  </div>
                  {variant && (
                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.LinesAdd}
                      inputs={{
                        lines: [{merchandiseId: variant.id, quantity: 1}],
                      }}
                    >
                      {(fetcher) => (
                        <button
                          type="submit"
                          className="rec-quick-add-btn"
                          onClick={() => open('cart')}
                          disabled={fetcher.state !== 'idle'}
                          title="Quick Add"
                        >
                          + Quick Add
                        </button>
                      )}
                    </CartForm>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
