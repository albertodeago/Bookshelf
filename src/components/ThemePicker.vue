<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { BookTheme } from '@/domain/book'

const props = defineProps<{
  modelValue: BookTheme | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BookTheme]
}>()

const showThemeDropdown = ref(false)

// Predefined theme options with labels
const presetThemeLabels: { [key: string]: string } = {
  default: 'Default (Purple)',
  ocean: 'Ocean (Blue)',
  forest: 'Forest (Green)',
  sunset: 'Sunset (Orange)',
  monochrome: 'Monochrome (Gray)',
  vintage: 'Vintage (Brown)',
}

const presetThemes: { [key: string]: BookTheme } = {
  default: { light: '#667eea', dark: '#764ba2' },
  ocean: { light: '#06b6d4', dark: '#0891b2' },
  forest: { light: '#10b981', dark: '#059669' },
  sunset: { light: '#f59e0b', dark: '#dc2626' },
  monochrome: { light: '#4b5563', dark: '#1f2937' },
  vintage: { light: '#d97706', dark: '#92400e' },
}

// Generate theme options dynamically
const themeOptions = Object.entries(presetThemes).map(([key, theme]) => ({
  value: JSON.stringify(theme),
  label: presetThemeLabels[key],
  theme,
}))

const customTheme = ref<BookTheme>({ light: '#667eea', dark: '#764ba2' })
const isCustomMode = ref(false)

// Computed property to determine current theme selection
const currentSelection = computed(() => {
  if (!props.modelValue) return JSON.stringify(presetThemes.default)

  const currentThemeStr = JSON.stringify(props.modelValue)

  // Check if it matches any preset theme
  const matchingPreset = themeOptions.find((option) => option.value === currentThemeStr)
  if (matchingPreset) {
    isCustomMode.value = false
    return currentThemeStr
  }

  // If no preset matches, it's a custom theme
  isCustomMode.value = true
  customTheme.value = { ...props.modelValue }
  return 'custom'
})

const currentTheme = computed(() => {
  return props.modelValue || presetThemes.default
})

const currentLabel = computed(() => {
  const selection = currentSelection.value
  if (selection === 'custom') {
    return 'Custom Theme'
  }
  const option = themeOptions.find((t) => t.value === selection)
  return option ? option.label : 'Custom Theme'
})

const selectTheme = (themeValue: string) => {
  if (themeValue === 'custom') {
    isCustomMode.value = true
    emit('update:modelValue', { ...customTheme.value })
  } else {
    isCustomMode.value = false
    const theme = JSON.parse(themeValue) as BookTheme
    emit('update:modelValue', theme)
  }
  showThemeDropdown.value = false
}

const updateCustomColor = (colorType: 'light' | 'dark', color: string) => {
  customTheme.value[colorType] = color
  if (isCustomMode.value) {
    emit('update:modelValue', { ...customTheme.value })
  }
}

const toggleThemeDropdown = () => {
  showThemeDropdown.value = !showThemeDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-picker-container')) {
    showThemeDropdown.value = false
  }
}

onMounted(() => {
  // Initialize custom theme if current selection is custom
  if (currentSelection.value === 'custom' && props.modelValue) {
    customTheme.value = { ...props.modelValue }
    isCustomMode.value = true
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="theme-picker-container">
    <div class="custom-select" @click="toggleThemeDropdown">
      <div class="theme-preview">
        <div
          class="theme-gradient"
          :style="{
            background: `linear-gradient(135deg, ${currentTheme.light} 0%, ${currentTheme.dark} 100%)`,
          }"
        ></div>
        <span class="theme-label">{{ currentLabel }}</span>
      </div>
      <span class="dropdown-arrow" :class="{ open: showThemeDropdown }">▼</span>
    </div>
    <div v-if="showThemeDropdown" class="custom-options">
      <!-- Preset themes -->
      <div
        v-for="theme in themeOptions"
        :key="theme.value"
        class="custom-option"
        :class="{ selected: currentSelection === theme.value }"
        @click="selectTheme(theme.value)"
      >
        <div class="theme-preview">
          <div
            class="theme-gradient"
            :style="{
              background: `linear-gradient(135deg, ${theme.theme.light} 0%, ${theme.theme.dark} 100%)`,
            }"
          ></div>
          <span class="theme-label">{{ theme.label }}</span>
        </div>
      </div>

      <!-- Custom theme option -->
      <div class="option-separator"></div>
      <div
        class="custom-option custom-theme-option"
        :class="{ selected: currentSelection === 'custom' }"
        @click="selectTheme('custom')"
      >
        <div class="theme-preview">
          <div
            class="theme-gradient"
            :style="{
              background: `linear-gradient(135deg, ${customTheme.light} 0%, ${customTheme.dark} 100%)`,
            }"
          ></div>
          <span class="theme-label">Custom Theme</span>
        </div>

        <!-- Inline color pickers -->
        <div class="inline-color-pickers" @click.stop>
          <input
            type="color"
            :value="customTheme.light"
            @input="updateCustomColor('light', ($event.target as HTMLInputElement).value)"
            class="color-picker"
            title="Light color"
          />
          <input
            type="color"
            :value="customTheme.dark"
            @input="updateCustomColor('dark', ($event.target as HTMLInputElement).value)"
            class="color-picker"
            title="Dark color"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-picker-container {
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

.theme-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.theme-gradient {
  width: 24px;
  height: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
}

.theme-label {
  font-weight: 500;
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
  max-height: 240px;
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

.custom-option.selected .theme-label {
  font-weight: 600;
}

.custom-theme-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inline-color-pickers {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.option-separator {
  height: 1px;
  background: var(--border-medium);
  margin: var(--spacing-xs) 0;
}

.color-picker {
  width: 32px;
  height: 24px;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  cursor: pointer;
  background: none;
  padding: 0;
  transition: transform var(--transition-fast);
}

.color-picker:hover {
  transform: scale(1.05);
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: calc(var(--radius-sm) - 1px);
}
</style>
