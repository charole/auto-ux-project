<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'AdaptiveUI',
  props: {
    // UI 제안 정보
    uiSuggestions: {
      type: Object,
      default: () => ({
        fontSize: '표준',
        contrast: '표준',
        simplicity: '표준',
        interactionMethod: '표준',
      }),
    },
    // 적용할 컴포넌트 타입 (텍스트, 버튼, 카드 등)
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => ['text', 'button', 'card', 'input'].includes(value),
    },
  },
  setup(props) {
    // 글자 크기 클래스 계산
    const fontSizeClass = computed(() => {
      if (!props.uiSuggestions) return 'text-base'

      switch (props.uiSuggestions.fontSize) {
        case '크게':
          return 'text-lg'
        case '매우 크게':
          return 'text-xl'
        default:
          return 'text-base'
      }
    })

    // 대비 클래스 계산
    const contrastClass = computed(() => {
      if (!props.uiSuggestions) return ''

      return props.uiSuggestions.contrast === '높음' ? 'high-contrast' : ''
    })

    // 단순화 클래스 계산
    const simplicityClass = computed(() => {
      if (!props.uiSuggestions) return ''

      return props.uiSuggestions.simplicity === '높음' ? 'simplified' : ''
    })

    // 상호작용 방식 클래스 계산
    const interactionClass = computed(() => {
      if (!props.uiSuggestions) return ''

      return props.uiSuggestions.interactionMethod === '간편함' ? 'easy-interaction' : ''
    })

    // 적용할 최종 클래스 계산
    const adaptiveClass = computed(() => {
      return [
        fontSizeClass.value,
        contrastClass.value,
        simplicityClass.value,
        interactionClass.value,
        `adaptive-${props.type}`,
      ]
        .filter(Boolean)
        .join(' ')
    })

    return {
      adaptiveClass,
    }
  },
})
</script>

<template>
  <div :class="adaptiveClass">
    <slot></slot>
  </div>
</template>

<style scoped>
/* 글자 크기 관련 스타일 */
.text-base {
  font-size: 1rem;
}

.text-lg {
  font-size: 1.25rem;
}

.text-xl {
  font-size: 1.5rem;
}

/* 대비 관련 스타일 */
.high-contrast {
  color: #000;
  background-color: #fff;
  border: 2px solid #000;
}

.high-contrast.adaptive-button {
  color: #fff;
  background-color: var(--color-primary-dark);
  font-weight: bold;
}

/* 단순화 관련 스타일 */
.simplified {
  padding: 0.75rem;
  margin: 0.5rem 0;
}

.simplified.adaptive-card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

/* 상호작용 방식 관련 스타일 */
.easy-interaction.adaptive-button {
  padding: 1rem 1.5rem;
  font-weight: bold;
  border-radius: var(--border-radius-lg);
  margin: 0.5rem 0;
}

.easy-interaction.adaptive-input {
  padding: 1rem;
  font-size: 1.1rem;
}

/* 컴포넌트 타입별 기본 스타일 */
.adaptive-text {
  margin-bottom: 1rem;
}

.adaptive-button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
}

.adaptive-card {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.adaptive-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-surface-soft);
}
</style>
