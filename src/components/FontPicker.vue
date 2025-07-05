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
  padding: var(--spacing-md);
  border: 2px solid var(--input-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background: var(--input-bg);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color var(--transition-normal);
}

.custom-select:hover {
  border-color: var(--border-medium);
}

.custom-select:focus-within,
.custom-select.focused {
  border-color: var(--input-border-focus);
  box-shadow: var(--input-focus-shadow);
}

.dropdown-arrow {
  transition: transform var(--transition-normal);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.custom-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 2px solid var(--input-border);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  max-height: 200px;
  overflow-y: auto;
  z-index: var(--z-dropdown);
  box-shadow: var(--card-shadow);
}

.custom-option {
  padding: var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-normal);
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
}

.custom-option:last-child {
  border-bottom: none;
}

.custom-option:hover {
  background-color: var(--bg-secondary);
}

.custom-option.selected {
  background-color: var(--primary-50);
  color: var(--primary-700);
  font-weight: 500;
}
</style>
