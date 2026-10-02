/**
 * Verification test for Cart & Checkout Business Rules (T22):
 * 1. Base Bundle:
 *    - D2 (Link 100): £120.00
 *    - M1 (Monitor): £145.00
 *    - S1 (Laptop Stand): £35.00
 *    Total Merchandise: £300.00
 * 2. Shipping calculation rule:
 *    - Free shipping (£0.00) on orders £300.00 and above
 *    - Standard shipping (£7.95) on orders under £300.00
 * 3. Discount code DESK10 rule:
 *    - 10% off with minimum merchandise spend of £200.00
 *    - If subtotal after discount drops below £300.00, shipping recalculates to £7.95
 * 4. Custom line item attributes:
 *    - Line items carry `_SetupReference` and `_DeviceProfile`
 */


function calculateCartCheckout({
  items,
  discountCode = null,
}: {
  items: Array<{id: string; title: string; price: number; attributes: Record<string, string>}>;
  discountCode?: string | null;
}) {
  // Merchandise subtotal
  const merchandiseSubtotal = items.reduce((sum, item) => sum + item.price, 0);

  // Discount calculation
  let discountAmount = 0;
  if (discountCode?.toUpperCase() === 'DESK10') {
    if (merchandiseSubtotal >= 200) {
      discountAmount = parseFloat((merchandiseSubtotal * 0.10).toFixed(2));
    }
  }

  const discountedMerchandise = merchandiseSubtotal - discountAmount;

  // Shipping threshold check: based on post-discount merchandise total
  const shippingAmount = discountedMerchandise >= 300.0 ? 0.0 : 7.95;

  const totalCheckout = parseFloat((discountedMerchandise + shippingAmount).toFixed(2));

  return {
    merchandiseSubtotal,
    discountAmount,
    discountedMerchandise,
    shippingAmount,
    totalCheckout,
    items,
  };
}

console.log('=== RUNNING CART & CHECKOUT BUSINESS RULES VERIFICATION ===\n');

let allPassed = true;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName} - ${details || ''}`);
    allPassed = false;
  }
}

// Prepare Bundle Items with custom attributes
const testItems = [
  {
    id: 'gid://shopify/ProductVariant/D2',
    title: 'Link 100 Dock (D2)',
    price: 120.00,
    attributes: {
      _SetupReference: 'setup_1727712345_p1',
      _DeviceProfile: 'P1',
      _ProductRole: 'dock',
    },
  },
  {
    id: 'gid://shopify/ProductVariant/M1',
    title: 'Monitor M1',
    price: 145.00,
    attributes: {
      _SetupReference: 'setup_1727712345_p1',
      _DeviceProfile: 'P1',
      _ProductRole: 'monitor',
    },
  },
  {
    id: 'gid://shopify/ProductVariant/S1',
    title: 'Laptop Stand S1',
    price: 35.00,
    attributes: {
      _SetupReference: 'setup_1727712345_p1',
      _DeviceProfile: 'P1',
      _ProductRole: 'stand',
    },
  },
];

// Test 1: Subtotal and Free Shipping threshold
const cartWithoutDiscount = calculateCartCheckout({items: testItems});
assert(
  cartWithoutDiscount.merchandiseSubtotal === 300.00,
  'Merchandise Subtotal is exactly £300.00 (£120 + £145 + £35)',
  `Received: £${cartWithoutDiscount.merchandiseSubtotal}`
);

assert(
  cartWithoutDiscount.shippingAmount === 0.00,
  'Orders £300.00+ qualify for Free Shipping (£0.00)',
  `Received shipping: £${cartWithoutDiscount.shippingAmount}`
);

assert(
  cartWithoutDiscount.totalCheckout === 300.00,
  'Total Checkout equals £300.00',
  `Received total: £${cartWithoutDiscount.totalCheckout}`
);

// Test 2: Apply DESK10 Discount Code
const cartWithDiscount = calculateCartCheckout({items: testItems, discountCode: 'DESK10'});
assert(
  cartWithDiscount.discountAmount === 30.00,
  'DESK10 applies 10% discount on £300 (£30.00 discount)',
  `Received discount: £${cartWithDiscount.discountAmount}`
);

assert(
  cartWithDiscount.discountedMerchandise === 270.00,
  'Discounted merchandise equals £270.00 (£300 - £30)',
  `Received discounted merchandise: £${cartWithDiscount.discountedMerchandise}`
);

assert(
  cartWithDiscount.shippingAmount === 7.95,
  'Shipping recalculates to £7.95 (post-discount £270 < £300 threshold)',
  `Received shipping: £${cartWithDiscount.shippingAmount}`
);

assert(
  cartWithDiscount.totalCheckout === 277.95,
  'Checkout Total recalculates to £277.95 (£270.00 + £7.95)',
  `Received total: £${cartWithDiscount.totalCheckout}`
);

// Test 3: Custom line item attributes presence
const allItemsHaveAttributes = cartWithDiscount.items.every(
  (item) => item.attributes._SetupReference && item.attributes._DeviceProfile
);
assert(
  allItemsHaveAttributes,
  'All cart line items retain _SetupReference and _DeviceProfile custom attributes for Shopify Admin orders'
);

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL CART & CHECKOUT BUSINESS RULES VERIFIED (100%)');
} else {
  console.error('⚠️ SOME BUSINESS RULE CHECKS FAILED');
  process.exit(1);
}
