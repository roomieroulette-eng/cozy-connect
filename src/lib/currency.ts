/**
 * Auto-detect currency from browser locale and format amounts accordingly.
 * Supports manual override via localStorage.
 */

const CURRENCY_OVERRIDE_KEY = "currency_override";

/** All supported currencies for the override picker */
export const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "NZD", label: "New Zealand Dollar", symbol: "NZ$" },
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "KRW", label: "South Korean Won", symbol: "₩" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "MXN", label: "Mexican Peso", symbol: "MX$" },
  { code: "ARS", label: "Argentine Peso", symbol: "AR$" },
  { code: "COP", label: "Colombian Peso", symbol: "CO$" },
  { code: "CLP", label: "Chilean Peso", symbol: "CL$" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦" },
  { code: "KES", label: "Kenyan Shilling", symbol: "KSh" },
  { code: "EGP", label: "Egyptian Pound", symbol: "E£" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", label: "Hong Kong Dollar", symbol: "HK$" },
  { code: "TWD", label: "Taiwan Dollar", symbol: "NT$" },
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "PHP", label: "Philippine Peso", symbol: "₱" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "VND", label: "Vietnamese Dong", symbol: "₫" },
  { code: "TRY", label: "Turkish Lira", symbol: "₺" },
  { code: "PLN", label: "Polish Zloty", symbol: "zł" },
  { code: "CZK", label: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", label: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", label: "Romanian Leu", symbol: "lei" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", symbol: "kr" },
  { code: "RUB", label: "Russian Ruble", symbol: "₽" },
  { code: "UAH", label: "Ukrainian Hryvnia", symbol: "₴" },
  { code: "SAR", label: "Saudi Riyal", symbol: "﷼" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ" },
  { code: "ILS", label: "Israeli Shekel", symbol: "₪" },
] as const;

function detectCurrency(): string {
  try {
    const locale = navigator.language || "en-US";

    const localeCurrencyMap: Record<string, string> = {
      "en-US": "USD", "en-GB": "GBP", "en-AU": "AUD", "en-CA": "CAD",
      "en-NZ": "NZD", "en-IN": "INR", "en-ZA": "ZAR", "en-NG": "NGN",
      "en-KE": "KES", "en-SG": "SGD", "en-HK": "HKD", "en-PH": "PHP",
      "fr-FR": "EUR", "de-DE": "EUR", "es-ES": "EUR", "it-IT": "EUR",
      "nl-NL": "EUR", "pt-PT": "EUR", "pt-BR": "BRL", "es-MX": "MXN",
      "es-AR": "ARS", "es-CO": "COP", "es-CL": "CLP", "ja-JP": "JPY",
      "ko-KR": "KRW", "zh-CN": "CNY", "zh-TW": "TWD", "th-TH": "THB",
      "vi-VN": "VND", "id-ID": "IDR", "ms-MY": "MYR", "tr-TR": "TRY",
      "pl-PL": "PLN", "cs-CZ": "CZK", "hu-HU": "HUF", "ro-RO": "RON",
      "sv-SE": "SEK", "nb-NO": "NOK", "da-DK": "DKK", "fi-FI": "EUR",
      "ru-RU": "RUB", "uk-UA": "UAH", "ar-SA": "SAR", "ar-AE": "AED",
      "ar-EG": "EGP", "he-IL": "ILS",
    };

    const currency = localeCurrencyMap[locale];
    if (currency) return currency;

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
    try {
      const override = localStorage.getItem(CURRENCY_OVERRIDE_KEY);
      if (override && SUPPORTED_CURRENCIES.some(c => c.code === override)) {
        _cachedCurrency = override;
        return _cachedCurrency;
      }
    } catch {
      // localStorage not available
    }
    _cachedCurrency = "NGN";
  }
  return _cachedCurrency;
}

/** Set a manual currency override. Pass null to reset to auto-detect. */
export function setCurrencyOverride(currencyCode: string | null): void {
  try {
    if (currencyCode) {
      localStorage.setItem(CURRENCY_OVERRIDE_KEY, currencyCode);
    } else {
      localStorage.removeItem(CURRENCY_OVERRIDE_KEY);
    }
  } catch {
    // localStorage not available
  }
  // Clear cache so next call picks up the change
  _cachedCurrency = null;
}

/** Check if there's a manual override set. */
export function getCurrencyOverride(): string | null {
  try {
    return localStorage.getItem(CURRENCY_OVERRIDE_KEY);
  } catch {
    return null;
  }
}

/**
 * Format a number as currency using the browser's locale.
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
