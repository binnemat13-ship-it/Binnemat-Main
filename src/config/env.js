// Application Environment Configuration (12-Factor App)
function normalizeApiUrl(rawUrl, defaultPath, wpJsonNamespace) {
  if (!rawUrl || typeof rawUrl !== 'string') return defaultPath;
  let url = rawUrl.trim();
  if (!url) return defaultPath;

  // Local/relative proxy paths like '/api-wc' or '/api-wc-v3'
  if (url.startsWith('/')) {
    return url.replace(/\/+$/, '');
  }

  // Full URL handling (e.g. https://api.binnemat.com)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    url = url.replace(/\/+$/, '');
    // If user provided origin without /wp-json namespace, append it
    if (!url.includes('/wp-json')) {
      url = `${url}${wpJsonNamespace}`;
    }
    return url;
  }

  return url.replace(/\/+$/, '');
}

function resolveWpApiUrl() {
  return normalizeApiUrl(import.meta.env.VITE_WP_API_URL, '/api-wc', '/wp-json/wc/store/v1');
}

function resolveWcV3ApiUrl() {
  return normalizeApiUrl(import.meta.env.VITE_WC_V3_URL, '/api-wc-v3', '/wp-json/wc/v3');
}

function resolveWpV2ApiUrl() {
  if (import.meta.env.VITE_WP_V2_URL) {
    return import.meta.env.VITE_WP_V2_URL.trim().replace(/\/+$/, '');
  }
  const wpApiUrl = import.meta.env.VITE_WP_API_URL?.trim();
  if (wpApiUrl && (wpApiUrl.startsWith('http://') || wpApiUrl.startsWith('https://'))) {
    try {
      const origin = new URL(wpApiUrl).origin;
      return `${origin}/wp-json/wp/v2`;
    } catch (e) {}
  }
  return '/api-wp-v2';
}

export const APP_CONFIG = Object.freeze({
  WP_API_URL: resolveWpApiUrl(),
  WC_V3_API_URL: resolveWcV3ApiUrl(),
  WP_V2_API_URL: resolveWpV2ApiUrl(),
  WC_CONSUMER_KEY: import.meta.env.VITE_WC_CONSUMER_KEY || '',
  WC_CONSUMER_SECRET: import.meta.env.VITE_WC_CONSUMER_SECRET || '',
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || '',
  ADMIN_PATH: import.meta.env.VITE_ADMIN_PATH || '/bn-portal-2026',
  WP_USER: import.meta.env.VITE_WP_USER || '',
  WP_APP_PASS: import.meta.env.VITE_WP_APP_PASS || '',
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER || '923212418430',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Binnemat',
  SLOGAN_URDU: import.meta.env.VITE_APP_SLOGAN_URDU || 'ہر گھر کا سکون',
  // Official UBL Bank Details for Direct IBFT & Card Acceptance
  BANK_NAME: import.meta.env.VITE_BANK_NAME || 'United Bank Limited (UBL)',
  BANK_ACCOUNT_TITLE: import.meta.env.VITE_BANK_ACCOUNT_TITLE || 'BIN NEMAT APPLIANCES',
  BANK_ACCOUNT_NUMBER: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '12345678901234',
  BANK_IBAN: import.meta.env.VITE_BANK_IBAN || 'PK00UNIL0109000123456789',
  BANK_BRANCH: import.meta.env.VITE_BANK_BRANCH || 'Main Branch, Gujranwala',
  UBL_PAY_URL: import.meta.env.VITE_UBL_PAY_URL || '',
  DEVELOPER_NAME: 'Awais Ahmad',
  DEVELOPER_PHONE: '+92 321 2418430',
  DEVELOPER_WHATSAPP: 'https://wa.me/923212418430',
  REQUEST_TIMEOUT_MS: 10000
});

export function getWhatsAppOrderUrl(productName, price) {
  const message = encodeURIComponent(
    `Salam Binnemat, I want to order this appliance: ${productName} (${price}). Please confirm stock and delivery timeline.`
  );
  return `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
}
