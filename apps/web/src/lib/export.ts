/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return ''

  // Get headers from first object if not provided
  const keys = headers || Object.keys(data[0])

  // Create header row
  const headerRow = keys.join(',')

  // Create data rows
  const dataRows = data.map((row) => {
    return keys
      .map((key) => {
        const value = row[key]
        // Handle values that contain commas, quotes, or newlines
        if (
          value === null ||
          value === undefined ||
          value === ''
        ) {
          return ''
        }
        const stringValue = String(value)
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download data as CSV file
 */
export function downloadCSV(
  data: any[],
  filename: string,
  headers?: string[]
): void {
  const csv = arrayToCSV(data, headers)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }) // BOM for UTF-8
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.json`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Format datetime for export
 */
export function formatDateTimeForExport(date: Date): string {
  return date.toLocaleString('ru-RU')
}
