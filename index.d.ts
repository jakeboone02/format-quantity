export as namespace formatQuantity;

/**
 * Formats a number (or string that appears to be a number)
 * as one would see it written in imperial measurements, e.g.
 * "1 1/2" instead of "1.5".
 */
export default function formatQuantity(qty: number | string): string;
