/**
 * Money formatting utilities
 * Format budget amounts in 万元 (ten thousand yuan) with 2 decimal places
 */

/**
 * Format money amount to display in 万元 with 2 decimal places
 * @param amount - Amount in yuan
 * @returns Formatted string like "123.45" (representing 123.45万元)
 */
export function formatMoney(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "0.00"

  // Convert yuan to 万元 (divide by 10000) and format to 2 decimal places
  const amountInWan = amount / 10000
  return amountInWan.toFixed(2)
}

/**
 * Format money with unit suffix
 * @param amount - Amount in yuan
 * @returns Formatted string like "123.45万元"
 */
export function formatMoneyWithUnit(amount: number | null | undefined): string {
  return formatMoney(amount) + "万元"
}
