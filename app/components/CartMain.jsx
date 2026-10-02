import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from './FreeShippingBar';

/**
 * Returns a map of all line items and their children.
 * @param {CartLine[]} lines
 * @return {import("/Users/pc/nexa-desk/hydrogen-storefront/app/components/CartMain").LineItemChildrenMap}
 */
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''} ${layout === 'aside' ? 'cart-layout-aside' : 'cart-layout-page'}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {layout === 'page' ? (
        // Full Page Layout with Two Columns
        <div className="cart-page-layout">
          {/* Left Column - Items */}
          <div className="cart-left-column">
            <CartEmpty hidden={linesCount} layout={layout} />
            {cartHasItems && (
              <>
                <FreeShippingBar cart={cart} />
                {cart?.warnings && cart.warnings.length > 0 && (
                  <div style={{background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '1rem', borderRadius: '6px', margin: '1rem 0'}}>
                    <h4 style={{margin: '0 0 0.5rem 0', fontWeight: '700'}}>⚠️ Stock Availability Notice:</h4>
                    <ul style={{margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem'}}>
                      {cart.warnings.map((w, idx) => (
                        <li key={idx}>{w.message || 'One of the items in your bundle experienced a stock change.'}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="cart-items-container">
                  <h2 className="cart-items-heading">Your Items</h2>
                  <p id="cart-lines" className="sr-only">
                    Line items
                  </p>
                  <ul aria-labelledby="cart-lines" className="cart-items-list">
                    {(cart?.lines?.nodes ?? []).map((line) => {
                      if (
                        'parentRelationship' in line &&
                        line.parentRelationship?.parent
                      ) {
                        return null;
                      }
                      return (
                        <CartLineItem
                          key={line.id}
                          line={line}
                          layout={layout}
                          childrenMap={childrenMap}
                        />
                      );
                    })}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Summary, Discounts, Checkout */}
          {cartHasItems && (
            <div className="cart-right-column">
              <CartSummary cart={cart} layout={layout} />
            </div>
          )}
        </div>
      ) : (
        // Aside/Drawer Layout (Original)
        <>
          <CartEmpty hidden={linesCount} layout={layout} />
          {cartHasItems && <FreeShippingBar cart={cart} />}
          {cart?.warnings && cart.warnings.length > 0 && (
            <div style={{background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e', padding: '1rem', borderRadius: '6px', margin: '1rem 0'}}>
              <h4 style={{margin: '0 0 0.5rem 0', fontWeight: '700'}}>⚠️ Stock Availability Notice:</h4>
              <ul style={{margin: 0, paddingLeft: '1.25rem', fontSize: '0.9rem'}}>
                {cart.warnings.map((w, idx) => (
                  <li key={idx}>{w.message || 'One of the items in your bundle experienced a stock change.'}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="cart-details">
            <p id="cart-lines" className="sr-only">
              Line items
            </p>
            <div>
              <ul aria-labelledby="cart-lines">
                {(cart?.lines?.nodes ?? []).map((line) => {
                  if (
                    'parentRelationship' in line &&
                    line.parentRelationship?.parent
                  ) {
                    return null;
                  }
                  return (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      layout={layout}
                      childrenMap={childrenMap}
                    />
                  );
                })}
              </ul>
            </div>
            {cartHasItems && <CartSummary cart={cart} layout={layout} />}
          </div>
        </>
      )}
    </section>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false, layout}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="cart-empty-luxury">
      <div className="cart-empty-visual">
        <div className="cart-empty-icon-wrap">
          <svg
            className="cart-empty-svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="cart-empty-pulse-dot" />
        </div>
      </div>

      <div className="cart-empty-text">
        <h3 className="cart-empty-heading">Your Cart is Empty</h3>
        <p className="cart-empty-desc">
          Ready to engineer your clean, clutter-free workspace? Find the exact
          docking station and cable architecture tailored for your laptop.
        </p>
      </div>

      <div className="cart-empty-actions">
        <Link
          to="/find-my-setup"
          onClick={close}
          prefetch="viewport"
          className="cart-empty-btn-primary"
        >
          <span>Find My Desk Setup (2-Min Quiz)</span>
          <span className="cta-arrow">→</span>
        </Link>
        <Link
          to="/collections/all"
          onClick={close}
          prefetch="viewport"
          className="cart-empty-btn-secondary"
        >
          <span>Browse All Workstation Gear</span>
        </Link>
      </div>

      <div className="cart-empty-suggestions">
        <div className="cart-empty-suggestions-title">
          <span>POPULAR ARCHITECTURES</span>
        </div>
        <div className="cart-empty-quick-pills">
          <Link
            to="/collections/all"
            onClick={close}
            prefetch="viewport"
            className="cart-empty-quick-item"
          >
            <div className="quick-item-badge">4K 60Hz Dual</div>
            <div className="quick-item-name">D2 Link 100 Dual Dock</div>
            <div className="quick-item-price">£179.00</div>
          </Link>
          <Link
            to="/collections/all"
            onClick={close}
            prefetch="viewport"
            className="cart-empty-quick-item"
          >
            <div className="quick-item-badge">Flagship 4x Display</div>
            <div className="quick-item-name">D4 Max Enterprise Dock</div>
            <div className="quick-item-price">£279.00</div>
          </Link>
          <Link
            to="/collections/all"
            onClick={close}
            prefetch="viewport"
            className="cart-empty-quick-item compare-quick-pill"
          >
            <div className="quick-item-badge">Browse Collections</div>
            <div className="quick-item-name">Explore All Products</div>
            <div className="quick-item-arrow">View All →</div>
          </Link>
        </div>
      </div>

      <div className="cart-empty-perks">
        <div className="cart-perk-item">
          <span className="perk-icon">🇬🇧</span>
          <span className="perk-text">Free UK Delivery over £300</span>
        </div>
        <div className="cart-perk-item">
          <span className="perk-icon">⚡</span>
          <span className="perk-text">30-Day Desk Guarantee</span>
        </div>
        <div className="cart-perk-item">
          <span className="perk-icon">🛡️</span>
          <span className="perk-text">2-Year British Hardware Warranty</span>
        </div>
      </div>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {{[parentId: string]: CartLine[]}} LineItemChildrenMap */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartLineItem').CartLine} CartLine */
