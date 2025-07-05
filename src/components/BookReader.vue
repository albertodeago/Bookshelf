<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
// @ts-expect-error - PageFlip types weren't correctly defined so we removed them
import { PageFlip } from 'page-flip'
import type { Book } from '../domain/book'

const props = defineProps<{
  book: Book
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

// For custom themes, we need to create dynamic CSS variables
const customThemeStyles = computed(() => {
  if (!props.book.theme) {
    return {}
  }

  return {
    '--theme-secondary-light': props.book.theme.light,
    '--theme-secondary-dark': props.book.theme.dark,
    '--theme-brand-gradient': `linear-gradient(135deg, ${props.book.theme.light} 0%, ${props.book.theme.dark} 100%)`,
    '--theme-brand-hover-shadow': `0 8px 25px ${props.book.theme.light}4D`, // 30% opacity
  }
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
          ${content
            .split('\n')
            .map((p) => (p.trim() ? `<p>${p}</p>` : ''))
            .join('')}
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
  contentPages.forEach((pageContent) => {
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
      clickEventForward: true,
    })

    // Create and load pages
    const pages = createPages()
    pageFlip.loadFromHTML(pages)

    // Set total pages
    totalPages.value = pages.length

    // Add event listeners
    // @ts-expect-error - PageFlip types weren't correctly defined so we removed them
    pageFlip.on('flip', (e) => {
      if (typeof e.data !== 'number') {
        throw new Error('Invalid page number in flip event')
      }

      currentPage.value = e.data
      console.log('Current page:', e.data)
    })

    // @ts-expect-error - PageFlip types weren't correctly defined so we removed them
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
  <div class="book-reader" :style="customThemeStyles">
    <div class="container">
      <!-- PageFlip Book Container -->
      <div class="book-container-wrapper">
        <!-- Left arrow for mobile -->
        <button
          @click="goToPreviousPage"
          :disabled="currentPage <= 0"
          class="mobile-nav-arrow mobile-nav-left"
        >
          ←
        </button>

        <div ref="bookContainer" class="book-container" :style="{ fontFamily }"></div>

        <!-- Right arrow for mobile -->
        <button
          @click="goToNextPage"
          :disabled="currentPage >= totalPages - 1"
          class="mobile-nav-arrow mobile-nav-right"
        >
          →
        </button>

        <!-- Mobile page indicator -->
        <div class="mobile-page-indicator">{{ currentPage + 1 }} / {{ totalPages }}</div>
      </div>

      <!-- Navigation buttons -->
      <div class="navigation-controls">
        <button
          @click="goToPreviousPage"
          :disabled="currentPage <= 0"
          class="nav-button prev-button"
        >
          ← Previous
        </button>
        <span class="page-indicator"> {{ currentPage + 1 }} / {{ totalPages }} </span>
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
  padding: 0;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  background: var(--bg-tertiary);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow-hover);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg);
  position: relative;
  width: 100%;
  height: 90vh; /* Make container take most of viewport height */
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.book-container-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.book-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  flex: 1;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) 0;
  margin-top: var(--spacing-lg);
}

.nav-button {
  background: var(--theme-secondary-light, var(--secondary-light));
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 500;
}

.nav-button:hover:not(:disabled) {
  background: var(--theme-secondary-dark, var(--secondary-dark));
  transform: translateY(-1px);
}

.nav-button:disabled {
  background: var(--btn-disabled-bg);
  color: var(--btn-disabled-color);
  cursor: not-allowed;
  transform: none;
}

.page-indicator {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Mobile navigation arrows */
.mobile-nav-arrow {
  display: none; /* Hidden by default, shown on mobile */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  color: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: var(--font-size-base);
  cursor: pointer;
  z-index: 1000;
  transition: all var(--transition-normal);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-nav-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.95);
  color: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mobile-nav-arrow:disabled {
  background: rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
  transform: translateY(-50%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.mobile-nav-left {
  left: -18px;
}

.mobile-nav-right {
  right: -18px;
}

/* Mobile page indicator */
.mobile-page-indicator {
  display: none; /* Hidden by default, shown on mobile */
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.7);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Global styles for PageFlip pages */
/*
Important: the book-pages cannot have `position: relative`
otherwise style will be messed up
*/
:global(.book-page) {
  background: var(--page-bg);
  box-shadow: var(--page-shadow);
  padding: 0;
  margin: 0;
  overflow: hidden;
  /* Subtle warm tint for paper feel */
  background-color: var(--page-bg);
}

:global(.page-content) {
  padding: var(--spacing-2xl);
  height: 100%;
  display: flex;
  flex-direction: column;
  line-height: var(--leading-relaxed);
  color: var(--page-text-color);
}

:global(.title-page) {
  justify-content: center;
  align-items: center;
  text-align: center;
  background: var(--theme-brand-gradient, var(--brand-gradient));
  color: var(--text-inverse);
}

:global(.title-page h1) {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  line-height: var(--leading-tight);
  color: var(--text-inverse);
}

:global(.title-page p) {
  font-size: var(--font-size-xl);
  font-style: italic;
  opacity: 0.9;
  margin: 0;
  color: var(--text-inverse);
}

:global(.page-text) {
  flex: 1;
  overflow: hidden;
}

:global(.page-text p) {
  margin-bottom: var(--spacing-lg);
  text-align: justify;
  text-indent: var(--spacing-xl);
  font-size: var(--font-size-base);
  line-height: var(--leading-loose);
}

:global(.page-text p:first-child) {
  text-indent: 0;
}

@media (max-width: 768px) {
  /* Hide bottom navigation on mobile */
  .navigation-controls {
    display: none;
  }

  /* Show mobile navigation arrows and page indicator */
  .mobile-nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-page-indicator {
    display: block;
  }

  /* Adjust container padding for mobile arrows */
  .container {
    padding: var(--spacing-md);
  }

  .book-container-wrapper {
    position: relative;
  }

  :global(.page-content) {
    padding: var(--spacing-xl);
  }

  :global(.title-page h1) {
    font-size: var(--font-size-3xl);
  }

  :global(.page-text p) {
    font-size: var(--font-size-sm);
    text-indent: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  /* Hide bottom navigation on small mobile */
  .navigation-controls {
    display: none;
  }

  /* Show mobile navigation arrows and page indicator */
  .mobile-nav-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    font-size: var(--font-size-sm);
  }

  .mobile-page-indicator {
    display: block;
    font-size: var(--font-size-xs);
    padding: 2px var(--spacing-xs);
  }

  .mobile-nav-left {
    left: 0px;
  }

  .mobile-nav-right {
    right: 0px;
  }

  .container {
    padding: var(--spacing-sm);
  }

  :global(.page-content) {
    padding: var(--spacing-lg);
  }

  :global(.title-page h1) {
    font-size: var(--font-size-2xl);
  }

  :global(.page-text p) {
    font-size: var(--font-size-xs);
  }
}
</style>
