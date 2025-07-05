<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

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
  emit('update:modelValue', fontValue)
  showFontDropdown.value = false
}

const getSelectedFontLabel = () => {
  const selected = fontOptions.find(font => font.value === props.modelValue)
  return selected ? selected.label : props.modelValue
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.font-picker-container')) {
    showFontDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="font-picker-container">
    <div
      class="custom-select"
      @click="toggleFontDropdown"
      :style="{ fontFamily: modelValue }"
    >
      {{ getSelectedFontLabel() }}
      <span class="dropdown-arrow" :class="{ 'open': showFontDropdown }">▼</span>
    </div>
    <div v-if="showFontDropdown" class="custom-options">
      <div
        v-for="font in fontOptions"
        :key="font.value"
        class="custom-option"
        :class="{ 'selected': font.value === modelValue }"
        :style="{ fontFamily: font.value }"
        @click="selectFont(font.value)"
      >
        {{ font.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-picker-container {
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
</style>
