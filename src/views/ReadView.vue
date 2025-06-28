<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEncodedBookFromUrl } from '../domain/url'
import { decodeBook } from '../domain/book'
import BookReader from '../components/BookReader.vue'

import type { Book } from '../domain/book'

const book = ref<Book | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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
      <BookReader v-else-if="book" :book="book" />

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

.loading {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.error {
  text-align: center;
  padding: 3rem;
}

.error h1 {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.error p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.book-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 2rem;
}

.create-link {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.create-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

@media (max-width: 640px) {
  .read-view {
    padding: 1rem;
  }

  .container {
    padding: 2rem;
  }
}
</style>
