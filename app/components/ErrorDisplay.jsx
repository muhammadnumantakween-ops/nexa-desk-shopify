import React, {useState} from 'react';
import {Link} from 'react-router';
import {getStatusIllustration} from '~/components/StatusIllustrations';

/**
 * Status descriptions and user-friendly guidance
 */
const STATUS_METADATA = {
  200: {
    badge: 'Success',
    title: 'Operation Completed Successfully',
    description: 'Everything is in working order and your request completed as intended.',
    themeColor: '#059669',
    bgColor: '#ecfdf5',
  },
  301: {
    badge: 'Moved Permanently',
    title: 'Resource Has Relocated',
    description: 'This page or product has moved to a new URL address.',
    themeColor: '#2563eb',
    bgColor: '#eff6ff',
  },
  302: {
    badge: 'Found / Redirecting',
    title: 'Temporary Redirection',
    description: 'You are being routed to another location.',
    themeColor: '#2563eb',
    bgColor: '#eff6ff',
  },
  400: {
    badge: 'Bad Request',
    title: 'Invalid Request Parameters',
    description: 'The server could not understand the request due to malformed syntax or invalid options.',
    themeColor: '#d97706',
    bgColor: '#fffbeb',
  },
  401: {
    badge: 'Unauthorized',
    title: 'Authentication Required',
    description: 'Please log in to your Nexa Desk account to view this resource.',
    themeColor: '#d97706',
    bgColor: '#fffbeb',
  },
  403: {
    badge: 'Access Forbidden',
    title: 'Permission Denied',
    description: 'You do not have administrative privileges to access this area.',
    themeColor: '#dc2626',
    bgColor: '#fef2f2',
  },
  404: {
    badge: 'Page Not Found',
    title: 'We Couldn’t Locate That Page',
    description: 'The product, setup configuration, or page you were searching for does not exist or may have been discontinued.',
    themeColor: '#4f46e5',
    bgColor: '#eef2ff',
  },
  500: {
    badge: 'Internal Server Error',
    title: 'Something Went Wrong On Our End',
    description: 'Our servers experienced an unexpected condition. Our team has been alerted.',
    themeColor: '#dc2626',
    bgColor: '#fef2f2',
  },
  502: {
    badge: 'Bad Gateway',
    title: 'Upstream Service Unreachable',
    description: 'The storefront received an invalid response from Shopify or an upstream service.',
    themeColor: '#dc2626',
    bgColor: '#fef2f2',
  },
  503: {
    badge: 'Service Unavailable',
    title: 'System Temporarily Unavailable',
    description: 'The service is temporarily undergoing scheduled maintenance or high traffic volume.',
    themeColor: '#dc2626',
    bgColor: '#fef2f2',
  },
};

export function ErrorDisplay({
  status = 500,
  title,
  message,
  technicalDetails,
  showHomeButton = true,
  showRetryButton = true,
  onRetry,
}) {
  const [copied, setCopied] = useState(false);

  const code = Number(status) || 500;
  const meta = STATUS_METADATA[code] || {
    badge: `Status ${code}`,
    title: code >= 500 ? 'Server Fault' : code >= 400 ? 'Client Error' : 'System Notice',
    description: 'An unexpected state occurred while processing your request.',
    themeColor: '#4b5563',
    bgColor: '#f9fafb',
  };

  const displayTitle = title || meta.title;
  const displayDescription = message || meta.description;

  const handleCopyError = () => {
    const errorText = typeof technicalDetails === 'string'
      ? technicalDetails
      : JSON.stringify(technicalDetails, null, 2);
    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.outerContainer}>
      <div style={styles.card}>
        {/* Animated SVG Graphic */}
        <div style={styles.illustrationWrapper}>
          {getStatusIllustration(code)}
        </div>

        {/* Status Badge */}
        <span
          style={{
            ...styles.badge,
            color: meta.themeColor,
            background: meta.bgColor,
            border: `1px solid ${meta.themeColor}33`,
          }}
        >
          HTTP {code} • {meta.badge}
        </span>

        {/* Heading & Context Message */}
        <h1 style={styles.heading}>{displayTitle}</h1>
        <p style={styles.description}>{displayDescription}</p>

        {/* Technical Error Trace (Foldable) */}
        {technicalDetails && (
          <details style={styles.details}>
            <summary style={styles.summaryContainer}>
              <span style={styles.summary}>Technical Error Log</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCopyError();
                }}
                style={{
                  ...styles.copyButton,
                  background: copied ? '#059669' : '#e5e7eb',
                  color: copied ? '#ffffff' : '#374151',
                }}
                title="Copy error details"
              >
                {copied ? '✓ Copied' : '📋 Copy'}
              </button>
            </summary>
            <pre style={styles.pre}>
              {typeof technicalDetails === 'string'
                ? technicalDetails
                : JSON.stringify(technicalDetails, null, 2)}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div style={styles.actionsRow}>
          {showHomeButton && (
            <Link to="/" style={styles.primaryButton}>
              Return to Homepage
            </Link>
          )}

          {showRetryButton && (
            <button
              onClick={() => (onRetry ? onRetry() : window.location.reload())}
              style={styles.secondaryButton}
            >
              🔄 Try Again
            </button>
          )}

          <Link to="/find-my-setup" style={styles.linkButton}>
            Find My Setup →
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  outerContainer: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    background: 'radial-gradient(circle at 50% 30%, #f9fafb 0%, #f3f4f6 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    maxWidth: '560px',
    width: '100%',
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e5e7eb',
  },
  illustrationWrapper: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#111827',
    margin: '0 0 0.75rem 0',
    lineHeight: '1.25',
  },
  description: {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: '1.5',
    margin: '0 0 1.75rem 0',
  },
  details: {
    margin: '1.5rem 0',
    textAlign: 'left',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
  },
  summaryContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '0.75rem',
  },
  summary: {
    fontWeight: '600',
    color: '#475569',
    flex: 1,
    textAlign: 'left',
  },
  copyButton: {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  pre: {
    marginTop: '0.75rem',
    padding: '0.5rem',
    background: '#0f172a',
    color: '#f8fafc',
    borderRadius: '6px',
    overflowX: 'auto',
    fontSize: '0.75rem',
    maxHeight: '180px',
  },
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    background: '#111827',
    color: '#ffffff',
    padding: '0.75rem 1.4rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'background 0.2s',
  },
  secondaryButton: {
    background: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  linkButton: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    padding: '0.5rem',
  },
};
