import {Outlet} from 'react-router';

/**
 * Cart page layout - renders without PageLayout wrapper
 * Shows full-screen two-column cart layout
 */
export default function CartLayout() {
  return (
    <div className="cart-layout-container">
      <Outlet />
    </div>
  );
}
