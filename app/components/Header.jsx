import {Suspense, useState, useEffect, useRef} from 'react';
import {Await, NavLink, useAsyncValue, useNavigate} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import {useSetupSession} from '~/hooks/useSetupSession';
import {NexaLogo} from '~/components/NexaLogo';


/**
 * Navigation Architecture with Grouped Sub-menus
 */
export const STORE_NAVIGATION = [
  {
    id: 'nav-shop',
    title: 'Shop Desk Gear',
    url: '/collections/all',
    subItems: [
      {
        title: 'All Desk Gear',
        url: '/collections/all',
        description: 'Browse everything to build your ideal, tidy desk',
      },
      {
        title: 'One-Cable Docks & Hubs',
        url: '/collections/docks-hubs',
        badge: 'Popular',
        description: 'Connect screens, power, and accessories with just one cable',
      },
      {
        title: 'Computer Screens',
        url: '/collections/monitors',
        description: 'Crisp, wide screens that are gentle on your eyes',
      },
      {
        title: 'Adjustable Laptop Stands',
        url: '/collections/stands',
        description: 'Raise your screen to eye level to stop neck and back strain',
      },
      {
        title: 'Comfortable Keyboards',
        url: '/collections/keyboards',
        description: 'Smooth, quiet typing for Mac, Windows, and laptops',
      },
      {
        title: 'Wireless Mice',
        url: '/collections/mice',
        description: 'Comfortable grips designed for all-day working without wrist fatigue',
      },
    ],
  },
  {
    id: 'nav-tools',
    title: 'Setup Helper',
    url: '/find-my-setup',
    subItems: [
      {
        title: 'Desk Setup Finder',
        url: '/find-my-setup',
        badge: 'Easy Quiz',
        description: 'Tell us what laptop you have, and we show you what works perfectly',
      },
      {
        title: 'Compare Docks Side-by-Side',
        url: '/compare',
        badge: 'Compare',
        description: 'Easily see which dock has the plugs, speed, and power you need',
      },
    ],
  },
  {
    id: 'nav-support',
    title: 'Help & Delivery',
    url: '/pages/compatibility-faq',
    subItems: [
      {
        title: 'Will It Work With My Laptop? (FAQ)',
        url: '/pages/compatibility-faq',
        description: 'Simple answers about plugs, chargers, and extra screens',
      },
      {
        title: 'Who We Are',
        url: '/pages/about',
        description: 'Our UK team and our mission to simplify your workspace',
      },
      {
        title: 'UK Shipping & Free Delivery',
        url: '/policies/shipping-policy',
        description: 'Free next-day delivery on orders over £300, or £7.95 standard',
      },
      {
        title: '30-Day Money-Back Guarantee',
        url: '/policies/refund-policy',
        description: 'Try it on your desk risk-free with free, hassle-free returns',
      },
      {
        title: 'Privacy Policy',
        url: '/policies/privacy-policy',
        description: 'How we keep your personal details private and secure',
      },
      {
        title: 'Terms of Service',
        url: '/policies/terms-of-service',
        description: 'Our simple, honest shopping guidelines and store terms',
      },
    ],
  },
  {
    id: 'nav-journal',
    title: 'Desk Tips & Guides',
    url: '/blogs/journal',
  },
];

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop = {}, menu = {}} = header || {};
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand / Logo */}
        <NavLink prefetch="intent" to="/" className="header-brand" end aria-label="NexaDesk Home">
          <NexaLogo size={32} className="header-logo-icon" />
          <span className="brand-name">{shop.name || 'NexaDesk'}</span>
        </NavLink>


        {/* Desktop Navigation with Dropdowns */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={shop?.primaryDomain?.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* Action CTAs */}
        <div className="header-right-group">
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  viewport,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const {session, setProfile} = useSetupSession();
  const currentProfile = session?.selectedProfile;

  const handleMouseEnter = (id) => {
    if (viewport !== 'desktop') return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (viewport !== 'desktop') return;
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleSelectProfile = (profile) => {
    setProfile(profile);
    close();
    navigate('/find-my-setup');
  };

  const MOBILE_PROFILES = [
    {
      code: 'P1',
      label: 'Studio 65',
      operating_system: 'Windows',
      host_connector: 'USB-C',
      video_support: true,
      required_charging_power: 65,
    },
    {
      code: 'P2',
      label: 'Studio 100',
      operating_system: 'Windows',
      host_connector: 'USB-C',
      video_support: true,
      required_charging_power: 100,
    },
    {
      code: 'P3',
      label: 'Creator 65',
      operating_system: 'macOS',
      host_connector: 'USB-C',
      video_support: true,
      required_charging_power: 65,
    },
    {
      code: 'P4',
      label: 'Classic A',
      operating_system: 'Windows',
      host_connector: 'USB-A',
      video_support: false,
      required_charging_power: 0,
    },
  ];

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <>
          {/* Quick Device Profile Selector Card */}
          <div className="mobile-profile-picker-card">
            <div className="mobile-profile-picker-header">
              <span className="picker-badge">Setup Matcher</span>
              <span className="picker-title">Select Your Laptop Profile:</span>
            </div>
            <div className="mobile-profile-grid">
              {MOBILE_PROFILES.map((prof) => {
                const isSelected = currentProfile?.code === prof.code;
                return (
                  <button
                    key={prof.code}
                    type="button"
                    onClick={() => handleSelectProfile(prof)}
                    className={`mobile-profile-chip ${isSelected ? 'is-selected' : ''}`}
                  >
                    <span className="chip-name">{prof.label}</span>
                    <span className="chip-spec">{prof.operating_system} · {prof.required_charging_power}W</span>
                  </button>
                );
              })}
            </div>
            {currentProfile && (
              <div className="mobile-active-profile-banner">
                <span className="active-dot" />
                <span>Active: <strong>{currentProfile.label}</strong> ({currentProfile.required_charging_power}W)</span>
                <NavLink to="/find-my-setup" onClick={close} className="open-builder-link">
                  Open Setup →
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            end
            onClick={close}
            prefetch="intent"
            className={({isActive}) => `header-menu-item ${isActive ? 'is-active' : ''}`}
            to="/"
            style={{'--item-index': 0}}
          >
            Home
          </NavLink>
        </>
      )}

      {STORE_NAVIGATION.map((item, index) => {
        const hasChildren = Boolean(item.subItems && item.subItems.length > 0);

        if (viewport === 'mobile') {
          return (
            <div
              key={item.id}
              className="mobile-menu-group"
              style={{'--item-index': index + 1}}
            >
              <NavLink
                className={({isActive}) => `header-menu-item mobile-parent-link ${isActive ? 'is-active' : ''}`}
                onClick={close}
                prefetch="intent"
                to={item.url}
              >
                {item.title}
              </NavLink>
              {hasChildren && (
                <div className="mobile-submenu-list">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.url}
                      className="mobile-submenu-item"
                      onClick={close}
                      prefetch="intent"
                      to={sub.url}
                    >
                      <span className="sub-title">{sub.title}</span>
                      {sub.badge && <span className="sub-badge">{sub.badge}</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // Desktop Dropdown Navigation
        return (
          <div
            key={item.id}
            className={`nav-item-dropdown-wrapper ${activeDropdown === item.id ? 'is-open' : ''}`}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              className={({isActive}) => `header-menu-item has-dropdown ${isActive ? 'is-active' : ''}`}
              prefetch="intent"
              to={item.url}
            >
              {item.title}
              {hasChildren && (
                <svg className="dropdown-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </NavLink>

            {hasChildren && (
              <div className="dropdown-flyout-menu">
                <div className="dropdown-flyout-inner">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.url}
                      to={sub.url}
                      prefetch="intent"
                      className="dropdown-sub-card"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="dropdown-sub-header">
                        <span className="dropdown-sub-title">{sub.title}</span>
                        {sub.badge && <span className="dropdown-sub-badge">{sub.badge}</span>}
                      </div>
                      {sub.description && (
                        <p className="dropdown-sub-desc">{sub.description}</p>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) => `header-action-btn account-btn ${isActive ? 'is-active' : ''}`}
        aria-label="Account"
      >
        <Suspense fallback={<AccountIcon />}>
          <Await resolve={isLoggedIn} errorElement={<AccountIcon />}>
            {(isLoggedIn) => (
              <>
                <AccountIcon />
                <span className="cta-text">{isLoggedIn ? 'Account' : 'Sign in'}</span>
              </>
            )}
          </Await>
        </Suspense>
      </NavLink>

      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open mobile menu"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-action-btn reset search-btn"
      onClick={() => open('search')}
      aria-label="Search store"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span className="cta-text">Search</span>
    </button>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const [bouncing, setBouncing] = useState(false);
  const prevCountRef = useRef(count);

  useEffect(() => {
    if (prevCountRef.current !== count && count > 0) {
      setBouncing(true);
      const timer = setTimeout(() => setBouncing(false), 500);
      prevCountRef.current = count;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = count;
  }, [count]);

  return (
    <a
      href="/cart"
      className="header-action-btn cart-badge-btn"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
      aria-label={`Cart with ${count} items`}
    >
      <svg className={bouncing ? 'cart-icon-animated' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span className={`cart-counter ${bouncing ? 'is-bouncing' : ''}`}>{count}</span>
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
