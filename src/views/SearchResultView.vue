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
        <!-- AI 응답 컴포넌트 -->
        <AIResponse :response="searchResponse" />

        <!-- 추천 링크 또는 추가 액션 -->
        <div v-if="searchResponse.recommendedPath" class="recommended-actions">
          <h3>추천 페이지</h3>
          <AdaptiveLink
            :to="searchResponse.recommendedPath"
            :text="getPageTitle(searchResponse.recommendedPath)"
            displayAs="button"
            :uiSuggestions="searchResponse.uiSuggestions"
          />
        </div>
      </div>

      <div v-else class="no-results">
        <p>검색 결과가 없습니다. 다른 검색어를 입력해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BffService, type BffResponse } from '../services/BffService'
import AIResponse from '../components/AIResponse.vue'
import AdaptiveLink from '../components/AdaptiveLink.vue'
import { useAINavigatorStore } from '../stores/aiNavigator'

export default defineComponent({
  name: 'SearchResultView',
  components: {
    AIResponse,
    AdaptiveLink,
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

    // 페이지 로드 시 URL에서 쿼리 추출 및 검색 수행
    onMounted(async () => {
      // URL에서 쿼리 추출
      query.value = (route.query.q as string) || ''
      newQuery.value = query.value // 새 검색어 입력란에 현재 검색어 복사

      if (!query.value) {
        error.value = '검색어가 없습니다.'
        loading.value = false
        return
      }

      await performSearch()

      // 검색 입력 필드 접근성 개선
      setTimeout(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      }, 300)
    })

    // 검색 수행 함수
    const performSearch = async () => {
      loading.value = true
      error.value = null

      try {
        // BFF 서비스를 통해 검색 쿼리 처리
        const rawResponse = await bffService.processUserQuery(query.value)

        // 응답 개선 (마크다운 링크 처리 등)
        searchResponse.value = bffService.enhanceAIResponse(rawResponse)

        // 검색 기록에 추가
        aiNavigatorStore.addSearchHistory({
          query: query.value,
          timestamp: new Date().toISOString(),
          result: searchResponse.value,
        })
      } catch (err) {
        error.value = err instanceof Error ? err.message : '검색 중 오류가 발생했습니다.'
        console.error('Search error:', err)
      } finally {
        loading.value = false
      }
    }

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
          performSearch()
        })
    }

    // 다시 검색 시도
    const retrySearch = () => {
      performSearch()
    }

    // 뒤로가기 함수
    const goBack = () => {
      router.go(-1)
    }

    // 경로에 해당하는 페이지 제목 반환
    const getPageTitle = (path: string): string => {
      // 웹사이트 구조에서 경로에 해당하는 페이지 제목 찾기
      const page = aiNavigatorStore.getPageByPath(path)
      return page ? page.title : path
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
      getPageTitle,
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

.recommended-actions {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-md);
}

.recommended-actions h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: var(--color-background-light);
  border-radius: var(--border-radius-md);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-input-container {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
    padding: 0.75rem;
  }

  .search-input {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
