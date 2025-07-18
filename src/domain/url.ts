import { encodeBook, type Book } from './book'

/**
 * Gets the base URL of the application, combining the origin with the configured base path
 * @returns The complete base URL (e.g., "https://username.github.io/bookshelf" or "http://localhost:5173")
 */
export const getAppBaseUrl = (): string => {
  const basePath = import.meta.env.BASE_URL || '/'
  const baseUrl = `${window.location.origin}${basePath}`
  // Remove trailing slash if basePath already has one
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

export const encodeBookToUrl = (book: Book): string => {
  const encodedData = encodeBook(book)
  const baseUrl = getAppBaseUrl()
  return `${baseUrl}/#/read?book=${encodedData}`
}

export const getEncodedBookFromUrl = (url?: string): string | null => {
  try {
    const urlToUse = url || window.location.href
    const urlObj = new URL(urlToUse)

    // With hash routing, the query params are in the hash fragment
    // e.g., https://example.com/#/read?book=abc123
    const hash = urlObj.hash
    if (!hash) return null

    // Extract the query string from the hash
    const hashParts = hash.split('?')
    if (hashParts.length < 2) return null

    const queryString = hashParts[1]
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('book')
  } catch (error) {
    console.error('Error getting encoded book from URL:', error)
    return null
  }
}
