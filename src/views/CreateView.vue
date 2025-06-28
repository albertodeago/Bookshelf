<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { encodeBookToUrl } from '../domain/url'
import BookReader from '../components/BookReader.vue'
import { defaultBookContent, defaultBookTitle, defaultBookAuthor } from '../data/defaultContent'

import type { Book } from '../domain/book'

const title = ref(defaultBookTitle)
const author = ref(defaultBookAuthor)
const content = ref(defaultBookContent)
const selectedFont = ref('Georgia, serif')
const showFontDropdown = ref(false)

// Predefined font options
const fontOptions = [
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman (Serif)' },
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial (Sans-serif)' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica (Sans-serif)' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana (Sans-serif)' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New (Monospace)' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS (Sans-serif)' },
  { value: 'Palatino, "Palatino Linotype", serif', label: 'Palatino (Serif)' },
  // Handwritten fonts that are imported in main.css
  { value: '"Kalam", cursive', label: 'Kalam (Handwritten)' },
  { value: '"Caveat", cursive', label: 'Caveat (Handwritten)' },
  { value: '"Dancing Script", cursive', label: 'Dancing Script (Elegant)' },
  { value: '"Indie Flower", cursive', label: 'Indie Flower (Casual)' },
  { value: '"Permanent Marker", cursive', label: 'Permanent Marker (Bold)' },
  { value: '"Amatic SC", cursive', label: 'Amatic SC (Hand-drawn)' },
  { value: '"Shadows Into Light", cursive', label: 'Shadows Into Light (Script)' },
  { value: '"Comic Neue", cursive', label: 'Comic Neue (Comic)' }
]

const toggleFontDropdown = () => {
  showFontDropdown.value = !showFontDropdown.value
}

const selectFont = (fontValue: string) => {
  selectedFont.value = fontValue
  showFontDropdown.value = false
}

const getSelectedFontLabel = () => {
  const selected = fontOptions.find(font => font.value === selectedFont.value)
  return selected ? selected.label : selectedFont.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.custom-select-container')) {
    showFontDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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
          <div class="custom-select-container">
            <div
              class="custom-select"
              @click="toggleFontDropdown"
              :style="{ fontFamily: selectedFont }"
            >
              {{ getSelectedFontLabel() }}
              <span class="dropdown-arrow" :class="{ 'open': showFontDropdown }">▼</span>
            </div>
            <div v-if="showFontDropdown" class="custom-options">
              <div
                v-for="font in fontOptions"
                :key="font.value"
                class="custom-option"
                :class="{ 'selected': font.value === selectedFont }"
                :style="{ fontFamily: font.value }"
                @click="selectFont(font.value)"
              >
                {{ font.label }}
              </div>
            </div>
          </div>
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
textarea,
select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.font-select {
  background: white;
  cursor: pointer;
}

.custom-select-container {
  position: relative;
}

.custom-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s ease;
}

.custom-select:hover {
  border-color: #d1d5db;
}

.custom-select:focus-within,
.custom-select.focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  font-size: 0.8rem;
  color: #6b7280;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.custom-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 6px 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.custom-option {
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.custom-option:last-child {
  border-bottom: none;
}

.custom-option:hover {
  background-color: #f9fafb;
}

.custom-option.selected {
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 500;
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
