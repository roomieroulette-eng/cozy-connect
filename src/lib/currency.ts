/**
 * Auto-detect currency from browser locale and format amounts accordingly.
 */

function detectCurrency(): string {
  try {
    const locale = navigator.language || "en-US";
    // Use Intl to resolve the currency for the user's locale
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD", // fallback, we just need the locale's preferred currency
    }).resolvedOptions();

    // Map common locales to their currencies
    const localeCurrencyMap: Record<string, string> = {
      "en-US": "USD",
      "en-GB": "GBP",
      "en-AU": "AUD",
      "en-CA": "CAD",
      "en-NZ": "NZD",
      "en-IN": "INR",
      "en-ZA": "ZAR",
      "en-NG": "NGN",
      "en-KE": "KES",
      "en-SG": "SGD",
      "en-HK": "HKD",
      "en-PH": "PHP",
      "fr-FR": "EUR",
      "de-DE": "EUR",
      "es-ES": "EUR",
      "it-IT": "EUR",
      "nl-NL": "EUR",
      "pt-PT": "EUR",
      "pt-BR": "BRL",
      "es-MX": "MXN",
      "es-AR": "ARS",
      "es-CO": "COP",
      "es-CL": "CLP",
      "ja-JP": "JPY",
      "ko-KR": "KRW",
      "zh-CN": "CNY",
      "zh-TW": "TWD",
      "th-TH": "THB",
      "vi-VN": "VND",
      "id-ID": "IDR",
      "ms-MY": "MYR",
      "tr-TR": "TRY",
      "pl-PL": "PLN",
      "cs-CZ": "CZK",
      "hu-HU": "HUF",
      "ro-RO": "RON",
      "sv-SE": "SEK",
      "nb-NO": "NOK",
      "da-DK": "DKK",
      "fi-FI": "EUR",
      "ru-RU": "RUB",
      "uk-UA": "UAH",
      "ar-SA": "SAR",
      "ar-AE": "AED",
      "ar-EG": "EGP",
      "he-IL": "ILS",
    };

    // Try exact match, then language-country prefix
    const currency = localeCurrencyMap[locale];
    if (currency) return currency;

    // Try matching just the first part with common defaults
    const lang = locale.split("-")[0];
    const langMatch = Object.entries(localeCurrencyMap).find(([key]) => key.startsWith(lang + "-"));
    if (langMatch) return langMatch[1];

    return "USD";
  } catch {
    return "USD";
  }
}

let _cachedCurrency: string | null = null;

export function getUserCurrency(): string {
  if (!_cachedCurrency) {
    _cachedCurrency = detectCurrency();
  }
  return _cachedCurrency;
}

/**
 * Format a number as currency using the browser's locale.
 * Uses compact notation for large numbers and no decimals for whole amounts.
 */
export function formatCurrency(amount: number): string {
  const locale = navigator.language || "en-US";
  const currency = getUserCurrency();
  
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
}

/**
 * Get just the currency symbol for the user's locale.
 */
export function getCurrencySymbol(): string {
  const locale = navigator.language || "en-US";
  const currency = getUserCurrency();
  
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).formatToParts(0);
    
    const symbolPart = parts.find(p => p.type === "currency");
    return symbolPart?.value || "$";
  } catch {
    return "$";
  }
}

/**
 * Format a budget range for display.
 */
export function formatBudgetRange(
  min: number | null | undefined,
  max: number | null | undefined
): string | null {
  if (min && max) return `${formatCurrency(min)}–${formatCurrency(max)}/mo`;
  if (max) return `Up to ${formatCurrency(max)}/mo`;
  if (min) return `From ${formatCurrency(min)}/mo`;
  return null;
}
