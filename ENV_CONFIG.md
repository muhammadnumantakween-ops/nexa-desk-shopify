# NexaDesk Hydrogen Storefront - Environment Configuration Guide

## 📋 Overview

This document describes all environment variables required to run the NexaDesk storefront and their usage throughout the application.

---

## 🔐 Core Authentication Variables

### `SESSION_SECRET`
- **Type:** `string` (SHA-256 hash)
- **Example:** `9760394b1600bcebee90de32d4ef6e24bf8bb1b2`
- **Purpose:** Secures session cookies and user authentication tokens
- **Used By:** `app/lib/context.js` → `AppSession.init()`
- **Required:** ✅ Yes
- **Scope:** Server-side only (Production/Preview)

---

## 🛍️ Shopify Storefront API Configuration

### `PUBLIC_STOREFRONT_API_TOKEN`
- **Type:** `string` (hex token)
- **Example:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Purpose:** Authenticate read-only Storefront API queries
- **Used By:** 
  - `app/root.jsx` → GraphQL queries for products, collections, cart
  - `app/lib/context.js` → Hydrogen client configuration
- **Required:** ✅ Yes
- **Scope:** Client-side (exposed in browser)
- **Access Level:** Read-only (products, collections, cart)

### `PRIVATE_STOREFRONT_API_TOKEN`
- **Type:** `string` (starts with `shpat_`)
- **Example:** `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Purpose:** Authenticate server-side Storefront API queries
- **Used By:** `app/lib/context.js` → Hydrogen server configuration
- **Required:** ✅ Yes (for server-side queries)
- **Scope:** Server-side only
- **Access Level:** Read-only (all storefront data)

### `PUBLIC_STORE_DOMAIN`
- **Type:** `string` (Shopify store domain)
- **Example:** `nexa-desk-7nlxxvwi.myshopify.com`
- **Purpose:** Identifies which Shopify store to query
- **Used By:** 
  - `app/root.jsx` → Passed to client as `publicStoreDomain`
  - Hydrogen client setup
- **Required:** ✅ Yes
- **Scope:** Client-side (exposed in browser)

### `PUBLIC_STOREFRONT_ID`
- **Type:** `string` (numeric ID)
- **Example:** `1000181336`
- **Purpose:** Storefront identifier for analytics
- **Used By:** `app/root.jsx` → Google Analytics setup
- **Required:** ✅ Yes
- **Scope:** Client-side (exposed in browser)

### `SHOP_ID`
- **Type:** `string` (numeric ID)
- **Example:** `10194983580`
- **Purpose:** Shop identifier for API calls
- **Used By:** Shopify API endpoints
- **Required:** ✅ Yes
- **Scope:** Server-side configuration

---

## 👤 Customer Account API Configuration

### `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- **Type:** `string` (UUID format)
- **Example:** `7bf97ea-d37f-42b0-b1a3-228f3ed4ee50`
- **Purpose:** Authenticate Customer Account API requests
- **Used By:** 
  - `app/routes/account*.jsx` → Customer authentication
  - OAuth login/register flow
- **Required:** ✅ Yes (for customer features)
- **Scope:** Client-side (exposed in browser)

### `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- **Type:** `string` (Shopify customer account URL)
- **Example:** `https://shopify.com/10194983580`
- **Purpose:** Customer Account API endpoint
- **Used By:** Customer account queries and mutations
- **Required:** ✅ Yes (for customer features)
- **Scope:** Client-side (exposed in browser)

---

## 🔑 OAuth Application Endpoints

### `OAUTH_AUTHORIZE_ENDPOINT`
- **Type:** `string` (OAuth authorization URL)
- **Example:** `https://shopify.com/authentication/10194983580/oauth/authorize`
- **Purpose:** Redirect URL for customer login
- **Used By:** `app/routes/account_.login.jsx`
- **Required:** ✅ Yes (for login)
- **Scope:** Server-side configuration

### `OAUTH_TOKEN_ENDPOINT`
- **Type:** `string` (OAuth token URL)
- **Example:** `https://shopify.com/authentication/10194983580/oauth/token`
- **Purpose:** Exchange authorization code for access token
- **Used By:** Customer Account API authentication
- **Required:** ✅ Yes (for login)
- **Scope:** Server-side configuration

### `OAUTH_LOGOUT_ENDPOINT`
- **Type:** `string` (OAuth logout URL)
- **Example:** `https://shopify.com/authentication/10194983580/logout`
- **Purpose:** Logout customer and clear session
- **Used By:** `app/routes/account_.logout.jsx`
- **Required:** ✅ Yes (for logout)
- **Scope:** Server-side configuration

---

## 📊 Analytics Configuration

### `PUBLIC_GTM_ID`
- **Type:** `string` (Google Tag Manager ID)
- **Example:** `GTM-NEXADESK`
- **Purpose:** Google Tag Manager container for tracking
- **Used By:** `app/root.jsx` → GTM script injection
- **Required:** ❌ No (optional)
- **Scope:** Client-side (exposed in browser)
- **Default:** `GTM-NEXADESK`

---

## 🔄 How Environment Variables Flow Through the App

```
.env file
    ↓
app/lib/context.js (createHydrogenRouterContext)
    ↓
app/root.jsx (loader function)
    ↓
React Context / Route Loaders
    ↓
Components (useOutletContext, useRouteLoaderData)
```

### Example Usage in Components:

```jsx
import {useOutletContext} from 'react-router';

export default function MyComponent() {
  const {oauth, publicStoreDomain, publicGtmId} = useOutletContext();
  
  // Use environment-based values
  console.log(oauth.authorizeEndpoint);
  console.log(publicStoreDomain);
}
```

---

## ✅ Configuration Checklist

- [x] `SESSION_SECRET` — Set (Production token)
- [x] `PRIVATE_STOREFRONT_API_TOKEN` — Set (shpat_...)
- [x] `PUBLIC_STOREFRONT_API_TOKEN` — Set (hex string)
- [x] `PUBLIC_STORE_DOMAIN` — Set (myshopify.com)
- [x] `PUBLIC_STOREFRONT_ID` — Set (numeric)
- [x] `SHOP_ID` — Set (numeric)
- [x] `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` — Set (UUID)
- [x] `PUBLIC_CUSTOMER_ACCOUNT_API_URL` — Set (shopify.com URL)
- [x] `OAUTH_AUTHORIZE_ENDPOINT` — Set (shopify.com/authentication/...)
- [x] `OAUTH_TOKEN_ENDPOINT` — Set (shopify.com/authentication/...)
- [x] `OAUTH_LOGOUT_ENDPOINT` — Set (shopify.com/authentication/...)
- [x] `PUBLIC_GTM_ID` — Set (optional, default: GTM-NEXADESK)

---

## 🔒 Security Notes

### Public Variables (Exposed in Browser)
- ✓ `PUBLIC_STOREFRONT_API_TOKEN`
- ✓ `PUBLIC_STORE_DOMAIN`
- ✓ `PUBLIC_STOREFRONT_ID`
- ✓ `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`
- ✓ `PUBLIC_CUSTOMER_ACCOUNT_API_URL`
- ✓ `PUBLIC_GTM_ID`

### Private Variables (Server-side only)
- 🔐 `SESSION_SECRET`
- 🔐 `PRIVATE_STOREFRONT_API_TOKEN`
- 🔐 `SHOP_ID`
- 🔐 `OAUTH_*_ENDPOINT`

### Never Commit to Git
- Don't commit `.env` file to version control
- Use `.env.example` for documenting structure
- Store real values in CI/CD secrets (GitHub Actions, Oxygen, etc.)

---

## 🚀 Deployment

### GitHub Actions CI/CD
Environment variables are stored as GitHub Secrets and injected at build time:
- `.github/workflows/deploy.yml` references `${{ secrets.* }}`

### Shopify Oxygen
Environment variables are managed through:
- Shopify Admin → Settings → Apps and integrations → Develop apps
- Or via CLI: `shopify hydrogen env pull`

---

## 📖 Related Files

- `.env` — Local development environment variables
- `.env.example` — Template for required variables (in version control)
- `app/lib/context.js` — Environment variable initialization
- `app/root.jsx` — Environment variables exported to app context
- `.github/workflows/deploy.yml` — CI/CD environment configuration

---

## 🆘 Troubleshooting

### 403 Forbidden Error
- Check `PUBLIC_STOREFRONT_API_TOKEN` is valid and not expired
- Verify token is correctly copied (no extra spaces or typos)
- Ensure token has `read_product_listings` scope

### UNAUTHORIZED GraphQL Error
- Token format is correct but not being sent with request
- For GraphQL testing, manually include token in Authorization header
- Server-side queries auto-include token (homepage, products)

### Missing Environment Variables
- Run `npm run dev` to see which variables are missing
- Check `.env` file exists in project root
- Verify format: `KEY="value"` (with quotes)

---

**Last Updated:** October 2, 2026  
**Storefront:** NexaDesk (nexa-desk-7nlxxvwi.myshopify.com)
