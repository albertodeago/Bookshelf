<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showThemeDropdown = ref(false)

// Predefined theme options
const themeOptions = [
  {
    value: 'default',
    label: 'Default (Purple)',
    colors: { light: '#667eea', dark: '#764ba2' }
  },
  {
    value: 'ocean',
    label: 'Ocean (Blue)',
    colors: { light: '#06b6d4', dark: '#0891b2' }
  },
  {
    value: 'forest',
    label: 'Forest (Green)',
    colors: { light: '#10b981', dark: '#059669' }
  },
  {
    value: 'sunset',
    label: 'Sunset (Orange)',
    colors: { light: '#f59e0b', dark: '#dc2626' }
  },
  {
    value: 'monochrome',
    label: 'Monochrome (Gray)',
    colors: { light: '#4b5563', dark: '#1f2937' }
  },
  {
    value: 'vintage',
    label: 'Vintage (Brown)',
    colors: { light: '#d97706', dark: '#92400e' }
  }
]

const toggleThemeDropdown = () => {
  showThemeDropdown.value = !showThemeDropdown.value
}

const selectTheme = (themeValue: string) => {
  emit('update:modelValue', themeValue)
  showThemeDropdown.value = false
}

const getSelectedThemeLabel = () => {
  const selected = themeOptions.find(theme => theme.value === props.modelValue)
  return selected ? selected.label : 'Default (Purple)'
}

const getSelectedThemeColors = () => {
  const selected = themeOptions.find(theme => theme.value === props.modelValue)
  return selected ? selected.colors : { light: '#667eea', dark: '#764ba2' }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-picker-container')) {
    showThemeDropdown.value = false
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
  <div class="theme-picker-container">
    <div
      class="custom-select"
      @click="toggleThemeDropdown"
    >
      <div class="theme-preview">
        <div class="theme-gradient" :style="{
          background: `linear-gradient(135deg, ${getSelectedThemeColors().light} 0%, ${getSelectedThemeColors().dark} 100%)`
        }"></div>
        <span class="theme-label">{{ getSelectedThemeLabel() }}</span>
      </div>
      <span class="dropdown-arrow" :class="{ 'open': showThemeDropdown }">▼</span>
    </div>
    <div v-if="showThemeDropdown" class="custom-options">
      <div
        v-for="theme in themeOptions"
        :key="theme.value"
        class="custom-option"
        :class="{ 'selected': theme.value === modelValue }"
        @click="selectTheme(theme.value)"
      >
        <div class="theme-preview">
          <div class="theme-gradient" :style="{
            background: `linear-gradient(135deg, ${theme.colors.light} 0%, ${theme.colors.dark} 100%)`
          }"></div>
          <span class="theme-label">{{ theme.label }}</span>
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
</style>
