<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { PageFlip } from 'page-flip'
import type { Book } from '../domain/book'

const props = defineProps<{
  book: Book
  showCloseButton?: boolean
}>()

defineEmits<{
  close: []
}>()

const bookContainer = ref<HTMLElement>()
let pageFlip: PageFlip | null = null
const currentPage = ref(0)
const totalPages = ref(0)

// Computed font family with fallbacks
const fontFamily = computed(() => {
  const selectedFont = props.book.font || 'Georgia, serif'
  return selectedFont
})

// Split content into pages (approximate words per page)
const wordsPerPage = 200
const splitIntoPages = (content: string) => {
  const words = content.split(/\s+/)
  const pages = []

  for (let i = 0; i < words.length; i += wordsPerPage) {
    const pageWords = words.slice(i, i + wordsPerPage)
    pages.push(pageWords.join(' '))
  }

  return pages.length > 0 ? pages : [content]
}

const createPageElement = (content: string, isTitle = false) => {
  const page = document.createElement('div')
  page.className = 'book-page'
  page.setAttribute('data-density', isTitle ? 'hard' : 'soft')

  if (isTitle) {
    page.innerHTML = `
      <div class="page-content title-page">
        ${content}
      </div>
    `
  } else {
    page.innerHTML = `
      <div class="page-content">
        <div class="page-text">
          ${content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
        </div>
      </div>
    `
  }

  return page
}

const createPages = () => {
  const pages: HTMLElement[] = []

  // Title page
  pages.push(createPageElement(`<h1>${props.book.title}</h1><p>by ${props.book.author}</p>`, true))

  // Content pages
  const contentPages = splitIntoPages(props.book.content)
  contentPages.forEach(pageContent => {
    pages.push(createPageElement(pageContent))
  })

  return pages
}

const getContainerDimensions = () => {
  if (!bookContainer.value) return null

  const rect = bookContainer.value.getBoundingClientRect()

  // If container has no dimensions, use parent or fallback
  if (rect.width <= 0 || rect.height <= 0) {
    const computedStyle = getComputedStyle(bookContainer.value)
    const width = parseInt(computedStyle.width) || 800
    const height = parseInt(computedStyle.height) || 600

    return { width, height }
  }

  return { width: rect.width, height: rect.height }
}

const goToPreviousPage = () => {
  if (pageFlip && currentPage.value > 0) {
    pageFlip.flipPrev()
  }
}

const goToNextPage = () => {
  if (pageFlip && currentPage.value < totalPages.value - 1) {
    pageFlip.flipNext()
  }
}

const initializePageFlip = async () => {
  if (!bookContainer.value) return false

  try {
    // Clean up existing instance
    if (pageFlip) {
      pageFlip.destroy()
      pageFlip = null
    }

    const dimensions = getContainerDimensions()
    if (!dimensions) {
      console.warn('Could not get container dimensions')
      return false
    }

    console.log('Initializing PageFlip with dimensions:', dimensions)

    // Create PageFlip instance
    pageFlip = new PageFlip(bookContainer.value, {
      width: Math.max(200, dimensions.width / 2),
      height: Math.max(300, dimensions.height),
      size: 'stretch',
      minWidth: 200,
      maxWidth: dimensions.width,
      minHeight: 300,
      maxHeight: dimensions.height,
      drawShadow: true,
      flippingTime: 1000,
      usePortrait: true,
      autoSize: true,
      showCover: true,
      mobileScrollSupport: true,
      swipeDistance: 20,
      clickEventForward: true
    })

    // Create and load pages
    const pages = createPages()
    pageFlip.loadFromHTML(pages)

    // Set total pages
    totalPages.value = pages.length

    // Add event listeners
    pageFlip.on('flip', (e) => {
      currentPage.value = e.data
      console.log('Current page:', e.data)
    })

    pageFlip.on('changeState', (e) => {
      console.log('State changed:', e.data)
    })

    pageFlip.on('init', () => {
      currentPage.value = 0
    })

    console.log('PageFlip initialized successfully')
    return true

  } catch (error) {
    console.error('Error initializing PageFlip:', error)
    return false
  }
}

const waitForContainer = () => {
  return new Promise<void>((resolve) => {
    const checkContainer = () => {
      if (bookContainer.value) {
        const dimensions = getContainerDimensions()
        if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
          resolve()
          return
        }
      }
      setTimeout(checkContainer, 50)
    }
    checkContainer()
  })
}

onMounted(async () => {
  await nextTick()

  try {
    // Wait for container to be ready
    await waitForContainer()

    // Initialize PageFlip
    const success = await initializePageFlip()

    if (!success) {
      console.warn('Initial PageFlip initialization failed')
    }

  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})

onUnmounted(() => {
  // Clean up PageFlip instance
  if (pageFlip) {
    pageFlip.destroy()
    pageFlip = null
  }
})
</script>

<template>
  <div class="book-reader">
    <div class="container">
      <!-- Close button for preview mode -->
      <button v-if="showCloseButton" @click="$emit('close')" class="close-button">
        ✕
      </button>

      <!-- PageFlip Book Container -->
      <div ref="bookContainer" class="book-container" :style="{ fontFamily }"></div>

      <!-- Navigation buttons -->
      <div class="navigation-controls">
        <button
          @click="goToPreviousPage"
          :disabled="currentPage <= 0"
          class="nav-button prev-button"
        >
          ← Previous
        </button>
        <span class="page-indicator">
          {{ currentPage + 1 }} / {{ totalPages }}
        </span>
        <button
          @click="goToNextPage"
          :disabled="currentPage >= totalPages - 1"
          class="nav-button next-button"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-reader {
  padding: 2rem;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  height: 90vh; /* Make container take most of viewport height */
  min-height: 600px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
}

.book-container {
  width: 100%;
  height: 70vh; /* Reduced to make room for navigation */
  min-height: 450px;
  max-height: 750px;
  margin: 0 auto;
  position: relative;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  margin-top: 1rem;
}

.nav-button {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-button:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.nav-button:disabled {
  background: #cbd5e0;
  color: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

.page-indicator {
  font-size: 1rem;
  color: #4a5568;
  font-weight: 500;
}

/* Global styles for PageFlip pages */
:global(.book-page) {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0;
  margin: 0;
  overflow: hidden;
}

:global(.page-content) {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  line-height: 1.6;
  color: #2d3748;
}

:global(.title-page) {
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

:global(.title-page h1) {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  color: white;
}

:global(.title-page p) {
  font-size: 1.25rem;
  font-style: italic;
  opacity: 0.9;
  margin: 0;
  color: white;
}

:global(.page-text) {
  flex: 1;
  overflow: hidden;
}

:global(.page-text p) {
  margin-bottom: 1rem;
  text-align: justify;
  text-indent: 1.5rem;
  font-size: 1rem;
  line-height: 1.7;
}

:global(.page-text p:first-child) {
  text-indent: 0;
}

@media (max-width: 768px) {
  .book-reader {
    padding: 1rem;
  }

  .container {
    padding: 1rem;
  }

  .book-container {
    height: 60vh;
    min-height: 350px;
    max-height: 550px;
  }

  .navigation-controls {
    padding: 0.75rem 0;
    margin-top: 0.75rem;
  }

  .nav-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .page-indicator {
    font-size: 0.9rem;
  }

  .close-button {
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  :global(.page-content) {
    padding: 1.5rem;
  }

  :global(.page-title) {
    font-size: 2rem;
  }

  :global(.page-text p) {
    font-size: 0.9rem;
    text-indent: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    height: 80vh;
    min-height: 500px;
  }

  .book-container {
    height: 50vh;
    min-height: 300px;
    max-height: 450px;
  }

  .navigation-controls {
    padding: 0.5rem 0;
    margin-top: 0.5rem;
  }

  .nav-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .page-indicator {
    font-size: 0.85rem;
  }

  :global(.page-content) {
    padding: 1rem;
  }

  :global(.page-title) {
    font-size: 1.5rem;
  }

  :global(.page-text p) {
    font-size: 0.85rem;
  }
}
</style>
