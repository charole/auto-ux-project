<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { BffResponse } from '../services/BffService'
import { BffService } from '../services/BffService'

const router = useRouter()

// 자연어 입력 및 응답 상태
const userQuery = ref('')
const isProcessing = ref(false)
const response = ref<BffResponse | null>(null)
const customContentHtml = ref<string | null>(null)
const isProcessingEnter = ref(false) // 엔터 키 처리 중인지 여부 추적

// BFF 서비스 인스턴스
const bffService = new BffService()

// 사용자 정보 상태
const userProfile = ref<Record<string, unknown> | null>(null)

// 사용자 정보 로드
onMounted(() => {
  // 로컬 스토리지에서 사용자 프로필 로드
  const storedProfile = localStorage.getItem('userProfile')
  if (storedProfile) {
    try {
      userProfile.value = JSON.parse(storedProfile)

      // BFF 서비스에 사용자 정보 설정
      if (userProfile.value) {
        bffService.setUserProfile(userProfile.value)
      }
    } catch (e) {
      console.error('Failed to parse user profile from localStorage', e)
    }
  } else {
    // 사용자 프로필이 없으면 온보딩으로 리다이렉션
    router.push('/onboarding')
  }

  // 검색 입력 필드 접근성 개선
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
})

// 자연어 쿼리 처리
const processQuery = async () => {
  if (!userQuery.value.trim()) return

  // 검색 결과 페이지로 직접 이동
  router.push({
    path: '/search',
    query: { q: userQuery.value },
  })
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
    processQuery()
    isProcessingEnter.value = false
  }, 100)
}

// 이름으로 인사
const greeting = computed(() => {
  if (userProfile.value && typeof userProfile.value.name === 'string') {
    return `안녕하세요, ${userProfile.value.name}님!`
  }
  return '안녕하세요!'
})

// 맞춤 보험 추천 (사용자 정보 기반)
const recommendedProducts = computed(() => {
  if (!userProfile.value) return []

  const products = []

  // 사용자 관심사에 따른 보험 추천
  if (Array.isArray(userProfile.value.productInterests)) {
    const interests = userProfile.value.productInterests as string[]

    if (interests.includes('retirement')) {
      products.push({
        id: 'pension-plus',
        name: '연금플러스보험',
        description: '은퇴 후 안정적인 생활을 위한 맞춤형 연금보험',
        iconClass: 'icon-retirement',
      })
    }

    if (interests.includes('healthCare')) {
      products.push({
        id: 'health-care',
        name: '건강케어보험',
        description: '의료비 부담을 줄여주는 종합 건강보험',
        iconClass: 'icon-health',
      })
    }

    if (interests.includes('childEducation')) {
      products.push({
        id: 'child-edu',
        name: '자녀교육보험',
        description: '자녀의 미래를 위한 교육 자금 마련 플랜',
        iconClass: 'icon-education',
      })
    }
  }

  // 기본 추천 상품 (관심사가 없을 경우)
  if (products.length === 0) {
    products.push({
      id: 'life-secure',
      name: '생활안심보험',
      description: '일상의 다양한 위험에 대비하는 종합보험',
      iconClass: 'icon-life',
    })
  }

  return products
})

// 빠른 링크 섹션
const quickLinks = [
  { name: '보험상품', path: '/products', icon: 'icon-product' },
  { name: '보험금 청구', path: '/claim', icon: 'icon-claim' },
  { name: '마이페이지', path: '/mypage', icon: 'icon-mypage' },
  { name: 'FAQ', path: '/faq', icon: 'icon-faq' },
]

// 검색 입력 핸들러
const searchInput = ref<HTMLInputElement | null>(null)
const focusSearchInput = () => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
}
</script>

<template>
  <main>
    <div class="home-container">
      <!-- 헤더 배너 -->
      <section class="hero-banner glass-panel">
        <div class="hero-content">
          <h1>{{ greeting }}</h1>
          <p v-if="userProfile">시큐어라이프와 함께 안전한 미래를 준비하세요.</p>
          <p v-else>시큐어라이프에 오신 것을 환영합니다!</p>

          <!-- AI 어시스턴트 검색 -->
          <div class="search-container card-neumorphic">
            <input
              v-model="userQuery"
              type="text"
              class="search-input"
              placeholder="궁금한 보험 상품이나 서비스를 입력해보세요..."
              @keydown.enter.prevent="handleEnterKey"
              ref="searchInput"
              @click="focusSearchInput"
            />
            <button class="search-button" :disabled="isProcessing" @click="processQuery">
              <span v-if="isProcessing">
                <i class="icon-loading"></i>
              </span>
              <span v-else>검색</span>
            </button>
          </div>

          <!-- 응답 표시 영역 -->
          <div v-if="response" class="response-container glass-card">
            <p>{{ response.answer }}</p>
            <div v-if="response.recommendedPath" class="navigate-hint">
              <small>{{ response.recommendedPath }} 페이지로 이동합니다...</small>
            </div>
          </div>
        </div>
      </section>

      <!-- 맞춤형 콘텐츠 -->
      <section v-if="customContentHtml" class="custom-content-section glass-card">
        <div v-html="customContentHtml"></div>
      </section>

      <!-- 빠른 링크 섹션 -->
      <section class="quick-links-section">
        <h2 class="section-title">빠른 링크</h2>
        <div class="quick-links">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.path"
            :to="link.path"
            class="quick-link card-neumorphic"
          >
            <div :class="['link-icon', link.icon]"></div>
            <span>{{ link.name }}</span>
          </RouterLink>
        </div>
      </section>

      <!-- 맞춤 추천 상품 -->
      <section
        v-if="userProfile && recommendedProducts.length > 0"
        class="recommended-products-section"
      >
        <h2 class="section-title">맞춤 추천 상품</h2>
        <div class="products-grid">
          <div
            v-for="product in recommendedProducts"
            :key="product.id"
            class="product-card glass-card"
          >
            <div :class="['product-icon', product.iconClass]"></div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <RouterLink to="/products" class="view-more">자세히 보기</RouterLink>
          </div>
        </div>
      </section>

      <!-- 주요 혜택 & 서비스 -->
      <section class="benefits-section">
        <h2 class="section-title">주요 혜택 & 서비스</h2>
        <div class="benefits-grid">
          <div class="benefit-card card-neumorphic">
            <div class="benefit-icon icon-security"></div>
            <h3>안심 보장 서비스</h3>
            <p>업계 최고 수준의 보장 혜택을 제공합니다.</p>
          </div>

          <div class="benefit-card card-neumorphic">
            <div class="benefit-icon icon-online"></div>
            <h3>간편 온라인 서비스</h3>
            <p>언제 어디서나 편리하게 이용하세요.</p>
          </div>

          <div class="benefit-card card-neumorphic">
            <div class="benefit-icon icon-support"></div>
            <h3>24시간 고객 지원</h3>
            <p>언제든지 전문 상담사와 상담 가능합니다.</p>
          </div>

          <div class="benefit-card card-neumorphic">
            <div class="benefit-icon icon-reward"></div>
            <h3>건강 리워드</h3>
            <p>건강한 생활습관으로 혜택을 받으세요.</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-banner {
  margin-bottom: 3rem;
  padding: 3rem 2rem;
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.15), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.1), transparent 50%);
  z-index: -1;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 2rem;
}

/* 검색 컨테이너 */
.search-container {
  display: flex;
  margin: 2rem 0;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
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

:deep(.dark-mode) .search-container {
  background-color: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.dark-mode) .search-input {
  color: var(--color-text-light);
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

/* AI 응답 컨테이너 */
.response-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  text-align: left;
  font-size: 1.1rem;
  line-height: 1.6;
}

.navigate-hint {
  margin-top: 1rem;
  color: var(--color-text-light);
  font-style: italic;
}

/* 맞춤형 컨텐츠 섹션 */
.custom-content-section {
  margin-bottom: 3rem;
  padding: 2rem;
}

/* 빠른 링크 섹션 */
.quick-links-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-weight: 600;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.3s;
  text-align: center;
}

.quick-link:hover {
  transform: translateY(-5px);
}

.link-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
  background-color: var(--color-primary-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 추천 상품 섹션 */
.recommended-products-section {
  margin-bottom: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.product-card {
  padding: 2rem;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-icon {
  width: 60px;
  height: 60px;
  background-color: var(--color-primary-soft);
  border-radius: 50%;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.product-card p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.view-more {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.view-more:hover {
  text-decoration: underline;
}

/* 혜택 섹션 */
.benefits-section {
  margin-bottom: 3rem;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.benefit-card {
  padding: 2rem;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
  text-align: center;
}

.benefit-card:hover {
  transform: translateY(-5px);
}

.benefit-icon {
  width: 60px;
  height: 60px;
  background-color: var(--color-primary-soft);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.benefit-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.benefit-card p {
  color: var(--color-text-light);
  line-height: 1.5;
}

/* 아이콘 플레이스홀더 (실제 구현에서는 아이콘 추가) */
.icon-loading::before {
  content: '...';
  animation: pulse 1s infinite;
}

/* 다크모드에서 아이콘 스타일 변경 */
:deep(.dark-mode) .icon-product::before,
:deep(.dark-mode) .icon-claim::before,
:deep(.dark-mode) .icon-mypage::before,
:deep(.dark-mode) .icon-faq::before,
:deep(.dark-mode) .icon-security::before,
:deep(.dark-mode) .icon-online::before,
:deep(.dark-mode) .icon-support::before,
:deep(.dark-mode) .icon-reward::before,
:deep(.dark-mode) .icon-retirement::before,
:deep(.dark-mode) .icon-health::before,
:deep(.dark-mode) .icon-education::before,
:deep(.dark-mode) .icon-life::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' /%3E%3C/svg%3E");
  filter: brightness(1.5);
}

:deep(.dark-mode) .icon-claim::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-mypage::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-faq::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-security::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-online::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-support::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-reward::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-retirement::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-health::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-education::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath d='M12 14l9-5-9-5-9 5 9 5z' /%3E%3Cpath d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' /%3E%3C/svg%3E");
}

:deep(.dark-mode) .icon-life::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' /%3E%3C/svg%3E");
}

/* 다크모드에서 아이콘 배경 색상 조정 */
:deep(.dark-mode) .link-icon,
:deep(.dark-mode) .product-icon,
:deep(.dark-mode) .benefit-icon {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 이미 존재하는 아이콘 스타일 */
.icon-product::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-claim::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-mypage::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-faq::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-security::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-online::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-support::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-reward::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-retirement::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-health::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-education::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath d='M12 14l9-5-9-5-9 5 9 5z' /%3E%3Cpath d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.icon-life::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238a9cf5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.link-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
  background-color: var(--color-primary-soft);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-icon,
.benefit-icon {
  position: relative;
}

/* 반응형 */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .search-container {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 0.5rem;
  }

  .quick-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid,
  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
