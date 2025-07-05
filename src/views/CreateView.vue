<script setup lang="ts">
import { ref, computed } from 'vue'
import { encodeBookToUrl } from '../domain/url'
import BookReader from '../components/BookReader.vue'
import FontPicker from '../components/FontPicker.vue'
import { defaultBookContent, defaultBookTitle, defaultBookAuthor } from '../data/defaultContent'

import type { Book } from '../domain/book'

const title = ref(defaultBookTitle)
const author = ref(defaultBookAuthor)
const content = ref(defaultBookContent)
const selectedFont = ref('Georgia, serif')

// Check if we're in development mode
const isDevelopment = computed(() => import.meta.env.DEV)

// Create a computed book object for preview
const currentBook = computed((): Book | null => {
  if (!title.value.trim() || !author.value.trim() || !content.value.trim()) {
    return null
  }
  return {
    title: title.value.trim(),
    author: author.value.trim(),
    content: content.value.trim(),
    font: selectedFont.value
  }
})

const saveAndShare = () => {
  if (!currentBook.value) {
    alert('Please fill in all fields')
    return
  }

  const shareableUrl = encodeBookToUrl(currentBook.value)

  // Copy to clipboard
  navigator.clipboard.writeText(shareableUrl).then(() => {
    alert('Shareable URL copied to clipboard!')
  }).catch(() => {
    // Fallback: show the URL in a prompt
    prompt('Copy this shareable URL:', shareableUrl)
  })
}
</script>

<template>
  <main class="create-view">
    <div class="container">
      <h1>Create a New Book</h1>

      <form @submit.prevent="saveAndShare" class="book-form">
        <div class="form-group">
          <label for="title">Book Title</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Enter the book title"
            required
          />
        </div>

        <div class="form-group">
          <label for="author">Author</label>
          <input
            id="author"
            v-model="author"
            type="text"
            placeholder="Enter the author's name"
            required
          />
        </div>

        <div class="form-group">
          <label for="font">Font</label>
          <FontPicker v-model="selectedFont" />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            v-model="content"
            placeholder="Enter the book content"
            rows="10"
            required
          ></textarea>
        </div>

        <div class="button-group">
          <button type="submit" class="save-button">
            Save and Share
          </button>
        </div>
      </form>
    </div>

    <!-- Live Preview Section -->
    <div v-if="currentBook" class="preview-section">
      <h2>Live Preview</h2>
      <BookReader
        :book="currentBook"
        :show-close-button="false"
      />
    </div>
  </main>
</template>

<style scoped>
.create-view {
  padding: 2rem;
  margin: 0 auto;
  max-width: 1400px;
}

.container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.preview-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.preview-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input,
textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.save-button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .create-view {
    padding: 1rem;
  }

  .container,
  .preview-section {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .preview-section h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 1200px) {
  .create-view {
    max-width: 100%;
  }
}
</style>
