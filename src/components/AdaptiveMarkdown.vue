<script lang="ts">
import { computed, defineComponent } from 'vue'
import { marked } from 'marked'
import { useRouter } from 'vue-router'
import { useAINavigatorStore } from '../stores/aiNavigator'

export default defineComponent({
  name: 'AdaptiveMarkdown',
  props: {
    // 마크다운 형식의 텍스트
    content: {
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
  },
  setup(props) {
    const router = useRouter()
    const aiNavigatorStore = useAINavigatorStore()
    const userProfile = computed(() => aiNavigatorStore.getUserProfile())

    // UI 개인화 클래스
    const adaptiveClasses = computed(() => {
      const classes = ['adaptive-markdown']

      // 글자 크기
      if (props.uiSuggestions.fontSize === '크게') {
        classes.push('large-text')
      } else if (props.uiSuggestions.fontSize === '매우 크게') {
        classes.push('extra-large-text')
      }

      // 대비
      if (props.uiSuggestions.contrast === '높음') {
        classes.push('high-contrast')
      }

      // 단순화
      if (props.uiSuggestions.simplicity === '높음') {
        classes.push('simplified-ui')
      }

      // 상호작용 방식
      if (props.uiSuggestions.interactionMethod === '간편함') {
        classes.push('easy-interaction')
      }

      // 사용자 프로필 기반 추가 개인화
      if (userProfile.value) {
        const age = userProfile.value.age as number | undefined
        const proficiency = userProfile.value.digitalProficiency as string | undefined

        if (age && age >= 65) {
          classes.push('senior-friendly')
        }

        if (proficiency === 'low') {
          classes.push('accessibility-enhanced')
        }
      }

      return classes.join(' ')
    })

    // marked 기본 설정
    marked.setOptions({
      breaks: true, // 줄바꿈을 <br>로 변환
      gfm: true, // GitHub Flavored Markdown 활성화
    })

    // 마크다운 렌더러 커스터마이징
    const renderer = new marked.Renderer()

    // 링크 렌더러 커스터마이징 - TypeScript 타입 에러 무시
    // @ts-expect-error - marked 라이브러리의 타입 정의와 실제 사용 간의 불일치
    renderer.link = function (href, title, text) {
      // href 검증 및 안전한 변환
      let safeHref = ''

      if (typeof href === 'string') {
        safeHref = href
      } else if (href && typeof href === 'object') {
        // href가 객체인 경우 href.href 또는 href.url 속성 확인
        if (typeof href.href === 'string') {
          safeHref = href.href
        } else if (typeof href.url === 'string') {
          safeHref = href.url
        } else {
          // 유효한 URL 속성이 없는 경우 기본값 제공
          console.warn('Invalid href object:', href)
          safeHref = '#' // 안전한 기본 URL
        }
      } else if (href) {
        // 다른 타입의 경우 안전하게 문자열로 변환 시도
        try {
          safeHref = String(href)
        } catch (e) {
          console.error('Failed to convert href to string:', e)
          safeHref = '#'
        }
      } else {
        // href가 undefined, null 등인 경우
        safeHref = '#'
      }

      let safeText = typeof text === 'string' ? text : text?.toString() || 'link'
      const safeTitle = typeof title === 'string' ? title : ''

      // 상호작용 방식이 '간편함'이거나 디지털 역량이 낮은 사용자를 위한 링크 텍스트 강화
      if (props.uiSuggestions.interactionMethod === '간편함') {
        safeText = enhanceLinkText(safeText, props.uiSuggestions.interactionMethod)
      }

      // 내부 링크 처리 (경로가 /로 시작하는 경우)
      let linkClass = 'adaptive-md-link'

      // 상호작용 방식에 따른 링크 스타일 클래스 추가
      if (props.uiSuggestions.interactionMethod === '간편함') {
        linkClass += ' easy-interaction-link'
      }

      // 대비에 따른 링크 스타일 클래스 추가
      if (props.uiSuggestions.contrast === '높음') {
        linkClass += ' high-contrast-link'
      }

      if (safeHref && safeHref.startsWith('/')) {
        const attributes = [`href="${safeHref}"`, 'data-internal="true"', `class="${linkClass}"`]

        if (safeTitle) {
          attributes.push(`title="${safeTitle}"`)
        }

        return `<a ${attributes.join(' ')}>${safeText}</a>`
      }

      // 외부 링크
      const attributes = [
        `href="${safeHref}"`,
        'target="_blank"',
        'rel="noopener noreferrer"',
        `class="${linkClass}"`,
      ]

      if (safeTitle) {
        attributes.push(`title="${safeTitle}"`)
      }

      return `<a ${attributes.join(' ')}>${safeText}</a>`
    }

    // marked에 커스텀 렌더러 적용
    marked.use({ renderer })

    // 마크다운 텍스트를 HTML로 변환
    const renderedContent = computed(() => {
      if (!props.content) return ''
      try {
        // marked 파싱 전 유효성 검사
        if (typeof props.content !== 'string') {
          console.error('마크다운 파싱 에러: 입력이 문자열이 아닙니다.', props.content)
          return `<p class="error">마크다운 콘텐츠가 유효하지 않습니다.</p>`
        }

        return marked(props.content)
      } catch (error) {
        console.error('마크다운 파싱 에러:', error)
        return `<p class="error">마크다운 파싱 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}</p>`
      }
    })

    // 링크 클릭 핸들러
    function handleLinkClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (!link) return

      // 내부 링크인 경우 Vue Router 사용
      if (link.dataset.internal === 'true') {
        e.preventDefault()
        router.push(link.getAttribute('href') || '/')
      }
    }

    return {
      renderedContent,
      handleLinkClick,
      adaptiveClasses,
    }
  },
})

// 링크 텍스트 및 스타일 개선 로직
function enhanceLinkText(linkText: string, interactionMethod: string): string {
  // 상호작용 방식이 '간편함'이고 이미 행동 유도 문구가 없는 경우 문구 추가
  if (interactionMethod === '간편함') {
    if (
      !linkText.includes('클릭') &&
      !linkText.includes('이동') &&
      !linkText.includes('바로가기')
    ) {
      return `${linkText} (클릭하여 이동)`
    }
  }
  return linkText
}
</script>

<template>
  <div :class="adaptiveClasses" @click="handleLinkClick">
    <!-- 렌더링된 마크다운 내용 -->
    <div v-html="renderedContent"></div>
  </div>
</template>

<style>
.adaptive-markdown {
  line-height: 1.5;
}

/* 일반 링크 스타일 */
.adaptive-markdown a {
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.adaptive-markdown a:hover {
  color: var(--color-primary-dark);
}

/* 코드 블록 스타일 */
.adaptive-markdown pre {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  overflow-x: auto;
  margin: 1rem 0;
}

.adaptive-markdown code {
  font-family: monospace;
  background-color: #f0f0f0;
  padding: 0.2rem 0.4rem;
  border-radius: var(--border-radius-sm);
}

/* 헤더 스타일 */
.adaptive-markdown h1,
.adaptive-markdown h2,
.adaptive-markdown h3,
.adaptive-markdown h4,
.adaptive-markdown h5,
.adaptive-markdown h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

/* 목록 스타일 */
.adaptive-markdown ul,
.adaptive-markdown ol {
  padding-left: 2rem;
  margin: 1rem 0;
}

.adaptive-markdown li {
  margin-bottom: 0.5rem;
}

/* 표 스타일 */
.adaptive-markdown table {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
}

.adaptive-markdown th,
.adaptive-markdown td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.adaptive-markdown th {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* 인용구 스타일 */
.adaptive-markdown blockquote {
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
  margin-left: 0;
  color: #555;
}

/* 에러 메시지 스타일 */
.adaptive-markdown .error {
  color: #d32f2f;
  padding: 0.5rem;
  border-left: 3px solid #d32f2f;
  background-color: rgba(211, 47, 47, 0.1);
}

/* 글자 크기 개인화 */
.large-text {
  font-size: 1.25rem;
}

.large-text h1 {
  font-size: 2.5rem;
}
.large-text h2 {
  font-size: 2.2rem;
}
.large-text h3 {
  font-size: 1.9rem;
}
.large-text h4 {
  font-size: 1.6rem;
}
.large-text h5 {
  font-size: 1.4rem;
}
.large-text h6 {
  font-size: 1.3rem;
}

.extra-large-text {
  font-size: 1.5rem;
}

.extra-large-text h1 {
  font-size: 3rem;
}
.extra-large-text h2 {
  font-size: 2.7rem;
}
.extra-large-text h3 {
  font-size: 2.3rem;
}
.extra-large-text h4 {
  font-size: 2rem;
}
.extra-large-text h5 {
  font-size: 1.8rem;
}
.extra-large-text h6 {
  font-size: 1.7rem;
}

/* 대비 개인화 */
.high-contrast {
  color: #000;
  background-color: #fff;
}

.high-contrast a {
  color: #0000ee;
  font-weight: bold;
}

.high-contrast a:hover {
  color: #0000aa;
}

/* 단순화된 UI */
.simplified-ui p,
.simplified-ui li {
  line-height: 1.8;
  margin-bottom: 1rem;
}

.simplified-ui h1,
.simplified-ui h2,
.simplified-ui h3,
.simplified-ui h4,
.simplified-ui h5,
.simplified-ui h6 {
  line-height: 1.5;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

/* 간편한 상호작용 */
.easy-interaction a {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  margin: 0.2rem 0;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  background-color: rgba(138, 180, 248, 0.1);
  transition: all 0.3s;
}

.easy-interaction a:hover {
  background-color: var(--color-primary);
  color: white;
}

.easy-interaction-link {
  font-weight: bold;
  text-decoration: underline !important;
  padding: 0.3rem 0.5rem !important;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-primary) !important;
  background-color: rgba(138, 180, 248, 0.1) !important;
}

.high-contrast-link {
  color: #0000ee !important;
  font-weight: bold !important;
  text-decoration: underline double !important;
}

/* 고령자 친화적 스타일 */
.senior-friendly {
  line-height: 1.8;
  letter-spacing: 0.5px;
}

.senior-friendly a {
  font-weight: bold;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* 접근성 강화 스타일 */
.accessibility-enhanced a {
  font-weight: bold;
  text-decoration: underline;
  padding: 0.3rem 0.5rem;
  border: 1px solid currentColor;
  border-radius: 4px;
  margin: 0.2rem 0;
  display: inline-block;
}

.accessibility-enhanced h1,
.accessibility-enhanced h2,
.accessibility-enhanced h3,
.accessibility-enhanced h4,
.accessibility-enhanced h5,
.accessibility-enhanced h6 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
</style>
