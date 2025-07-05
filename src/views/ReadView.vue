<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getEncodedBookFromUrl } from '../domain/url'
import { decodeBook } from '../domain/book'
import BookReader from '../components/BookReader.vue'

import type { Book } from '../domain/book'

const book = ref<Book | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// For custom themes, we need to create dynamic CSS variables
const customThemeStyles = computed(() => {
  if (!book.value?.theme) {
    return {}
  }

  return {
    '--theme-secondary-light': book.value.theme.light,
    '--theme-secondary-dark': book.value.theme.dark,
    '--theme-brand-gradient': `linear-gradient(135deg, ${book.value.theme.light} 0%, ${book.value.theme.dark} 100%)`,
    '--theme-brand-hover-shadow': `0 8px 25px ${book.value.theme.light}4D` // 30% opacity
  }
})

onMounted(() => {
  try {
    const encodedBook = getEncodedBookFromUrl()
    if (encodedBook) {
      book.value = decodeBook(encodedBook)
      if (!book.value) {
        error.value = 'Invalid book data in URL'
      }
    } else {
      error.value = 'No book data found in URL'
    }
  } catch (err) {
    error.value = 'Failed to load book data'
    console.error('Error loading book:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="read-view">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <p>Loading book...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error">
        <h1>📚 Book Not Found</h1>
        <p>{{ error }}</p>
        <router-link to="/create" class="create-link">
          Create a new book
        </router-link>
      </div>

      <!-- Book Content -->
      <div v-else-if="book" :style="customThemeStyles">
        <BookReader :book="book" />
      </div>

      <!-- Footer for navigation -->
      <footer v-if="book" class="book-footer">
        <router-link to="/create" class="create-link">
          Create another book
        </router-link>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.read-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  /* max-width: 1200px; */
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--text-tertiary);
  font-size: var(--font-size-lg);
}

.error {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--card-bg);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
}

.error h1 {
  color: var(--error-500);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-3xl);
}

.error p {
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

.book-footer {
  text-align: center;
  padding-top: var(--spacing-2xl);
  border-top: 1px solid var(--border-light);
  margin-top: var(--spacing-2xl);
}

.create-link {
  display: inline-block;
  background: var(--btn-primary-bg);
  color: var(--text-inverse);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: var(--font-size-base);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.create-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-primary-hover-shadow);
}

@media (max-width: 640px) {
  .error h1 {
    font-size: var(--font-size-2xl);
  }

  .error p {
    font-size: var(--font-size-base);
  }
}
</style>
