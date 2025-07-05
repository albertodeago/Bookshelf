# AI Instructions

## Project structure
Every route must be defined in the `src/router/index.ts` file.
A route must use a view component from the `src/views` directory.
a view component must only use other components from the `src/components` directory. It cannot contain any logic.

## Styling Guidelines

### CSS Theme System
The project uses a centralized theme system with CSS variables defined in `src/assets/main.css`. **Always use CSS variables instead of hardcoded values** for consistency and maintainability.

### Available CSS Variables

#### Colors
- **Primary**: `--primary-50` to `--primary-900` (blue scale)
- **Secondary**: `--secondary-light`, `--secondary-dark` (purple gradient colors)
- **Neutral**: `--gray-50` to `--gray-900` (gray scale)
- **Semantic**: `--success-*`, `--warning-*`, `--error-*` (400, 500, 600 variants)
- **Text**: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-quaternary`, `--text-inverse`
- **Background**: `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-quaternary`
- **Borders**: `--border-light`, `--border-medium`, `--border-dark`, `--border-focus`

#### Component-specific Variables
- **Cards**: `--card-bg`, `--card-shadow`, `--card-shadow-hover`, `--card-border-radius`
- **Brand/Theme**: `--brand-gradient`, `--brand-hover-shadow` (for consistent brand styling across components)
- **Interactive Elements**: `--interactive-primary-bg`, `--interactive-primary-hover-shadow`, `--interactive-secondary-bg`, `--interactive-disabled-bg` (for buttons, links, clickable items)
- **Buttons**: `--btn-primary-bg`, `--btn-primary-hover-shadow`, `--btn-secondary-bg`, `--btn-disabled-bg` (legacy aliases for backwards compatibility)
- **Forms**: `--input-bg`, `--input-border`, `--input-border-focus`, `--input-focus-shadow`, `--input-placeholder`
- **Book Pages**: `--page-bg`, `--page-shadow`, `--page-text-color`

#### Spacing
- `--spacing-xs` (0.25rem) to `--spacing-3xl` (3rem)

#### Typography
- **Font Sizes**: `--font-size-xs` to `--font-size-5xl`
- **Line Heights**: `--leading-none`, `--leading-tight`, `--leading-normal`, `--leading-relaxed`, `--leading-loose`

#### Border Radius
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`

#### Transitions
- `--transition-fast` (0.15s), `--transition-normal` (0.2s), `--transition-slow` (0.3s)

#### Z-Index
- `--z-dropdown` (1000), `--z-modal` (1050), `--z-tooltip` (1100)

### Styling Rules
1. **Never use hardcoded colors, spacing, or font sizes** - always use CSS variables
2. **Use semantic variable names** when possible (e.g., `--text-primary` instead of `--gray-900`)
3. **For component-specific styling**, use the pre-defined component variables (e.g., `--card-bg`, `--btn-primary-bg`)
4. **Maintain consistency** across all components by using the same variables for similar elements
5. **Dark theme support** is included via `@media (prefers-color-scheme: dark)` - variables automatically adjust

### When to Use `:global` Selectors
Use `:global()` selectors **only** in these specific cases:
- **Dynamically created HTML elements** (via JavaScript `innerHTML`, `createElement`, etc.)
- **Third-party library content** that Vue's scoped styles can't reach (e.g., PageFlip library)
- **Content generated outside Vue's template system**

**Example in BookReader.vue:**
```javascript
// This creates HTML outside Vue's template system
page.innerHTML = `<div class="page-content">${content}</div>`
```
```css
/* ❌ This won't work - scoped styles can't reach dynamically created content */
.page-content { /* styles */ }

/* ✅ This works - :global makes the style available to all matching elements */
:global(.page-content) { /* styles */ }
```

**Important Notes:**
- `:global` styles affect the **entire application**, not just the component
- Use them sparingly and only when absolutely necessary
- Always add comments explaining why `:global` is needed
- Prefer scoped styles for normal Vue template content

### Example Usage
```css
/* ❌ Don't do this */
.my-component {
  background: #ffffff;
  color: #1f2937;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* ✅ Do this instead */
.my-component {
  background: var(--card-bg);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--card-border-radius);
  box-shadow: var(--card-shadow);
}
```

## Tests
todo
