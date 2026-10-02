import {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {useNavigate} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {useSetupSession} from '~/hooks/useSetupSession';

/**
 * UI-PDP-04: Sticky Bottom Bar with 'Assemble in Builder' CTA
 *
 * Requirements:
 * - Sticky bottom bar on mobile & desktop bottom with selected variant price and instant 'Build Complete Setup' CTA.
 * - Slides up smoothly after scrolling past primary Buy Button.
 * - Persistent 60px thumb-friendly bottom bar on mobile.
 * - Direct integration with Find My Setup Builder session:
 *   If the current product is a dock or monitor, pre-populates the setup session and navigates directly to `/find-my-setup`.
 * - Also provides direct 1-click 'Add to Cart' with optimistic cart drawer trigger.
 *
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 * }}
 */
export function StickyProductBar({product, selectedVariant}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();
  const {open} = useAside();
  const {setDock, setMonitor, session} = useSetupSession();

  useEffect(() => {
    setIsMounted(true);
    const primaryButton = document.getElementById('primary-pdp-buy-button');
    const footerElement =
      document.querySelector('footer') ||
      document.querySelector('.footer-dark-mega');

    let isPastPrimaryButton = false;
    let isNearFooter = false;

    const updateVisibility = () => {
      setIsVisible(isPastPrimaryButton && !isNearFooter);
    };

    // Primary CTA observer: trigger when primary button scrolls out of viewport above
    let primaryObserver;
    if (primaryButton && typeof IntersectionObserver !== 'undefined') {
      primaryObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isPastPrimaryButton =
              !entry.isIntersecting && entry.boundingClientRect.top < 0;
            updateVisibility();
          });
        },
        {threshold: 0.1}
      );
      primaryObserver.observe(primaryButton);
    } else {
      // Fallback scroll listener if observer or button is not present
      const handleFallbackScroll = () => {
        const scrolled = window.scrollY > 450;
        isPastPrimaryButton = scrolled;
        updateVisibility();
      };
      window.addEventListener('scroll', handleFallbackScroll, {passive: true});
      handleFallbackScroll();
    }

    // Footer observer: hide when footer comes near viewport
    let footerObserver;
    if (footerElement && typeof IntersectionObserver !== 'undefined') {
      footerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isNearFooter = entry.isIntersecting;
            updateVisibility();
          });
        },
        {rootMargin: '100px'}
      );
      footerObserver.observe(footerElement);
    }

    return () => {
      if (primaryObserver) primaryObserver.disconnect();
      if (footerObserver) footerObserver.disconnect();
    };
  }, []);

  if (!product || !selectedVariant) return null;

  const isAvailable = selectedVariant.availableForSale;
  const isDock =
    product.productType?.toLowerCase().includes('dock') ||
    product.title?.toLowerCase().includes('dock') ||
    product.handle?.toLowerCase().includes('dock') ||
    product.handle?.startsWith('d');

  const isMonitor =
    product.productType?.toLowerCase().includes('monitor') ||
    product.title?.toLowerCase().includes('monitor') ||
    product.handle?.toLowerCase().includes('monitor') ||
    product.handle?.startsWith('m');

  const handleAssembleInBuilder = () => {
    // If it's a dock or monitor, pre-stage it in the setup session
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

    // Direct transition to the 4-step Find My Setup configurator
    void navigate('/find-my-setup');
  };

  const lineItems = isAvailable
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
    : [];

  const barContent = (
    <div
      className={`sticky-bar-container sticky-product-bar ${isVisible ? 'is-visible' : ''}`}
      role="region"
      aria-label="Sticky product quick-buy & builder bar"
    >
        {/* Left: Product Thumbnail, Title & Selected Variant */}
        <div className="sticky-bar-info">
          {selectedVariant.image?.url && (
            <img
              src={selectedVariant.image.url}
              alt={selectedVariant.image.altText || product.title}
              className="sticky-bar-thumb"
              width="44"
              height="44"
              loading="lazy"
            />
          )}
          <div className="sticky-bar-titles">
            <span className="sticky-bar-product-title">{product.title}</span>
            <div className="sticky-bar-variant-info">
              {selectedVariant.title && selectedVariant.title !== 'Default Title' && (
                <span className="sticky-bar-variant-pill">
                  {selectedVariant.title}
                </span>
              )}
              <span className="sticky-bar-stock-status">
                {isAvailable ? '● In Stock' : '○ Out of stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Pricing */}
        <div className="sticky-bar-pricing">
          <div className="sticky-bar-price-wrap">
            <span className="sticky-bar-price-label">Price</span>
            <div className="sticky-bar-price-val">
              <Money data={selectedVariant.price} />
            </div>
          </div>
          {selectedVariant.compareAtPrice && (
            <s className="sticky-bar-compare-price">
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          )}
        </div>

        {/* Right: Actions (Assemble in Builder & Add to Cart) */}
        <div className="sticky-bar-actions">
          {/* Assemble in Builder CTA */}
          <button
            type="button"
            className="sticky-btn-builder"
            onClick={handleAssembleInBuilder}
            title="Configure in interactive 4-step setup builder"
          >
            <span className="builder-cta-icon" aria-hidden="true">
              ⚙️
            </span>
            <span className="builder-cta-text">
              <span className="builder-cta-sub">Customise Workspace</span>
              <strong className="builder-cta-main">Assemble in Builder</strong>
            </span>
            <span className="builder-arrow-icon" aria-hidden="true">
              →
            </span>
          </button>

          {/* Direct Add to Cart Button */}
          <div className="sticky-btn-cart-wrap">
            <AddToCartButton
              disabled={!isAvailable}
              lines={lineItems}
              onClick={() => open('cart')}
            >
              {isAvailable ? (
                <>
                  <span className="cart-icon" aria-hidden="true">
                    ⚡
                  </span>
                  <span>Add to cart</span>
                </>
              ) : (
                'Sold out'
              )}
            </AddToCartButton>
          </div>
        </div>
      </div>
  );

  if (isMounted && typeof document !== 'undefined') {
    return createPortal(barContent, document.body);
  }

  return barContent;
}
