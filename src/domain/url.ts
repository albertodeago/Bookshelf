import { encodeBook, type Book } from "./book"

export const encodeBookToUrl = (book: Book): string => {
  const encodedData = encodeBook(book)
  return `${window.location.origin}/read?book=${encodedData}`
}

export const getEncodedBookFromUrl = (url?: string): string | null => {
  try {
    const urlToUse = url || window.location.href
    const urlParams = new URLSearchParams(new URL(urlToUse).search)
    return urlParams.get('book')
  } catch (error) {
    console.error('Error getting encoded book from URL:', error)
    return null
  }
}
