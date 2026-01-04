/**
 * Date formatting utilities
 * All dates should be displayed as yyyy-MM-dd format without time
 */

/**
 * Format date to yyyy-MM-dd
 * Removes time portion and the T separator
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "-"

  // Handle ISO format with T separator (e.g., "2024-12-24T10:30:00")
  if (dateString.includes("T")) {
    return dateString.split("T")[0]
  }

  // Handle datetime format with space (e.g., "2024-12-24 10:30:00")
  if (dateString.includes(" ")) {
    return dateString.split(" ")[0]
  }

  // Already in date-only format
  return dateString
}

/**
 * Format date object to yyyy-MM-dd
 */
export function formatDateObject(date: Date | null | undefined): string {
  if (!date) return "-"

  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return "-"

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

/**
 * Get current date in yyyy-MM-dd format
 */
export function getCurrentDate(): string {
  return formatDateObject(new Date())
}
