
export type Book = {
  title: string;
  author: string;
  content: string;
  font?: string;
  theme?: string;
}

// TODO: maybe we should use branded type for EncodedBook?

export const encodeBook = (book: Book): string => {
  const bookData = JSON.stringify(book)
  const encodedData = encodeURIComponent(btoa(bookData))
  return encodedData
}

export const decodeBook = (encodedBook: string): Book | null => {
  try {
    const decodedData = decodeURIComponent(encodedBook)
    const bookData = atob(decodedData)
    const book = JSON.parse(bookData) as Book

    // Validate that the decoded object has the required Book properties
    if (!book.title || !book.author || !book.content) {
      throw new InvalidBookError('Invalid book data structure')
    }

    return book
  } catch (error) {
    console.error('Error decoding book from URL:', error)
    throw new InvalidBookError('Invalid book data structure')
  }
}

/**
 * InvalidBookError means that a (decoded) book does not have the expected structure.
 * This can happen if the book data is malformed or missing required fields.
 * It is used to indicate that the book data cannot be processed as expected.
 */
export class InvalidBookError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidBookError'
  }
}
