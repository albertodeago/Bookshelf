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
  padding: var(--spacing-2xl);
  margin: 0 auto;
  max-width: 1400px;
}

.container {
  background: var(--card-bg);
  border-radius: var(--card-border-radius);
  padding: var(--spacing-2xl);
  box-shadow: var(--card-shadow);
  margin-bottom: var(--spacing-2xl);
}

.preview-section {
  background: var(--card-bg);
  border-radius: var(--card-border-radius);
  padding: var(--spacing-2xl);
  box-shadow: var(--card-shadow);
}

.preview-section h2 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
  font-size: var(--font-size-2xl);
}

h1 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-2xl);
  text-align: center;
}

.book-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input,
textarea {
  padding: var(--spacing-md);
  border: 2px solid var(--input-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background: var(--input-bg);
  color: var(--text-primary);
  transition: border-color var(--transition-normal);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--input-border-focus);
  box-shadow: var(--input-focus-shadow);
}

input::placeholder,
textarea::placeholder {
  color: var(--input-placeholder);
}

textarea {
  resize: vertical;
  min-height: 200px;
  font-family: inherit;
  line-height: var(--leading-relaxed);
}

.button-group {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.save-button {
  background: var(--btn-primary-bg);
  color: var(--text-inverse);
  padding: var(--spacing-lg) var(--spacing-2xl);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  width: 100%;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-primary-hover-shadow);
}

.save-button:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .create-view {
    padding: var(--spacing-lg);
  }

  .container,
  .preview-section {
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-lg);
  }

  .preview-section h2 {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 1200px) {
  .create-view {
    max-width: 100%;
  }
}
</style>
