import {useMemo} from 'react';

const FREE_SHIPPING_THRESHOLD = 300; // £300 GBP milestone

/**
 * UI-CART-01: Dynamic £300 Free Shipping UK Milestone Meter
 * Progress bar showing exact amount remaining to reach £300 free shipping;
 * automatically recalculates on DESK10 discount or line item changes.
 * Features liquid wave fill animation and celebratory celebratory unlocked state.
 */
export function FreeShippingBar({cart}) {
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'GBP';
  const currencySymbol = currencyCode === 'GBP' ? '£' : currencyCode;

  const {percent, remaining, isUnlocked} = useMemo(() => {
    const rawPercent = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
    const clampedPercent = Math.min(100, Math.max(0, rawPercent));
    const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    return {
      percent: clampedPercent,
      remaining: amountRemaining.toFixed(2),
      isUnlocked: subtotal >= FREE_SHIPPING_THRESHOLD,
    };
  }, [subtotal]);

  return (
    <div className={`cart-milestone-meter ${isUnlocked ? 'is-unlocked' : ''}`}>
      <div className="milestone-content">
        <div className="milestone-icon">
          {isUnlocked ? '🎉' : '🚚'}
        </div>
        <div className="milestone-text">
          {isUnlocked ? (
            <p className="milestone-title">
              <strong>FREE UK Next-Day Delivery Unlocked!</strong> (Orders over £300)
            </p>
          ) : (
            <p className="milestone-title">
              Add <strong>{currencySymbol}{remaining}</strong> more for <strong>FREE UK Next-Day Delivery</strong>
            </p>
          )}
          <span className="milestone-sub">
            {isUnlocked
              ? 'Dispatched today before 3:00 PM GMT from our UK hub'
              : 'Standard tracked shipping is £7.95 for orders under £300'}
          </span>
        </div>
      </div>

      <div className="milestone-track" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin="0" aria-valuemax="100">
        <div
          className="milestone-fill"
          style={{width: `${percent}%`}}
        >
          <div className="milestone-shine" />
        </div>
      </div>
    </div>
  );
}
