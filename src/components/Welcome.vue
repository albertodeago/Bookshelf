<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Welcome',
})
</script>

<template>
  <div class="greetings">
    <h1 class="welcome-title">Welcome to Bookshelf!</h1>
    <h3 class="welcome-subtitle">
      Here you can create an ephemeral book and share it with other people.
      <br />
      To create a book, click <RouterLink to="/create" class="welcome-link">here</RouterLink>.
    </h3>
  </div>
</template>

<style scoped>
.greetings {
  text-align: center;
  padding: var(--spacing-3xl);
  max-width: 800px;
  margin: 0 auto;
}

.welcome-title {
  color: var(--success-600);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-2xl);
  line-height: var(--leading-tight);
}

.welcome-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.welcome-link {
  color: var(--success-600);
  text-decoration: none;
  font-weight: 600;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-normal);
}

.welcome-link:hover {
  background-color: rgba(34, 197, 94, 0.1);
}

@media (max-width: 640px) {
  .greetings {
    padding: var(--spacing-2xl);
  }

  .welcome-title {
    font-size: var(--font-size-3xl);
  }

  .welcome-subtitle {
    font-size: var(--font-size-base);
  }
}
</style>
