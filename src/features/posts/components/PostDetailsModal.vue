<template>
  <teleport to="body">
    <transition name="modal" appear>
      <div
        class="my-dialog"
        @click="$emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`modal-title-${post.id}`"
      >
        <article class="post-details-modal" @click.stop>
          <!-- Close -->
          <button
            class="post-details-modal__close"
            @click="$emit('close')"
            aria-label="Close"
            ref="closeButton"
          >
            <Icon icon="ph:x" width="18" height="18" />
          </button>

          <!-- Header -->
          <header class="post-details-modal__header">
            <div v-if="post.source || post.category" class="post-details-modal__kicker">
              {{ post.category || post.source }}
            </div>
            <h2
              :id="`modal-title-${post.id}`"
              class="post-details-modal__title"
            >
              {{ post.title }}
            </h2>
          </header>

          <!-- Rule -->
          <div class="post-details-modal__rule" aria-hidden="true"></div>

          <!-- Meta -->
          <div class="post-details-modal__meta">
            <span v-if="post.source" class="post-details-modal__source">{{ post.source }}</span>
            <span v-if="post.source && post.publishedAt" aria-hidden="true">·</span>
            <time v-if="post.publishedAt" :datetime="post.publishedAt">
              {{ formatDate(post.publishedAt) }}
            </time>
          </div>

          <!-- Body -->
          <div class="post-details-modal__content">
            <p class="post-details-modal__body">{{ post.body }}</p>
          </div>

          <!-- Actions -->
          <div class="post-details-modal__actions">
            <my-button @click="$emit('close')" variant="secondary" size="small">
              Close
            </my-button>
            <my-button
              v-if="post.url && post.url !== '#'"
              @click="openArticle(post.url)"
              variant="primary"
              size="small"
            >
              <Icon icon="ph:arrow-square-out" width="14" height="14" />
              Read Full Article
            </my-button>
          </div>
        </article>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { Icon } from "@iconify/vue";
import { formatDate } from "@/shared/lib/utils/dateUtils.js";

export default {
  name: "PostDetailsModal",
  components: { Icon },
  props: {
    post: { type: Object, required: true }
  },
  emits: ["close"],
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.closeButton) {
        this.$refs.closeButton.focus();
      }
    });
    document.addEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    openArticle(url) {
      if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.$emit('close');
      }
    },
    formatDate
  }
};
</script>

<style scoped>
/* Backdrop */
.my-dialog {
  position: fixed;
  inset: 0;
  background: rgba(22, 21, 26, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  backdrop-filter: blur(4px);
}

/* Modal panel */
.post-details-modal {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-rule);
  border-top: 3px solid var(--color-ink);
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border-radius: var(--border-radius-sm);
}

/* Close button */
.post-details-modal__close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: 1px solid var(--color-rule);
  border-radius: var(--border-radius-sm);
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.post-details-modal__close:hover {
  background: var(--color-neutral-100);
  color: var(--color-ink);
  border-color: var(--color-ink-muted);
}

/* Header */
.post-details-modal__header {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
  padding-right: calc(var(--spacing-xl) + 2.5rem);
}

.post-details-modal__kicker {
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-caps);
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.625rem;
}

.post-details-modal__title {
  font-family: var(--font-serif);
  font-size: clamp(1.375rem, 2.5vw, 2rem);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
  color: var(--color-ink);
  margin: 0;
}

/* Rule */
.post-details-modal__rule {
  border: none;
  border-top: 1px solid var(--color-rule);
  margin: var(--spacing-md) var(--spacing-xl) 0;
}

/* Meta */
.post-details-modal__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem var(--spacing-xl);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  color: var(--color-ink-faint);
}

.post-details-modal__source {
  color: var(--color-accent);
  font-weight: var(--font-weight-medium);
}

/* Body */
.post-details-modal__content {
  padding: 0 var(--spacing-xl) var(--spacing-lg);
  flex: 1;
}

.post-details-modal__body {
  font-family: var(--font-serif);
  font-size: var(--font-size-lg);
  color: var(--color-ink-muted);
  line-height: var(--line-height-loose);
  white-space: pre-wrap;
  font-weight: var(--font-weight-light);
}

/* Actions */
.post-details-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top: 1px solid var(--color-rule);
}

/* Transitions */
.modal-enter-active {
  transition: opacity 0.25s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .post-details-modal {
  animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) both;
}

.modal-leave-active .post-details-modal {
  animation: slideDown 0.2s ease both;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(0);    opacity: 1; }
  to   { transform: translateY(12px); opacity: 0; }
}

@media (max-width: 640px) {
  .my-dialog {
    padding: var(--spacing-sm);
    align-items: flex-end;
  }

  .post-details-modal {
    max-height: 85vh;
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }

  .post-details-modal__actions {
    flex-direction: column-reverse;
  }
}
</style>
