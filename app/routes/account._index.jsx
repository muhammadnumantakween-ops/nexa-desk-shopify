import {useOutletContext, Link} from 'react-router';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Account Dashboard'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

export default function AccountDashboard() {
  const {customer} = useOutletContext();

  return (
    <div className="account-dashboard">
      <div className="account-dashboard-header">
        <div className="dashboard-greeting">
          <h1 className="dashboard-title">
            Welcome back, {customer?.firstName || 'Customer'}! 👋
          </h1>
          <p className="dashboard-subtitle">Manage your account, orders, and preferences</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Orders Card */}
        <Link to="/account/orders" className="dashboard-card orders-card">
          <div className="card-icon">📦</div>
          <h3 className="card-title">Your Orders</h3>
          <p className="card-description">Track and manage all your purchases from NexaDesk</p>
          <span className="card-arrow">View Orders →</span>
        </Link>

        {/* Profile Card */}
        <Link to="/account/profile" className="dashboard-card profile-card">
          <div className="card-icon">👤</div>
          <h3 className="card-title">Profile</h3>
          <p className="card-description">Update your personal information and preferences</p>
          <span className="card-arrow">Edit Profile →</span>
        </Link>

        {/* Addresses Card */}
        <Link to="/account/addresses" className="dashboard-card addresses-card">
          <div className="card-icon">📍</div>
          <h3 className="card-title">Addresses</h3>
          <p className="card-description">Manage your shipping and billing addresses</p>
          <span className="card-arrow">Manage Addresses →</span>
        </Link>

        {/* Logout Card */}
        <Link to="/account/logout" className="dashboard-card logout-card">
          <div className="card-icon">🚪</div>
          <h3 className="card-title">Logout</h3>
          <p className="card-description">Sign out of your NexaDesk account</p>
          <span className="card-arrow">Sign Out →</span>
        </Link>
      </div>

      {customer && (
        <div className="dashboard-info">
          <div className="info-card">
            <h3 className="info-title">Account Information</h3>
            <div className="info-details">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{customer.firstName} {customer.lastName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="info-row">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** @typedef {import('./+types/account._index').Route} Route */
