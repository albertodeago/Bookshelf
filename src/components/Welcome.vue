<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'Welcome',
})
</script>

<template>
  <div class="welcome">
    <header class="welcome-header">
      <div class="title-container">
        <img src="/bookshelf-logo.webp" alt="Bookshelf Logo" class="welcome-logo" />
        <h1 class="welcome-title">Welcome to Bookshelf!</h1>
      </div>
      <p class="welcome-tagline">Create, customize, and share beautiful digital books instantly</p>
    </header>

    <section class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">✍️</div>
        <h3>Create Books</h3>
        <p>Write short stories, poems, or articles with a simple and clean interface</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>Customize Style</h3>
        <p>Choose from beautiful themes and fonts to make your book uniquely yours</p>
      </div>

      <!-- <div class="feature-card">
        <div class="feature-icon">📖</div>
        <h3>Immersive Reading</h3>
        <p>Experience your books with a paper-like reader and fullscreen mode</p>
      </div> -->

      <div class="feature-card">
        <div class="feature-icon">🔗</div>
        <h3>Share Instantly</h3>
        <p>Generate shareable links to send your books to friends and family</p>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Create Your Book</h4>
            <p>Add a title, author name, and your content. Perfect for short stories, poems, or articles.</p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Customize the Look</h4>
            <p>Pick a theme and font that matches your book's mood and style.</p>
          </div>
        </div>

        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Preview & Share</h4>
            <p>Read your book in the immersive reader, then generate a link to share with others.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="limitations">
      <div class="info-box">
        <h3>📏 Content Size Tips</h3>
        <p>For best sharing results, keep your content under 1,500 characters. Longer content may not share reliably via URL links.</p>
        <details class="size-guide">
          <summary>Learn more about size limits</summary>
          <ul>
            <li><strong>✅ Works great:</strong> Short stories, poems, quotes (under 1,500 chars)</li>
            <li><strong>⚠️ May have issues:</strong> Long articles (1,500-5,000 chars)</li>
            <li><strong>❌ Won't work:</strong> Full chapters or books (over 5,000 chars)</li>
          </ul>
        </details>
      </div>
    </section>

    <section class="cta">
      <RouterLink to="/create" class="cta-button">
        Start Creating Your Book
        <span class="cta-arrow">→</span>
      </RouterLink>
      <p class="cta-subtitle">No account required • Free forever • Share instantly</p>
    </section>
  </div>
</template>

<style scoped>
.welcome {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
  line-height: var(--leading-relaxed);
}

.welcome-header {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.welcome-logo {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.welcome-title {
  color: var(--success-600);
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin: 0;
  line-height: var(--leading-tight);
}

.welcome-tagline {
  color: var(--text-secondary);
  font-size: var(--font-size-xl);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-4xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  background: var(--surface-primary);
  border: 1px solid var(--border-color);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.feature-card p {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}

.how-it-works {
  margin-bottom: var(--spacing-4xl);
}

.how-it-works h2 {
  text-align: center;
  color: var(--text-primary);
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--spacing-2xl);
}

.steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.step {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  background: var(--surface-primary);
  border: 1px solid var(--border-color);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--success-600);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-lg);
}

.step-content h4 {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs) 0;
}

.step-content p {
  color: var(--text-secondary);
  margin: 0;
}

.limitations {
  margin-bottom: var(--spacing-4xl);
}

.info-box {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.info-box h3 {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-sm) 0;
}

.info-box p {
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.size-guide {
  margin-top: var(--spacing-md);
}

.size-guide summary {
  color: var(--success-600);
  font-weight: 500;
  cursor: pointer;
  margin-bottom: var(--spacing-sm);
}

.size-guide summary:hover {
  text-decoration: underline;
}

.size-guide ul {
  margin: var(--spacing-sm) 0 0 0;
  padding-left: var(--spacing-lg);
}

.size-guide li {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.cta {
  text-align: center;
  margin-top: var(--spacing-2xl);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--success-600);
  color: white;
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: 600;
  padding: var(--spacing-lg) var(--spacing-2xl);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.cta-button:hover {
  background: var(--success-500);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.cta-arrow {
  transition: transform var(--transition-normal);
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}

.cta-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--spacing-lg) 0 0 0;
}

@media (max-width: 768px) {
  .welcome {
    padding: var(--spacing-xl);
  }

  .title-container {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .welcome-logo {
    width: 40px;
    height: 40px;
  }

  .welcome-title {
    font-size: var(--font-size-3xl);
  }

  .welcome-tagline {
    font-size: var(--font-size-lg);
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .step {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .step-number {
    align-self: center;
  }

  .cta-button {
    font-size: var(--font-size-base);
    padding: var(--spacing-md) var(--spacing-xl);
  }
}

@media (max-width: 640px) {
  .welcome {
    padding: var(--spacing-lg);
  }

  .welcome-logo {
    width: 36px;
    height: 36px;
  }

  .welcome-title {
    font-size: var(--font-size-2xl);
  }

  .feature-card {
    padding: var(--spacing-lg);
  }

  .info-box {
    padding: var(--spacing-lg);
  }
}
</style>
