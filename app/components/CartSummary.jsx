import {CartForm, Money} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <h4 id={summaryId}>Totals</h4>
      <dl role="group" className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
        subtotal={parseFloat(cart?.cost?.subtotalAmount?.amount || '0')}
      />

      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

/**
 * Helper to extract specific cookie by name
 * @param {string} name
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  const handleCheckoutClick = (e) => {
    e.preventDefault();

    try {
      const url = new URL(checkoutUrl);

      // 1. Read Google Analytics Client ID (_ga)
      const gaCookie = getCookie('_ga');
      if (gaCookie) {
        url.searchParams.set('_ga', gaCookie);
      }

      // 2. Read Meta Pixel Identifiers (_fbp, _fbc)
      const fbpCookie = getCookie('_fbp');
      if (fbpCookie) {
        url.searchParams.set('_fbp', fbpCookie);
      }

      const fbcCookie = getCookie('_fbc');
      if (fbcCookie) {
        url.searchParams.set('_fbc', fbcCookie);
      }

      // Redirect with decorated tracking parameters
      window.location.href = url.toString();
    } catch (err) {
      // Fallback to original checkout URL on parse error
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="cart-checkout-block">
      <a
        href={checkoutUrl}
        onClick={handleCheckoutClick}
        target="_self"
        className="btn-luxury-checkout"
      >
        <span className="checkout-text">Secure Checkout</span>
        <span className="checkout-arrow">→</span>
      </a>
      <div className="cart-trust-micro">
        <div className="trust-item">
          <span className="trust-icon">🔒</span>
          <span className="trust-label">256-Bit SSL</span>
        </div>
        <div className="trust-divider">•</div>
        <div className="trust-item">
          <span className="trust-icon">🇬🇧</span>
          <span className="trust-label">UK Same-Day Dispatch</span>
        </div>
        <div className="trust-divider">•</div>
        <div className="trust-item">
          <span className="trust-icon">⏱️</span>
          <span className="trust-label">30-Day Trial</span>
        </div>
      </div>
    </div>
  );

}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 *   discountsHeadingId: string;
 *   discountCodeInputId: string;
 * }}
 */
function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
  subtotal = 0,
}) {
  const [typedCode, setTypedCode] = useState('');
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const hasDesk10 = codes.some((c) => c.toUpperCase() === 'DESK10');

  return (
    <section aria-label="Discounts" className="cart-discounts-section">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="applied-discounts-dl">
        <div>
          <dt id={discountsHeadingId} className="applied-discount-label">
            <span>🎉 Applied Promo</span>
          </dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount-pill"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <span className="discount-icon">🏷️</span>
              <strong className="discount-code-tag">{codes?.join(', ')}</strong>
              <span className="discount-benefit-note">10% Bundle Savings</span>
              <button
                type="submit"
                aria-label="Remove discount"
                className="btn-remove-discount"
              >
                ✕
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Real-Time DESK10 Validation Feedback Box (UI-CART-03) */}
      {!hasDesk10 && (
        <div className="desk10-promo-hint">
          <div className="hint-header">
            <span className="hint-sparkle">⚡</span>
            <span className="hint-title">Use Code <strong>DESK10</strong> for 10% off</span>
          </div>
          <p className="hint-desc">
            Save 10% on complete workstation setups & docks today.
          </p>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="discount-input-row">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <div className="input-wrap">
            <input
              id={discountCodeInputId}
              type="text"
              name="discountCode"
              placeholder="Enter promo code (e.g. DESK10)"
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value.toUpperCase())}
              className="discount-field"
            />
          </div>
          <button
            type="submit"
            aria-label="Apply discount code"
            className="btn-apply-discount"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}


/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode;
 * }}
 */
function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 *   giftCardHeadingId: string;
 *   giftCardInputId: string;
 * }}
 */
function CartGiftCard({giftCardCodes, giftCardHeadingId, giftCardInputId}) {
  const giftCardCodeInput = useRef(null);
  const removeButtonRefs = useRef(new Map());
  const previousCardIdsRef = useRef([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div>
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

/**
 * @param {{
 *   fetcherKey?: string;
 *   children: React.ReactNode;
 * }}
 */
function AddGiftCardForm({fetcherKey, children}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

/**
 * @param {{
 *   giftCardId: string;
 *   lastCharacters: string;
 *   children: React.ReactNode;
 *   onRemoveClick?: () => void;
 *   buttonRef?: (el: HTMLButtonElement | null) => void;
 * }}
 */
function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */
