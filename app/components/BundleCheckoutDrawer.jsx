import {useState, useEffect, useMemo} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {CheckCircleIcon} from './SetupIcons';

/**
 * UI-BUILD-04: Single-Click Bundle Checkout Drawer
 * Calculates bundle price, free shipping status (£300 UK threshold),
 * DESK10 coupon qualification, attaches custom attributes (_SetupReference, _DeviceProfile, _BundleComponents),
 * and triggers celebratory confetti + count-up animations on bundle completion.
 */
export function BundleCheckoutDrawer({bundle, onClose, isOpen}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [setupRefId] = useState(() => `SETUP-${Date.now().toString(36).toUpperCase()}`);

  const {profile, dock, monitor, accessories = []} = bundle;

  // Compute prices
  const dockPrice = parseFloat(dock?.price || '0');
  const monitorPrice = parseFloat(monitor?.price || '0');
  const accessoriesPrice = accessories.reduce((sum, item) => sum + parseFloat(item.price || '0'), 0);

  const subtotal = dockPrice + monitorPrice + accessoriesPrice;

  // DESK10 discount rules (DESIGN.md Section 8.3: 10% off if subtotal >= £200)
  const qualifiesForDesk10 = subtotal >= 200;
  const desk10Savings = qualifiesForDesk10 ? subtotal * 0.1 : 0;
  const priceAfterDiscount = subtotal - desk10Savings;

  // Free shipping rules (DESIGN.md Section 8.2: Free shipping if post-discount subtotal >= £300, else £7.95)
  const qualifiesForFreeShipping = priceAfterDiscount >= 300;
  const shippingCost = qualifiesForFreeShipping ? 0 : 7.95;
  const finalTotal = priceAfterDiscount + shippingCost;

  // Prepare Cart Line Inputs with proper attributes for Shopify Cart & Order Line Items
  const bundleLines = useMemo(() => {
    const lines = [];

    if (dock?.variantId) {
      lines.push({
        merchandiseId: dock.variantId,
        quantity: 1,
        attributes: [
          {key: '_SetupReference', value: setupRefId},
          {key: '_DeviceProfile', value: profile?.label || profile?.code || 'Custom'},
          {key: 'Workstation Role', value: 'Docking Station Hub'},
        ],
      });
    }

    if (monitor?.variantId) {
      lines.push({
        merchandiseId: monitor.variantId,
        quantity: 1,
        attributes: [
          {key: '_SetupReference', value: setupRefId},
          {key: '_DeviceProfile', value: profile?.label || profile?.code || 'Custom'},
          {key: 'Workstation Role', value: 'Display Monitor'},
        ],
      });
    }

    accessories.forEach((acc) => {
      if (acc.variantId) {
        lines.push({
          merchandiseId: acc.variantId,
          quantity: 1,
          attributes: [
            {key: '_SetupReference', value: setupRefId},
            {key: '_DeviceProfile', value: profile?.label || profile?.code || 'Custom'},
            {key: 'Workstation Role', value: acc.title},
          ],
        });
      }
    });

    return lines;
  }, [dock, monitor, accessories, profile, setupRefId]);

  // Confetti particles generator
  const confettiItems = useMemo(() => {
    return Array.from({length: 32}).map((_, i) => ({
      id: i,
      left: `${(i * 3.1) % 100}%`,
      delay: `${((i * 0.08) % 1.5).toFixed(2)}s`,
      bg: ['#d4af37', '#38bdf8', '#22c55e', '#f59e0b', '#ec4899'][i % 5],
      size: `${6 + (i % 6)}px`,
    }));
  }, []);

  return (
    <div
      className={`bundle-checkout-overlay ${isOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bundle-drawer-title"
      onClick={onClose}
    >
      <div
        className="bundle-checkout-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Explosion on Checkout Success */}
        {isSuccess && (
          <div className="confetti-cannon-layer" aria-hidden="true">
            {confettiItems.map((c) => (
              <span
                key={c.id}
                className="confetti-piece"
                style={{
                  left: c.left,
                  animationDelay: c.delay,
                  backgroundColor: c.bg,
                  width: c.size,
                  height: c.size,
                }}
              />
            ))}
          </div>
        )}

        {/* Drawer Header */}
        <div className="bundle-drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-pill-badge">Single-Click Bundle Handoff</span>
            <h2 id="bundle-drawer-title" className="drawer-title">
              Complete Workstation Bundle
            </h2>
            <p className="drawer-subtitle">
              Ref: <code className="setup-ref-code">{setupRefId}</code> • Configured for {profile?.label || 'Your Setup'}
            </p>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close bundle drawer"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Milestone Progress Bar */}
        <div className="free-shipping-milestone-box">
          <div className="milestone-text-row">
            {qualifiesForFreeShipping ? (
              <span className="milestone-congrats">
                🎉 <strong>You unlocked FREE UK Delivery!</strong> (Orders over £300 ship free)
              </span>
            ) : (
              <span className="milestone-remaining">
                Add <strong>£{(300 - priceAfterDiscount).toFixed(2)}</strong> more to unlock <strong>FREE UK Delivery</strong>
              </span>
            )}
            <span className="milestone-target">£300 Target</span>
          </div>
          <div className="milestone-track">
            <div
              className={`milestone-fill ${qualifiesForFreeShipping ? 'unlocked' : ''}`}
              style={{width: `${Math.min(100, (priceAfterDiscount / 300) * 100)}%`}}
            />
          </div>
        </div>

        {/* Bundle Items Breakdown List */}
        <div className="bundle-items-list" aria-label="Included items in bundle">
          <h4 className="bundle-items-heading">Included in Your Setup ({bundleLines.length} Items):</h4>

          {dock && (
            <div className="bundle-item-row">
              <div className="item-icon-box">⚡</div>
              <div className="item-details">
                <span className="item-title">{dock.title}</span>
                <span className="item-meta">
                  {dock.charging_output_watts || dock.dock_charging_output}W Power Delivery • {(dock.video_outputs || dock.dock_video_outputs || []).join(' & ')}
                </span>
                <span className="item-attr-tag">_SetupReference: {setupRefId}</span>
              </div>
              <div className="item-price-tag">£{dockPrice.toFixed(2)}</div>
            </div>
          )}

          {monitor && (
            <div className="bundle-item-row">
              <div className="item-icon-box">🖥️</div>
              <div className="item-details">
                <span className="item-title">{monitor.title}</span>
                <span className="item-meta">
                  {monitor.resolution || '4K Screen'} • {(monitor.video_inputs || monitor.monitor_video_inputs || []).join(' & ')} Input
                </span>
                <span className="item-attr-tag">_DeviceProfile: {profile?.code}</span>
              </div>
              <div className="item-price-tag">£{monitorPrice.toFixed(2)}</div>
            </div>
          )}

          {accessories.map((acc) => (
            <div key={acc.id} className="bundle-item-row accessory-row">
              <div className="item-icon-box">✨</div>
              <div className="item-details">
                <span className="item-title">{acc.title}</span>
                <span className="item-meta">{acc.category || 'Ergonomic Accessory'}</span>
              </div>
              <div className="item-price-tag">£{parseFloat(acc.price).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Price & Discount Calculation Summary */}
        <div className="bundle-cost-summary">
          <div className="cost-row">
            <span>Bundle Hardware Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>

          {qualifiesForDesk10 ? (
            <div className="cost-row discount-row">
              <span className="discount-label">
                🏷️ DESK10 (10% Workstation Discount)
              </span>
              <span className="discount-amount">-£{desk10Savings.toFixed(2)}</span>
            </div>
          ) : (
            <div className="cost-row promo-hint">
              <span>Code DESK10 available on orders £200+</span>
              <span className="hint-val">10% Off</span>
            </div>
          )}

          <div className="cost-row">
            <span>Royal Mail / DPD Tracked UK Delivery</span>
            {qualifiesForFreeShipping ? (
              <span className="free-shipping-text">FREE</span>
            ) : (
              <span>£{shippingCost.toFixed(2)}</span>
            )}
          </div>

          <div className="bundle-total-divider" />

          <div className="cost-row final-total-row">
            <div>
              <strong className="total-label">Total Setup Investment</strong>
              <div className="total-subtext">VAT included • Dispatched in 24h</div>
            </div>
            <div className="total-amount-box">
              <span className="total-curr">£</span>
              <span className="total-number">{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Single-Click Add to Cart Form with Hydrogen Cart API */}
        <div className="bundle-drawer-actions">
          <CartForm
            route="/cart"
            inputs={{lines: bundleLines}}
            action={CartForm.ACTIONS.LinesAdd}
          >
            {(fetcher) => {
              const isSubmitting = fetcher.state !== 'idle';

              return (
                <button
                  type="submit"
                  disabled={isSubmitting || bundleLines.length === 0}
                  className={`btn-primary btn-bundle-checkout ${isSuccess ? 'is-success' : ''}`}
                  onClick={() => {
                    setIsSuccess(true);
                    setTimeout(() => {
                      onClose();
                    }, 1800);
                  }}
                >
                  {isSubmitting ? (
                    <span className="btn-spinner-content">
                      <span className="checkout-spinner" />
                      <span>Adding Complete Setup ({bundleLines.length} Items)...</span>
                    </span>
                  ) : isSuccess ? (
                    <span className="btn-success-content">
                      <CheckCircleIcon size={20} />
                      <span>Setup Secured in Cart!</span>
                    </span>
                  ) : (
                    <span className="btn-default-content">
                      <span>⚡ Add Complete Setup to Cart • £{finalTotal.toFixed(2)}</span>
                    </span>
                  )}
                </button>
              );
            }}
          </CartForm>

          {/* Trust Guarantees */}
          <div className="bundle-trust-badges">
            <div className="trust-pill">
              <span>🛡️ 3-Year UK Hardware Warranty</span>
            </div>
            <div className="trust-pill">
              <span>🔄 30-Day Hassle-Free Returns</span>
            </div>
            <div className="trust-pill">
              <span>🚚 Dispatched in 24h from UK Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
