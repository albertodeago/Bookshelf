import { describe, it, expect } from 'vitest'
import { encodeBook, decodeBook, InvalidBookError } from './book'

// Regex to match URL-safe characters including percent-encoded characters
// Includes: A-Z, a-z, 0-9, hyphen (-), underscore (_), period (.), tilde (~)
// and percent-encoded characters (%XX where XX are hexadecimal digits)
const URL_SAFE_REGEX = /^[A-Za-z0-9\-_.~%]*$/

describe('Book domain', () => {
  it('should encode a book to a URL-safe string', () => {
    const book = {
      title: 'Test Book',
      author: 'Test Author',
      content: 'This is a test book.',
    }
    const encoded = encodeBook(book)
    expect(encoded).toBeDefined()
    expect(typeof encoded).toBe('string')
    // Check if the encoded string is URL-safe
    expect(encoded).toMatch(URL_SAFE_REGEX)
  })

  it('should decode a URL-safe string back to a book', () => {
    const book = {
      title: 'Test Book',
      author: 'Test Author',
      content: 'This is @ test book that conta!ns $pecial characters.',
    }
    const encoded = encodeBook(book)
    const decoded = decodeBook(encoded)
    expect(decoded).toEqual(book)
  })

  it('should throw an error for invalid book data', () => {
    const invalidEncoded = 'invalid_d@ta'
    expect(() => decodeBook(invalidEncoded)).toThrow(InvalidBookError)
  })
})
