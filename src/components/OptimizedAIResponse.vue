<template>
  <div class="ai-response-optimized">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>AI가 맞춤 보험 정보를 생성 중입니다...</p>
    </div>

    <!-- AI 응답 렌더링 -->
    <div v-else-if="response" class="response-container">
      <!-- 메타 정보 표시 (선택적) -->
      <div v-if="showMeta" class="meta-info">
        <span class="product-count" v-if="response.total_products">
          총 {{ response.total_products }}개 상품
        </span>
        <span class="ai-badge" v-if="response.ai_generated"> 🤖 AI 생성 </span>
      </div>

      <!-- 컴포넌트별 렌더링 -->
      <div
        v-for="component in sortedComponents"
        :key="component.id"
        :class="['ui-component', `component-${component.type}`, `priority-${component.priority}`]"
        :style="component.style"
        :data-component-id="component.id"
      >
        <!-- 제목이 있는 경우 -->
        <h2 v-if="component.title" class="component-title">
          {{ component.title }}
        </h2>

        <!-- HTML 콘텐츠 안전하게 렌더링 -->
        <div
          v-html="component.content"
          class="component-content"
          @click="handleComponentClick(component)"
        ></div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else class="error-state">
      <p>콘텐츠를 불러올 수 없습니다.</p>
      <button @click="retry" class="retry-btn">다시 시도</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent, watch } from 'vue'
import { uxService, type UXResponse, type UIComponent } from '../services/uxService'

export default defineComponent({
  name: 'OptimizedAIResponse',
  props: {
    pageType: {
      type: String,
      required: true,
    },
    userQuery: {
      type: String,
      default: '',
    },
    showMeta: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['generated', 'error', 'componentClick'],
  setup(props, { emit, expose }) {
    const loading = ref(false)
    const response = ref<UXResponse | null>(null)

    // 우선순위순으로 정렬된 컴포넌트
    const sortedComponents = computed(() => {
      if (!response.value?.components) return []
      return [...response.value.components].sort((a, b) => a.priority - b.priority)
    })

    // UI 생성 함수
    const generateUI = async () => {
      loading.value = true
      try {
        const result = await uxService.generateUI(props.pageType, props.userQuery)
        response.value = result

        // 성공 이벤트 발송
        emit('generated', result)
      } catch (error) {
        console.error('UI 생성 실패:', error)
        response.value = {
          components: [],
          total_products: 0,
          generated_at: new Date().toISOString(),
          ai_generated: false,
        }
      } finally {
        loading.value = false
      }
    }

    // 컴포넌트 클릭 처리
    const handleComponentClick = (component: UIComponent) => {
      emit('componentClick', component)
    }

    // 재시도
    const retry = () => {
      generateUI()
    }

    // userQuery 변경 감지 (초기 로딩 포함)
    watch(
      () => props.userQuery,
      (newQuery, oldQuery) => {
        // 초기 로딩이거나 실제로 쿼리가 변경된 경우에만 실행
        if (newQuery !== oldQuery || oldQuery === undefined) {
          generateUI()
        }
      },
      { immediate: true },
    )

    // 외부에서 호출 가능하도록 expose
    expose({
      generateUI,
      retry,
    })

    return {
      loading,
      response,
      sortedComponents,
      generateUI,
      handleComponentClick,
      retry,
    }
  },
})
</script>

<style scoped>
.ai-response-optimized {
  width: 100%;
  min-height: 200px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.meta-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.product-count {
  background: #e3f2fd;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: #1976d2;
  font-weight: 500;
}

.ai-badge {
  background: #f3e5f5;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: #7b1fa2;
  font-weight: 500;
}

.ui-component {
  margin-bottom: 1.5rem;
  position: relative;
}

.component-title {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
}

.component-content {
  line-height: 1.6;
}

/* 컴포넌트 타입별 스타일 */
.component-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.component-notice {
  border-left: 4px solid #ffc107;
  background: #fff3cd;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #0056b3;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .ai-response-optimized {
    padding: 0.5rem;
  }

  .meta-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
