<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import type { BffResponse } from '../services/BffService'
import { BffService } from '../services/BffService'
import AdaptiveMarkdown from './AdaptiveMarkdown.vue'
import AdaptiveUI from './AdaptiveUI.vue'
import AdaptiveLink from './AdaptiveLink.vue'

export default defineComponent({
  name: 'AIResponse',
  components: {
    AdaptiveMarkdown,
    AdaptiveUI,
    AdaptiveLink,
  },
  props: {
    // BFF 응답 데이터
    response: {
      type: Object as () => BffResponse,
      required: true,
    },
  },
  setup(props) {
    // BffService 인스턴스 생성
    const bffService = new BffService()

    // 처리된 응답 데이터
    const enhancedResponse = ref<BffResponse>({ ...props.response })

    // 처리된 HTML 응답
    const processedHtmlContent = ref('')

    // 응답 내용에 Markdown 링크가 포함되어 있는지 확인
    const hasLinks = computed(() => enhancedResponse.value.hasLinks)

    // 응답 타입에 따라 적절한 컴포넌트 렌더링 방식 선택
    const contentType = computed(() => enhancedResponse.value.contentType)

    // 처리된 응답 텍스트
    const processedContent = computed(() => enhancedResponse.value.answer)

    // 응답이 변경될 때마다 처리
    watch(
      () => props.response,
      (newResponse) => {
        // 응답 개선 (링크 처리 등)
        enhancedResponse.value = bffService.enhanceAIResponse({ ...newResponse })

        // HTML 타입인 경우 추가 처리
        if (newResponse.contentType === 'html') {
          processedHtmlContent.value = bffService.convertMarkdownLinksToHtml(newResponse.answer)
        }
      },
      { immediate: true },
    )

    return {
      hasLinks,
      contentType,
      processedHtmlContent,
      processedContent,
      bffService,
      enhancedResponse,
    }
  },
})
</script>

<template>
  <div class="ai-response">
    <!-- 텍스트 응답 (모든 텍스트 응답은 AdaptiveMarkdown을 사용하여 링크를 처리) -->
    <template v-if="contentType === 'text'">
      <AdaptiveUI :uiSuggestions="enhancedResponse.uiSuggestions" type="text">
        <AdaptiveMarkdown
          :content="processedContent"
          :uiSuggestions="enhancedResponse.uiSuggestions"
        />
      </AdaptiveUI>
    </template>

    <!-- HTML 응답 -->
    <template v-else-if="contentType === 'html'">
      <AdaptiveUI :uiSuggestions="enhancedResponse.uiSuggestions" type="card">
        <div v-html="processedHtmlContent || processedContent"></div>
      </AdaptiveUI>
    </template>

    <!-- JSON 응답 -->
    <template v-else-if="contentType === 'json'">
      <AdaptiveUI :uiSuggestions="enhancedResponse.uiSuggestions" type="card">
        <pre class="json-content">{{ JSON.stringify(JSON.parse(processedContent), null, 2) }}</pre>
      </AdaptiveUI>
    </template>

    <!-- 오류 응답 -->
    <template v-else>
      <AdaptiveUI
        :uiSuggestions="{
          fontSize: '표준',
          contrast: '높음',
          simplicity: '표준',
          interactionMethod: '표준',
        }"
        type="card"
      >
        <div v-html="bffService.convertMarkdownLinksToHtml(processedContent)"></div>
      </AdaptiveUI>
    </template>

    <!-- 추천 경로가 있는 경우 추가 정보 표시 -->
    <div
      v-if="enhancedResponse.recommendedPath && enhancedResponse.confidence > 0.5"
      class="recommendation"
    >
      <AdaptiveLink
        :text="`추천 페이지: ${enhancedResponse.recommendedPath}`"
        :to="enhancedResponse.recommendedPath"
        :uiSuggestions="enhancedResponse.uiSuggestions"
        displayAs="button"
      />
    </div>
  </div>
</template>

<style scoped>
.ai-response {
  margin-bottom: 1.5rem;
}

.json-content {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  overflow-x: auto;
  font-family: monospace;
}

.error-message {
  color: var(--color-error);
  font-weight: bold;
}

.recommendation {
  margin-top: 1rem;
}
</style>
