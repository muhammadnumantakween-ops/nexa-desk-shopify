import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink} from 'react-router';

/**
 * Modern Dark-Mode Mega Footer (UI-FOOT-01 & UI-FOOT-02)
 * Features:
 * 1. Structured 4-column layout (Ecosystem & Docks, Compatibility Tools, Help & Logistics, Company & Legal)
 * 2. Dynamic UK Free Delivery status banner (£300 threshold indicator)
 * 3. Interactive Newsletter Subscribe Form with feedback state
 * 4. Certified UK Payment Security & Trust Badges (Apple Pay, Google Pay, Visa, Mastercard, Amex)
 * 5. Scroll-triggered subtle parallax drift of brand watermark typography
 * 6. Interactive Live UK Shipping & Support Status Pill with popover & dynamic cutoff timer
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchCutoff, setDispatchCutoff] = useState('4h 12m');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Cutoff at 15:00 (3 PM GMT)
      const target = new Date();
      target.setHours(15, 0, 0, 0);

      let diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        // Next day cutoff
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - now.getTime();
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setDispatchCutoff(`${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer-dark-mega">      {/* Top UK Dispatch & Service Bar */}
      <div className="footer-top-banner">
        <div className="footer-container">
          <div className="footer-trust-grid">
            <div className="trust-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <div>
                <strong>Free Fast UK Delivery</strong>
                <span>On all desk setups & orders over £300</span>
              </div>
            </div>

            <div className="trust-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <strong>Guaranteed to Fit Your Laptop</strong>
                <span>Tested to work without extra adapters</span>
              </div>
            </div>

            <div className="trust-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <div>
                <strong>30-Day Home Trial</strong>
                <span>Easy, free returns if you change your mind</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="footer-main-content">
        <div className="footer-container">
          <div className="footer-columns-grid">
            {/* Column 1: Brand & UK Dispatch Details */}
            <div className="footer-col brand-col">
              <div className="footer-brand-title">
                <span className="brand-dot-footer" />
                <span>NexaDesk</span>
              </div>
              <p className="footer-brand-tagline">
                We make tidy, comfortable desk setups simple for anyone working from home or in the office. Everything you need, guaranteed to work together.
              </p>

              {/* Dynamic Interactive UK Dispatch Status (UI-FOOT-02) */}
              <div className="uk-dispatch-wrapper">
                <button
                  type="button"
                  className={`uk-dispatch-status-badge is-interactive ${showDispatchModal ? 'is-active' : ''}`}
                  onClick={() => setShowDispatchModal((prev) => !prev)}
                  aria-expanded={showDispatchModal}
                  aria-controls="uk-dispatch-details-panel"
                  aria-label="Toggle UK delivery and shipping details"
                >
                  <span className="pulse-green-dot" aria-hidden="true" />
                  <div className="dispatch-badge-copy">
                    <span className="dispatch-text-main">Dispatched in 24h from UK Hub</span>
                    <span className="dispatch-text-sub">
                      Order within <strong>{dispatchCutoff}</strong> for Next-Day Delivery
                    </span>
                  </div>
                  <svg
                    className="dispatch-chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Inline Expandable Logistics Drawer (Non-overlapping, human-readable) */}
                <div
                  id="uk-dispatch-details-panel"
                  className={`dispatch-drawer-panel ${showDispatchModal ? 'is-open' : ''}`}
                >
                  <div className="dispatch-drawer-inner">
                    <div className="popover-header">
                      <div className="popover-status-dot" aria-hidden="true" />
                      <span className="popover-title">Fast UK Packing & Delivery</span>
                    </div>

                    <p className="popover-summary">
                      Every order placed before <strong>3:00 PM GMT</strong> is carefully checked, packaged, and sent out the very same working day from our Northamptonshire depot.
                    </p>

                    <div className="popover-carriers-list">
                      <div className="carrier-row">
                        <span className="carrier-name">Royal Mail Tracked 24</span>
                        <span className="carrier-eta">Arrives in 1 to 2 Days</span>
                      </div>
                      <div className="carrier-row">
                        <span className="carrier-name">DPD Carbon-Neutral Courier</span>
                        <span className="carrier-eta">Next Working Day Delivery</span>
                      </div>
                      <div className="carrier-row highlight">
                        <span className="carrier-name">Orders Over £300</span>
                        <span className="carrier-eta free">FREE Next-Day Delivery</span>
                      </div>
                    </div>

                    <div className="popover-footer">
                      <span>Standard mainland UK delivery is £7.95 for orders under £300. Comes with text and email delivery tracking.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Hardware Collections */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Desk Gear</h4>
              <ul className="footer-links-list">
                <li><NavLink to="/collections/all">All Desk Products</NavLink></li>
                <li><NavLink to="/collections/docks-hubs">One-Cable Docks & Hubs</NavLink></li>
                <li><NavLink to="/collections/monitors">Computer Screens</NavLink></li>
                <li><NavLink to="/collections/stands">Laptop Stands & Risers</NavLink></li>
                <li><NavLink to="/collections/keyboards">Comfortable Keyboards</NavLink></li>
                <li><NavLink to="/collections/mice">Wireless Mice</NavLink></li>
              </ul>
            </div>

            {/* Column 3: Setup & Compatibility Tools */}
            <div className="footer-col">
              <h4 className="footer-col-heading">Helpful Tools</h4>
              <ul className="footer-links-list">
                <li>
                  <NavLink to="/find-my-setup" className="highlight-link">
                    Desk Setup Finder Quiz
                    <span className="link-tag">Easy Tool</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/compare" className="highlight-link">
                    Compare Docks Side-by-Side
                    <span className="link-tag">Compare</span>
                  </NavLink>
                </li>
                <li><NavLink to="/pages/compatibility-faq">Which Plugs Fit My Laptop? (FAQ)</NavLink></li>
                <li><NavLink to="/pages/compatibility-faq">Connecting Two Screens to a Mac</NavLink></li>
                <li><NavLink to="/blogs/journal">Healthy & Comfortable Desk Tips</NavLink></li>
                <li><NavLink to="/pages/about">About Our UK Story</NavLink></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Commercial Terms */}
            <div className="footer-col newsletter-col">
              <h4 className="footer-col-heading">Get 10% Off Your First Order</h4>
              <p className="footer-newsletter-desc">
                Join our friendly newsletter for simple desk setup tips, early deals, and an instant 10% discount code.
              </p>

              {subscribed ? (
                <div className="newsletter-success-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>You're in! Check your inbox for your 10% off code.</span>
                </div>
              ) : (
                <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="footer-email-input"
                  />
                  <button type="submit" className="footer-submit-btn">
                    Join
                  </button>
                </form>
              )}

              {/* Commercial Discount Reminder */}
              <div className="promo-reminder-box">
                <span className="promo-badge">PROMO</span>
                <span className="promo-copy">Use code <strong>DESK10</strong> for 10% off orders over £200.</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Payment Security & Legal */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © {new Date().getFullYear()} NexaDesk Ltd. Registered in England & Wales. All rights reserved.
            </div>

            {/* Payment Trust Badges */}
            <div className="footer-payment-methods" aria-label="Accepted payment methods">
              <span className="payment-pill">Apple Pay</span>
              <span className="payment-pill">Google Pay</span>
              <span className="payment-pill">Visa</span>
              <span className="payment-pill">Mastercard</span>
              <span className="payment-pill">Amex</span>
            </div>

            {/* Policy Links */}
            <div className="footer-legal-links">
              <NavLink to="/policies/privacy-policy">Privacy</NavLink>
              <NavLink to="/policies/terms-of-service">Terms</NavLink>
              <NavLink to="/policies/shipping-policy">Shipping</NavLink>
              <NavLink to="/policies/refund-policy">Refunds</NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax Upward Drift Watermark Typography */}
      <div className="footer-brand-watermark" aria-hidden="true">
        NEXADESK
      </div>
    </footer>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
