<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAINavigatorStore } from '../stores/aiNavigator'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdaptiveLink',
  props: {
    // 링크 텍스트
    text: {
      type: String,
      required: true,
    },
    // 링크 URL (상대 경로 또는 절대 경로)
    to: {
      type: String,
      required: true,
    },
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
    // 표시 스타일 (링크 또는 버튼)
    displayAs: {
      type: String,
      default: 'link',
      validator: (value: string) => ['link', 'button'].includes(value),
    },
  },
  setup(props) {
    const router = useRouter()
    const aiNavigatorStore = useAINavigatorStore()
    const userProfile = computed(() => aiNavigatorStore.getUserProfile())

    // 사용자 프로필 기반으로 링크를 버튼으로 표시할지 결정
    const shouldRenderAsButton = computed(() => {
      // 명시적으로 버튼으로 표시하도록 지정한 경우
      if (props.displayAs === 'button') return true

      // 사용자 상호작용 방식 선호도가 '간편함'인 경우 버튼으로 표시
      if (props.uiSuggestions?.interactionMethod === '간편함') return true

      // 사용자 프로필에서 선호도 확인 (고령자 또는 디지털 역량이 낮은 사용자)
      if (userProfile.value) {
        const age = userProfile.value.age
        const proficiency = userProfile.value.digitalProficiency

        // 고령 사용자 또는 디지털 역량이 낮은 사용자는 버튼 형태가 더 쉬움
        if ((age && age >= 65) || proficiency === 'low') {
          return true
        }

        // 사용자가 명시적으로 버튼 형태를 선호한다고 설정한 경우
        if (userProfile.value.preferences?.interactionMethod === '간편함') {
          return true
        }
      }

      return false
    })

    // 적용할 스타일 클래스
    const adaptiveClass = computed(() => {
      const classes = [] as string[]

      // 버튼 또는 링크 기본 스타일
      classes.push(shouldRenderAsButton.value ? 'adaptive-button' : 'adaptive-link')

      // 글자 크기 클래스
      if (props.uiSuggestions) {
        switch (props.uiSuggestions.fontSize) {
          case '크게':
            classes.push('text-lg')
            break
          case '매우 크게':
            classes.push('text-xl')
            break
        }
      }

      // 대비 클래스
      if (props.uiSuggestions?.contrast === '높음') {
        classes.push('high-contrast')
      }

      // 단순화 클래스
      if (props.uiSuggestions?.simplicity === '높음') {
        classes.push('simplified')
      }

      // 상호작용 방식 클래스
      if (props.uiSuggestions?.interactionMethod === '간편함') {
        classes.push('easy-interaction')
      }

      return classes.join(' ')
    })

    // 내부 또는 외부 링크 처리
    const isExternalLink = computed(() => {
      return props.to.startsWith('http://') || props.to.startsWith('https://')
    })

    // 클릭 핸들러
    const handleClick = (event: MouseEvent) => {
      if (isExternalLink.value) {
        // 외부 링크는 기본 동작 유지 (새 탭에서 열기)
        return
      }

      event.preventDefault()
      // Vue Router를 사용하여 내부 경로로 이동
      router.push(props.to)
    }

    return {
      shouldRenderAsButton,
      adaptiveClass,
      isExternalLink,
      handleClick,
    }
  },
})
</script>

<template>
  <template v-if="shouldRenderAsButton">
    <!-- 버튼으로 표시 -->
    <button :class="adaptiveClass" @click="handleClick">
      {{ text }}
    </button>
  </template>
  <template v-else>
    <!-- 링크로 표시 -->
    <a
      :href="to"
      :class="adaptiveClass"
      @click="handleClick"
      :target="isExternalLink ? '_blank' : undefined"
      :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    >
      {{ text }}
    </a>
  </template>
</template>

<style scoped>
/* 글자 크기 관련 스타일 */
.text-lg {
  font-size: 1.25rem;
}

.text-xl {
  font-size: 1.5rem;
}

/* 기본 링크 스타일 */
.adaptive-link {
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.adaptive-link:hover {
  color: var(--color-primary-dark);
}

/* 기본 버튼 스타일 */
.adaptive-button {
  display: inline-block;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
  text-decoration: none;
}

.adaptive-button:hover {
  background-color: var(--color-primary-dark);
}

/* 대비 관련 스타일 */
.adaptive-link.high-contrast {
  color: #000;
  font-weight: bold;
  text-decoration: underline double;
}

.adaptive-button.high-contrast {
  color: #fff;
  background-color: var(--color-primary-dark);
  border: 2px solid #000;
  font-weight: bold;
}

/* 단순화 관련 스타일 */
.adaptive-button.simplified {
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  border-radius: var(--border-radius-lg);
}

/* 상호작용 방식 관련 스타일 */
.adaptive-button.easy-interaction {
  padding: 1rem 1.5rem;
  font-weight: bold;
  font-size: 1.1em;
  border-radius: var(--border-radius-lg);
  margin: 0.75rem 0;
}
</style>
