/** "1000" + "MDL" -> "1000 MDL".
 *  The club writes prices as a plain amount followed by the currency,
 *  with no thousands separator (matches the reference site). */
export function formatPrice(amount: number, currency: string): string {
  return `${amount} ${currency}`;
}
