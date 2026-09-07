/**
 * Throttles a function to limit its execution to once every specified duration.
 *
 * @param func - The function to throttle.
 * @param limit - The minimum delay in milliseconds between calls.
 * @returns A throttled version of the provided function.
 */
export const throttle = (
  func: (...args: unknown[]) => void,
  limit: number,
): ((...args: unknown[]) => void) => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return function (this: unknown, ...args: unknown[]) {
    if (lastRan === null) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      if (lastFunc !== null) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(
        () => {
          if (Date.now() - (lastRan as number) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        },
        limit - (Date.now() - (lastRan as number)),
      );
    }
  };
};

/**
 * Debounces a function to delay its execution until after a specified delay.
 *
 * @param func - The function to debounce.
 * @param wait - The delay in milliseconds.
 * @returns A debounced version of the provided function.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Generates a unique identifier using the current timestamp and a random number.
 *
 * @returns A string representing the unique ID.
 */
export function uid(): string {
  return (Date.now() + Math.floor(Math.random() * 1000)).toString();
}

/**
 * Extracts initials from a given name.
 *
 * @param name - The full name to extract initials from.
 * @param count - The number of initials to return. Defaults to all initials.
 * @returns A string of initials from the name.
 */
export const getInitials = (
  name: string | null | undefined,
  count?: number,
): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase());

  return count && count > 0
    ? initials.slice(0, count).join('')
    : initials.join('');
};

/**
 * Formats a date as a readable string in "Month Day, Year" format.
 *
 * @param input - A date string or timestamp to format.
 * @returns A string formatted as "Month Day, Year".
 */
export function formatDate(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date and time as a readable string in "Month Day, Year, Hour:Minute AM/PM" format.
 *
 * @param input - A date string or timestamp to format.
 * @returns A string formatted as "Month Day, Year, Hour:Minute AM/PM".
 */
export function formatDateTime(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
}

/**
 * Formats a number as a currency string.
 *
 * @param amount - The numeric value to format as currency.
 * @param currency - The currency code (e.g., "USD", "EUR"). Defaults to "USD".
 * @param locale - The locale for formatting (e.g., "en-US"). Defaults to "en-US".
 * @returns A string formatted as currency.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Constructs an absolute URL for media assets.
 *
 * @param path - The relative path to the media asset (e.g., "/media/avatars/1.png").
 * @returns A string representing the absolute URL to the media asset.
 */
export function toAbsoluteUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
}

/**
  Retrieves a list of supported time zones with their labels and values.
  This function fetches the available time zones from the environment,
  formats their offsets (e.g., "GMT+2"), and returns them in a sorted array.
*/
export const getTimeZones = (): { label: string; value: string }[] => {
  // Fetch supported timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  return timezones
    .map((timezone) => {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(new Date());
      const offset =
        parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
      const formattedOffset = offset === 'GMT' ? 'GMT+0' : offset;

      return {
        value: timezone,
        label: `(${formattedOffset}) ${timezone.replace(/_/g, ' ')}`,
        numericOffset: parseInt(
          formattedOffset.replace('GMT', '').replace('+', '') || '0',
        ),
      };
    })
    .sort((a, b) => a.numericOffset - b.numericOffset);
};

/**
 * Generates a URL-friendly slug from a given title.
 * @param title - The title to convert into a slug (e.g., "Write a Proposal")
 * @returns A slug string (e.g., "write-a-proposal")
 */
export function getSlug(title: string): string {
  // Return empty string for invalid input
  if (!title || typeof title !== 'string') {
    return '';
  }

  return title
    .toLowerCase() // Convert to lowercase for consistency
    .trim() // Remove leading/trailing whitespace
    .normalize('NFD') // Normalize unicode (e.g., "é" -> "e")
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces/hyphens
    .replaceAll(/\s+/g, '-') // Replace spaces with single hyphen
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Formats a numeric count into a compact, human-readable string with appropriate suffix.
 *
 * Converts large numbers into abbreviated format (e.g., 1,500,000 → "1.5M") using standard
 * metric suffixes. The function supports:
 * - Quadrillion (Q): ≥ 1e15
 * - Trillion (T): ≥ 1e12
 * - Billion (B): ≥ 1e9
 * - Million (M): ≥ 1e6
 * - Thousand (k): ≥ 1e3
 *
 * Numbers below 1,000 are returned as plain strings without suffix.
 * Trailing zeros after the decimal point are automatically removed.
 *
 * @example
 * formatCount(1500000);    // Returns "1.5M"
 * formatCount(2500);       // Returns "2.5k"
 * formatCount(999);        // Returns "999"
 * formatCount(1500000000); // Returns "1.5B"
 * formatCount(1200);       // Returns "1.2k"
 * formatCount(1200.5);     // Returns "1.2k" (decimals truncated)
 *
 * @param {number} count - The numeric value to format. Can be integer or decimal.
 *                         Negative values are supported but will be formatted based on absolute value.
 *
 * @returns {string} The formatted count with appropriate suffix, or plain string for values < 1000.
 *
 * @throws {TypeError} If `count` is not a number.
 *
 * @note The function uses 2 decimal places of precision and removes unnecessary trailing zeros.
 *       For example: 1.00M becomes "1M", 1.50M becomes "1.5M".
 */
export function formatCount(count: number): string {
  const suffixes = [
    { threshold: 1e15, suffix: 'Q' },
    { threshold: 1e12, suffix: 'T' },
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'k' },
  ];

  for (const { threshold, suffix } of suffixes) {
    if (count >= threshold) {
      const formatted = (count / threshold).toFixed(2);
      return formatted.replace(/\.?0+$/, '') + suffix;
    }
  }

  return count.toString();
}



export function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;

  if (typeof err === 'object' && err !== null && 'message' in err) {
    return String((err as { message: unknown }).message);
  }

  return 'Something went wrong. Please try again.';
}
