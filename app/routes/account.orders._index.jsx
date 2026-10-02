import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Orders'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({request, context}) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  /** @type {LoaderReturnData} */
  const {customer, filters} = useLoaderData();
  const {orders} = customer;

  return (
    <div className="account-orders-page">
      <div className="account-orders-header">
        <h1 className="account-title">Your Orders</h1>
        <p className="account-subtitle">Track and manage all your NexaDesk purchases</p>
      </div>
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

/**
 * @param {{
 *   orders: CustomerOrdersFragment['orders'];
 *   filters: OrderFilterParams;
 * }}
 */
function OrdersTable({orders, filters}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

/**
 * @param {{hasFilters?: boolean}}
 */
function EmptyOrders({hasFilters = false}) {
  return (
    <div className="empty-orders">
      {hasFilters ? (
        <>
          <div className="empty-orders-icon">🔍</div>
          <h3 className="empty-orders-title">No Orders Found</h3>
          <p className="empty-orders-desc">No orders match your search criteria. Try adjusting your filters.</p>
          <Link to="/account/orders" className="empty-orders-link">Clear Filters →</Link>
        </>
      ) : (
        <>
          <div className="empty-orders-icon">📦</div>
          <h3 className="empty-orders-title">No Orders Yet</h3>
          <p className="empty-orders-desc">You haven&apos;t placed any orders yet. Start exploring our premium docking solutions and workstation accessories.</p>
          <Link to="/collections" className="empty-orders-link">Browse Products →</Link>
        </>
      )}
    </div>
  );
}

/**
 * @param {{
 *   currentFilters: OrderFilterParams;
 * }}
 */
function OrderSearchForm({currentFilters}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="account-orders-filter"
      aria-label="Search orders"
    >
      <input
        type="search"
        name={ORDER_FILTER_FIELDS.NAME}
        placeholder="Search by order number..."
        aria-label="Order number"
        defaultValue={currentFilters.name || ''}
      />
      <input
        type="search"
        name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
        placeholder="Search by confirmation #..."
        aria-label="Confirmation number"
        defaultValue={currentFilters.confirmationNumber || ''}
      />
      <button type="submit" disabled={isSearching}>
        {isSearching ? '⏳ Searching...' : '🔍 Search'}
      </button>
      {hasFilters && (
        <button
          type="button"
          disabled={isSearching}
          onClick={() => {
            setSearchParams(new URLSearchParams());
            formRef.current?.reset();
          }}
        >
          ✕ Clear
        </button>
      )}
    </form>
  );
}

/**
 * @param {{order: OrderItemFragment}}
 */
function OrderItem({order}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  const orderDate = new Date(order.processedAt);
  const statusClass = fulfillmentStatus?.toLowerCase() || 'pending';

  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className="order-number">Order #{order.number}</span>
        <span className={`order-status ${statusClass}`}>
          {fulfillmentStatus || 'Processing'}
        </span>
      </div>

      <div className="order-card-body">
        <div className="order-detail">
          <span className="order-detail-label">Order Date</span>
          <span className="order-detail-value">{orderDate.toLocaleDateString()}</span>
        </div>

        {order.confirmationNumber && (
          <div className="order-detail">
            <span className="order-detail-label">Confirmation #</span>
            <span className="order-detail-value">{order.confirmationNumber}</span>
          </div>
        )}

        <div className="order-detail">
          <span className="order-detail-label">Status</span>
          <span className="order-detail-value">{order.financialStatus}</span>
        </div>
      </div>

      <div className="order-card-footer">
        <div className="order-total">
          <Money data={order.totalPrice} />
        </div>
        <div className="order-actions">
          <Link to={`/account/orders/${btoa(order.id)}`} className="order-btn">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * @typedef {{
 *   customer: CustomerOrdersFragment;
 *   filters: OrderFilterParams;
 * }} OrdersLoaderData
 */

/** @typedef {import('./+types/account.orders._index').Route} Route */
/** @typedef {import('~/lib/orderFilters').OrderFilterParams} OrderFilterParams */
/** @typedef {import('customer-accountapi.generated').CustomerOrdersFragment} CustomerOrdersFragment */
/** @typedef {import('customer-accountapi.generated').OrderItemFragment} OrderItemFragment */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
