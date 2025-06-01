<template>
  <div class="search-result-view">
    <header class="search-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> 뒤로가기
      </button>
      <h1 class="search-title">검색 결과: "{{ query }}"</h1>
    </header>

    <!-- 검색 입력 필드 추가 -->
    <div class="search-input-container card-neumorphic">
      <input
        v-model="newQuery"
        type="text"
        class="search-input"
        placeholder="궁금한 보험 상품이나 서비스를 입력해보세요..."
        @keydown.enter.prevent="handleEnterKey"
        ref="searchInput"
      />
      <button class="search-button" :disabled="loading" @click="searchWithNewQuery">
        <span v-if="loading">
          <i class="icon-loading"></i>
        </span>
        <span v-else>검색</span>
      </button>
    </div>

    <div class="search-content">
      <div v-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>검색 중입니다...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="retrySearch" class="retry-button">다시 시도</button>
      </div>

      <div v-else-if="searchResponse" class="result-container">
        <!-- AI 응답 컴포넌트만 사용 -->
        <OptimizedAIResponse
          :pageType="'search'"
          :userQuery="query"
          :key="query"
          @generated="handleAIGenerated"
          @error="handleAIError"
          @componentClick="handleComponentClick"
        />
      </div>

      <div v-else class="no-results">
        <p>검색 결과가 없습니다. 다른 검색어를 입력해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BffService } from '../services/BffService'
import type { BffResponse } from '../services/BffService'
import OptimizedAIResponse from '../components/OptimizedAIResponse.vue'
import { useAINavigatorStore } from '../stores/aiNavigator'

export default defineComponent({
  name: 'SearchResultView',
  components: {
    OptimizedAIResponse,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const aiNavigatorStore = useAINavigatorStore()
    const bffService = new BffService()

    // 데이터 상태 관리
    const query = ref<string>('')
    const newQuery = ref<string>('') // 새 검색어 입력용 변수
    const searchInput = ref<HTMLInputElement | null>(null)
    const searchResponse = ref<BffResponse | null>(null)
    const loading = ref<boolean>(true)
    const error = ref<string | null>(null)
    const isProcessingEnter = ref<boolean>(false) // 엔터 키 처리 중인지 여부 추적

    // 새로 추가되는 상태 변수들
    const openedFaq = ref<string>('')
    const suggestedKeywords = ref<string[]>([
      '건강보험',
      '생명보험',
      '암보험',
      '자동차보험',
      '실손보험',
    ])

    // 검색 결과 계산 속성
    const hasAnyResults = computed(() => {
      if (!searchResponse.value?.searchResults) return false
      const results = searchResponse.value.searchResults
      return (
        (results.products?.length || 0) +
          (results.faqs?.length || 0) +
          (results.testimonials?.length || 0) >
        0
      )
    })

    // 페이지 로드 시 URL에서 쿼리 추출
    onMounted(async () => {
      // URL에서 쿼리 추출 및 디코딩
      const rawQuery = (route.query.q as string) || ''
      query.value = decodeURIComponent(rawQuery) // URL 디코딩 적용
      newQuery.value = query.value // 새 검색어 입력란에 현재 검색어 복사

      if (!query.value) {
        error.value = '검색어가 없습니다.'
        loading.value = false
        return
      }

      // 기본 상태 설정
      loading.value = false
      searchResponse.value = {
        answer: '',
        recommendedPath: null,
        confidence: 1,
        contentType: 'ai_dynamic',
        hasLinks: false,
      }

      // 검색 입력 필드 접근성 개선
      setTimeout(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      }, 300)
    })

    // 엔터 키 핸들러 (한글 IME 이중 입력 방지)
    const handleEnterKey = (e: KeyboardEvent) => {
      // 이미 처리 중이면 무시
      if (isProcessingEnter.value) return

      // IME 조합 중인지 확인
      if (e.isComposing || e.keyCode === 229) return

      isProcessingEnter.value = true

      // 디바운스 처리
      setTimeout(() => {
        searchWithNewQuery()
        isProcessingEnter.value = false
      }, 100)
    }

    // 새 검색어로 검색 실행
    const searchWithNewQuery = () => {
      if (!newQuery.value.trim()) return

      // 라우터를 통해 새 검색 수행 (동일 페이지 내에서 URL 파라미터만 변경)
      router
        .push({
          path: '/search',
          query: { q: newQuery.value },
        })
        .then(() => {
          query.value = newQuery.value
        })
        .catch((error) => {
          console.error('❌ 라우터 이동 실패:', error)
        })
    }

    // 다시 검색 시도
    const retrySearch = () => {
      searchWithNewQuery()
    }

    // 뒤로가기 함수
    const goBack = () => {
      router.go(-1)
    }

    // 가격 포맷팅 함수
    const formatPrice = (price: number): string => {
      if (!price) return '0'
      return price.toLocaleString()
    }

    // 상품 상세 페이지로 이동
    const navigateToProduct = (productId: string) => {
      router.push(`/products/${productId}`)
    }

    // FAQ 토글 함수
    const toggleFaq = (faqId: string) => {
      if (openedFaq.value === faqId) {
        openedFaq.value = ''
      } else {
        openedFaq.value = faqId
      }
    }

    // 키워드로 검색
    const searchWithKeyword = (keyword: string) => {
      newQuery.value = keyword
      searchWithNewQuery()
    }

    // 인라인 스타일 파싱 함수
    const parseInlineStyle = (styleString: string): Record<string, string> => {
      if (!styleString || typeof styleString !== 'string') return {}

      const styleObj: Record<string, string> = {}
      const styles = styleString.split(';').filter((s) => s.trim())

      styles.forEach((style) => {
        const [property, value] = style.split(':').map((s) => s.trim())
        if (property && value) {
          // CSS 속성명을 camelCase로 변환
          const camelProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
          styleObj[camelProperty] = value
        }
      })

      return styleObj
    }

    // 동적 컴포넌트 클릭 핸들러
    const handleDynamicClick = (component: any) => {
      if (component.data?.cta_link) {
        router.push(component.data.cta_link)
      } else if (component.data?.link) {
        router.push(component.data.link)
      }
    }

    // 상품 내비게이션 핸들러
    const handleProductNavigation = (link: string) => {
      if (link) {
        router.push(link)
      }
    }

    // CTA 버튼 클릭 핸들러
    const handleCTAClick = (link: string) => {
      if (link) {
        router.push(link)
      }
    }

    // OptimizedAIResponse 이벤트 핸들러들
    const handleAIGenerated = (response: any) => {
      // 필요한 경우 추가 처리
    }

    const handleAIError = (error: any) => {
      console.error('AI UI 생성 실패:', error)
      // 에러 처리 로직
    }

    const handleComponentClick = (component: any) => {
      // 컴포넌트 클릭 처리 로직
      if (component.data?.cta_link) {
        router.push(component.data.cta_link)
      }
    }

    return {
      query,
      newQuery,
      searchInput,
      searchResponse,
      loading,
      error,
      searchWithNewQuery,
      handleEnterKey,
      retrySearch,
      goBack,
      openedFaq,
      suggestedKeywords,
      hasAnyResults,
      formatPrice,
      navigateToProduct,
      toggleFaq,
      searchWithKeyword,
      parseInlineStyle,
      handleDynamicClick,
      handleProductNavigation,
      handleCTAClick,
      handleAIGenerated,
      handleAIError,
      handleComponentClick,
    }
  },
})
</script>

<style scoped>
.search-result-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.back-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  color: var(--color-primary);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.back-button i {
  margin-right: 0.5rem;
}

.search-title {
  font-size: 1.5rem;
  margin: 0;
  flex-grow: 1;
}

/* 검색 입력 필드 스타일 */
.search-input-container {
  display: flex;
  margin: 0 0 2rem 0;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--border-radius-md);
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  background-color: transparent;
  color: var(--color-text);
  caret-color: var(--color-primary);
  z-index: 6;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
}

.search-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  position: relative;
  z-index: 6;
  min-width: 80px;
  box-shadow: 0 0 10px rgba(138, 156, 245, 0.5);
}

.search-button:hover {
  background-color: var(--color-primary-dark);
}

.search-button:disabled {
  background-color: var(--color-background-mute);
  cursor: not-allowed;
}

.icon-loading::before {
  content: '...';
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 2rem;
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-md);
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.retry-button:hover {
  background-color: var(--color-primary-dark);
}

.result-container {
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-md);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: stretch;
  }

  .back-button {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .search-title {
    font-size: 1.25rem;
  }

  .search-input-container {
    margin: 1rem 0;
  }

  .search-input {
    font-size: 0.9rem;
  }
}

/* 검색 결과 섹션 스타일 */
.search-sections {
  margin-top: 2rem;
}

.search-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--color-background-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.section-header h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.5rem;
  font-weight: 600;
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.view-all-link:hover {
  color: var(--color-primary-dark);
}

/* 상품 그리드 스타일 */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--color-border);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.product-header h4 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
}

.popular-badge {
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-full);
  font-weight: 500;
}

.product-description {
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-details .label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  display: block;
}

.product-details .value {
  font-weight: 600;
  color: var(--color-heading);
  display: block;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--color-background-mute);
  color: var(--color-text);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
}

/* FAQ 리스트 스타일 */
.faqs-list {
  space-y: 1rem;
}

.faq-item {
  background: white;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all 0.3s;
}

.faq-item:hover {
  box-shadow: var(--shadow-sm);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: var(--color-background-soft);
}

.question-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-badge {
  background: var(--color-secondary);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-weight: 500;
}

.question-content h4 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 500;
}

.expand-icon {
  transition: transform 0.3s;
  color: var(--color-text-light);
}

.expand-icon.active {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease-out,
    padding 0.3s ease-out;
  background-color: var(--color-background-soft);
}

.faq-answer.active {
  max-height: 200px;
  padding: 1.5rem;
}

.faq-answer p {
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
}

/* 고객 후기 그리드 스타일 */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.testimonial-card {
  background: white;
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  transition: all 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rating {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #e5e7eb;
  font-size: 1rem;
}

.star.filled {
  color: #fbbf24;
}

.verified-badge {
  background: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
}

.testimonial-card h4 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.testimonial-content {
  color: var(--color-text);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.testimonial-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* 상세한 검색 결과 없음 스타일 */
.no-results-detailed {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--color-background-light);
  border-radius: var(--border-radius-lg);
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-results-detailed h3 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.5rem;
}

.no-results-detailed p {
  margin: 0 0 2rem 0;
  color: var(--color-text);
  font-size: 1.1rem;
}

.suggested-keywords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.keyword-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.keyword-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* 반응형 조정 */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .product-details {
    grid-template-columns: 1fr;
  }

  .testimonial-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .suggested-keywords {
    flex-direction: column;
    align-items: center;
  }

  .keyword-button {
    width: 100%;
    max-width: 200px;
  }
}

/* 동적 UI 컴포넌트 스타일 */
.dynamic-ui-container {
  margin-top: 2rem;
  space-y: 2rem;
}

.dynamic-component {
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  cursor: pointer;
}

.dynamic-component:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.component-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: inherit;
}

.component-content {
  line-height: 1.6;
  color: inherit;
}

.component-content strong {
  font-weight: 600;
}

.component-content em {
  font-style: italic;
}

/* 통계 그리드 스타일 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  backdrop-filter: blur(10px);
}

.stat-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.stat-trend {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

/* 이유 리스트 스타일 */
.reasons-list {
  margin-top: 1.5rem;
  space-y: 1rem;
}

.reason-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.reason-point {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: inherit;
}

.reason-explanation {
  opacity: 0.9;
  line-height: 1.5;
}

/* 상품 쇼케이스 스타일 */
.products-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.product-item {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  color: var(--color-text);
  cursor: pointer;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-item h4 {
  margin: 0 0 1rem 0;
  color: var(--color-heading);
  font-size: 1.2rem;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.product-coverage {
  color: var(--color-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.product-benefit {
  color: var(--color-text);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  background: var(--color-background-soft);
  color: var(--color-text);
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.8rem;
  font-weight: 500;
}

/* 10대 친화적 상품 스타일 */
.teen-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.teen-product-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-lg);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: var(--color-text);
  transition: all 0.3s ease;
}

.teen-product-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.teen-product-card h4 {
  margin: 0 0 1.5rem 0;
  color: var(--color-heading);
  font-size: 1.3rem;
  text-align: center;
}

.product-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.detail-item .label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.detail-item .value {
  display: block;
  font-weight: 600;
  color: var(--color-heading);
  font-size: 1rem;
}

/* CTA 버튼 스타일 */
.component-cta {
  margin-top: 1.5rem;
  text-align: center;
}

.cta-button {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 반응형 동적 컴포넌트 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .products-showcase {
    grid-template-columns: 1fr;
  }

  .teen-products {
    grid-template-columns: 1fr;
  }

  .product-details-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-bottom: 0.5rem;
  }
}
</style>
