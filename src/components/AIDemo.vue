<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { BffService } from '../services/BffService'
import type { BffResponse } from '../services/BffService'
import AIResponse from './AIResponse.vue'

export default defineComponent({
  name: 'AIDemo',
  components: {
    AIResponse,
  },
  setup() {
    // BFF 서비스 인스턴스
    const bffService = new BffService()

    // 상태 관리
    const inputQuery = ref('')
    const isProcessing = ref(false)
    const response = ref<BffResponse | null>(null)

    // 사용자 프로필 샘플
    const userProfiles = [
      {
        name: '김영수',
        age: 35,
        digitalProficiency: 'high',
        preferences: {},
      },
      {
        name: '박정희',
        age: 68,
        digitalProficiency: 'low',
        preferences: {
          fontSize: '크게',
          contrast: '높음',
          interactionMethod: '간편함',
        },
      },
      {
        name: '이민지',
        age: 28,
        digitalProficiency: 'medium',
        preferences: {},
      },
    ]

    // 현재 선택된 사용자 프로필
    const selectedProfileIndex = ref(0)

    // 샘플 질의
    const sampleQueries = [
      '암보험에 대해 알려주세요',
      '상담 페이지로 가려면 어떻게 하나요?',
      '보험금 청구는 어떻게 하나요?',
      'FAQ 페이지가 어디인가요?',
    ]

    // 구성 요소 마운트 시 사용자 프로필 설정
    onMounted(() => {
      selectProfile(selectedProfileIndex.value)
    })

    // 사용자 프로필 선택
    function selectProfile(index: number) {
      selectedProfileIndex.value = index
      bffService.setUserProfile(userProfiles[index])
    }

    // 질의 제출 처리
    async function submitQuery() {
      if (!inputQuery.value.trim()) return

      isProcessing.value = true

      try {
        response.value = await bffService.processUserQuery(inputQuery.value)
      } catch (error) {
        console.error('Error processing query:', error)
      } finally {
        isProcessing.value = false
      }
    }

    // 샘플 질의 선택
    function selectSampleQuery(query: string) {
      inputQuery.value = query
      submitQuery()
    }

    return {
      inputQuery,
      isProcessing,
      response,
      userProfiles,
      selectedProfileIndex,
      sampleQueries,
      selectProfile,
      submitQuery,
      selectSampleQuery,
    }
  },
})
</script>

<template>
  <div class="ai-demo">
    <h2>AI 응답 데모</h2>

    <!-- 사용자 프로필 선택 -->
    <div class="profile-selector">
      <h3>사용자 프로필 선택</h3>
      <div class="profiles">
        <div
          v-for="(profile, index) in userProfiles"
          :key="index"
          class="profile-card"
          :class="{ active: selectedProfileIndex === index }"
          @click="selectProfile(index)"
        >
          <h4>{{ profile.name }}</h4>
          <p>나이: {{ profile.age }}</p>
          <p>
            디지털 역량:
            <span v-if="profile.digitalProficiency === 'high'">높음</span>
            <span v-else-if="profile.digitalProficiency === 'medium'">중간</span>
            <span v-else>낮음</span>
          </p>
          <p v-if="profile.preferences.fontSize">글자 크기: {{ profile.preferences.fontSize }}</p>
          <p v-if="profile.preferences.contrast">대비: {{ profile.preferences.contrast }}</p>
          <p v-if="profile.preferences.interactionMethod">
            상호작용: {{ profile.preferences.interactionMethod }}
          </p>
        </div>
      </div>
    </div>

    <!-- 질의 입력 폼 -->
    <div class="query-form">
      <h3>질문 입력</h3>
      <div class="input-container">
        <input
          v-model="inputQuery"
          type="text"
          placeholder="질문을 입력하세요..."
          @keyup.enter="submitQuery"
          :disabled="isProcessing"
        />
        <button @click="submitQuery" :disabled="isProcessing || !inputQuery.trim()">
          {{ isProcessing ? '처리 중...' : '질문하기' }}
        </button>
      </div>

      <!-- 샘플 질의 버튼 -->
      <div class="sample-queries">
        <h4>샘플 질의</h4>
        <div class="sample-buttons">
          <button
            v-for="(query, index) in sampleQueries"
            :key="index"
            @click="selectSampleQuery(query)"
            :disabled="isProcessing"
          >
            {{ query }}
          </button>
        </div>
      </div>
    </div>

    <!-- 응답 출력 -->
    <div class="response-container" v-if="response">
      <h3>AI 응답</h3>
      <AIResponse :response="response" />
    </div>
  </div>
</template>

<style scoped>
.ai-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

h2,
h3,
h4 {
  margin-bottom: 1rem;
}

.profile-selector {
  margin-bottom: 2rem;
}

.profiles {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.profile-card {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 1rem;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.3s;
}

.profile-card.active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  background-color: var(--color-surface-light);
}

.query-form {
  margin-bottom: 2rem;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-container input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
}

.input-container button,
.sample-buttons button {
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: background-color 0.3s;
}

.input-container button:hover,
.sample-buttons button:hover {
  background-color: var(--color-primary-dark);
}

.input-container button:disabled,
.sample-buttons button:disabled {
  background-color: var(--color-disabled);
  cursor: not-allowed;
}

.sample-queries {
  margin-top: 1.5rem;
}

.sample-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.response-container {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  background-color: var(--color-surface);
}
</style>
