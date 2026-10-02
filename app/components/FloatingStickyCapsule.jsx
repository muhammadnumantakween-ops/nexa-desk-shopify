import {useState, useEffect} from 'react';
import {Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

/**
 * FloatingStickyCapsule (Option A - Apple / Nothing Tech Style)
 *
 * Requirements:
 * - Lightweight, non-intrusive floating pill centered at bottom: 24px.
 * - Max-width ~390px, translucent dark glass (rgba(15, 23, 42, 0.82)) with backdrop-filter blur.
 * - IntersectionObserver logic:
 *   1. Appears ONLY after the user scrolls down past the hero "primary-pdp-buy-button".
 *   2. Dismisses / hides when the user scrolls back up into hero view.
 *   3. Dismisses / hides when approaching the footer so it never obstructs or collides with the footer.
 * - 1-Click direct Add to Cart that synchronizes with selected variant & triggers cart flyout drawer.
 *
 * @param {{
 *   product: any;
 *   selectedVariant: any;
 * }}
 */
export function FloatingStickyCapsule({product, selectedVariant}) {
  const [isVisible, setIsVisible] = useState(false);
  const {open} = useAside();

  useEffect(() => {
    // 1. Observe the primary buy button above the fold
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
    const primaryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the button bounding top is less than 0 or not intersecting, we have scrolled past it
          isPastPrimaryButton =
            !entry.isIntersecting && entry.boundingClientRect.top < 0;
          updateVisibility();
        });
      },
      {threshold: 0.1, rootMargin: '0px 0px 0px 0px'}
    );

    if (primaryButton) {
      primaryObserver.observe(primaryButton);
    }

    // Footer observer: hide when footer comes near viewport
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isNearFooter = entry.isIntersecting;
          updateVisibility();
        });
      },
      {threshold: 0, rootMargin: '0px 0px -40px 0px'}
    );

    if (footerElement) {
      footerObserver.observe(footerElement);
    }

    // Fallback scroll listener in case IntersectionObserver triggers are delayed during rapid jump
    const handleScroll = () => {
      if (primaryButton) {
        const pRect = primaryButton.getBoundingClientRect();
        isPastPrimaryButton = pRect.bottom < 0;
      }
      if (footerElement) {
        const fRect = footerElement.getBoundingClientRect();
        isNearFooter = fRect.top <= window.innerHeight + 40;
      }
      updateVisibility();
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      if (primaryButton) primaryObserver.unobserve(primaryButton);
      if (footerElement) footerObserver.unobserve(footerElement);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!product || !selectedVariant) return null;

  const isAvailable = selectedVariant.availableForSale;

  const lineItems = isAvailable
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
          selectedVariant,
        },
      ]
    : [];

  return (
    <div
      className={`floating-sticky-capsule ${isVisible ? 'is-active' : ''}`}
      aria-label="Floating quick buy"
      role="region"
    >
      <div className="capsule-inner">
        {/* Left: Product Thumbnail & Price */}
        <div className="capsule-meta">
          {selectedVariant.image?.url && (
            <img
              src={selectedVariant.image.url}
              alt={selectedVariant.image.altText || product.title}
              className="capsule-thumb"
              width="36"
              height="36"
              loading="lazy"
            />
          )}
          <div className="capsule-text">
            <span className="capsule-title">{product.title}</span>
            <div className="capsule-price-line">
              <span className="capsule-price">
                <Money data={selectedVariant.price} />
              </span>
              {selectedVariant.compareAtPrice && (
                <s className="capsule-compare-price">
                  <Money data={selectedVariant.compareAtPrice} />
                </s>
              )}
            </div>
          </div>
        </div>

        {/* Right: High-Converting "Add to cart" CTA */}
        <div className="capsule-action">
          <AddToCartButton
            disabled={!isAvailable}
            lines={lineItems}
            onClick={() => open('cart')}
          >
            {isAvailable ? (
              <span className="capsule-add-btn-content">
                <span>Add to cart</span>
                <span className="capsule-lightning" aria-hidden="true">
                  ⚡
                </span>
              </span>
            ) : (
              'Sold out'
            )}
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}
