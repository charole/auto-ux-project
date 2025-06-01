<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type {
  DynamicUIResponse,
  UIComponent,
  Product,
  Category,
  Testimonial,
} from '../services/BffService'
import { BffService } from '../services/BffService'

const router = useRouter()

// 상태 관리
const userQuery = ref('')
const isLoading = ref(true)
const isProcessing = ref(false)
const uiComponents = ref<UIComponent[]>([])
const customContentHtml = ref<string | null>(null)
const isProcessingEnter = ref(false)

// 데이터 상태
const categories = ref<Category[]>([])
const featuredProducts = ref<Product[]>([])
const testimonials = ref<Testimonial[]>([])
const healthStatus = ref(false)

// BFF 서비스 인스턴스
const bffService = new BffService()

// 사용자 정보 상태
const userProfile = ref<Record<string, unknown> | null>(null)
const userId = ref<string>('')

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  await loadInitialData()

  // 검색 입력 필드 접근성 개선
  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus()
    }
  })
})

// 초기 데이터 로드
const loadInitialData = async () => {
  try {
    isLoading.value = true

    // 사용자 프로필 로드
    loadUserProfile()

    // Backend 연결 상태 확인
    healthStatus.value = await bffService.healthCheck()

    if (healthStatus.value) {
      // 홈페이지 동적 UI 생성
      await generateHomeUI()

      // 기본 데이터 로드
      await Promise.all([loadCategories(), loadFeaturedProducts(), loadTestimonials()])
    } else {
      // 폴백 UI 생성
      generateFallbackUI()
    }
  } catch (error) {
    console.error('홈페이지 초기 데이터 로드 실패:', error)
    generateFallbackUI()
  } finally {
    isLoading.value = false
  }
}

// 사용자 프로필 로드
const loadUserProfile = () => {
  const storedProfile = localStorage.getItem('userProfile')
  if (storedProfile) {
    try {
      userProfile.value = JSON.parse(storedProfile)
      bffService.setUserProfile(userProfile.value!)

      // 환경 변수에서 기본 사용자 ID 가져오기 (타입 에러 수정)
      userId.value = 'demo-user-001'
    } catch (e) {
      console.error('사용자 프로필 파싱 실패:', e)
    }
  } else {
    // 기본 사용자 ID 설정
    userId.value = 'demo-user-001'
  }
}

// 홈페이지 동적 UI 생성
const generateHomeUI = async () => {
  try {
    const response = await bffService.generateDynamicUI('home', userId.value)

    if (response.success) {
      uiComponents.value = response.components
    } else {
      console.error('홈페이지 UI 생성 실패:', response.error)
      generateFallbackUI()
    }
  } catch (error) {
    console.error('홈페이지 UI 생성 중 오류:', error)
    generateFallbackUI()
  }
}

// 카테고리 데이터 로드
const loadCategories = async () => {
  try {
    const response = await bffService.getInsuranceCategories()
    if (response.success) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

// 추천 상품 데이터 로드
const loadFeaturedProducts = async () => {
  try {
    const response = await bffService.getInsuranceProducts(undefined, 6)
    if (response.success) {
      featuredProducts.value = response.data.filter((p) => p.is_popular)
    }
  } catch (error) {
    console.error('추천 상품 로드 실패:', error)
  }
}

// 고객 후기 데이터 로드
const loadTestimonials = async () => {
  try {
    const response = await bffService.getCustomerTestimonials(3)
    if (response.success) {
      testimonials.value = response.data
    }
  } catch (error) {
    console.error('고객 후기 로드 실패:', error)
  }
}

// 폴백 UI 생성
const generateFallbackUI = () => {
  uiComponents.value = [
    {
      type: 'hero_section',
      id: 'hero',
      title: 'SecureLife 보험',
      content: '믿을 수 있는 보험 파트너와 함께 안전한 미래를 준비하세요.',
      data: {},
      style: 'primary',
      priority: 1,
    },
    {
      type: 'notice',
      id: 'connection_notice',
      title: '서비스 연결 중',
      content: '최신 정보를 불러오는 중입니다. 잠시만 기다려주세요.',
      data: {},
      style: 'info',
      priority: 2,
    },
  ]
}

// 자연어 쿼리 처리
const processQuery = async () => {
  if (!userQuery.value.trim()) return

  // 검색 결과 페이지로 이동
  router.push({
    path: '/search',
    query: { q: userQuery.value },
  })
}

// 엔터 키 핸들러
const handleEnterKey = (e: KeyboardEvent) => {
  if (isProcessingEnter.value) return
  if (e.isComposing || e.keyCode === 229) return

  isProcessingEnter.value = true
  setTimeout(() => {
    processQuery()
    isProcessingEnter.value = false
  }, 100)
}

// 컴포넌트별 렌더링 함수들 (기존 호환성 유지용)
const renderHeroSection = (component: UIComponent) => {
  return {
    title: component.title,
    content: component.content,
    style: component.style,
  }
}

const renderProductCard = (component: UIComponent) => {
  return {
    title: component.title,
    content: component.content,
    data: component.data,
    style: component.style,
  }
}

const renderButton = (component: UIComponent, path?: string) => {
  return {
    title: component.title,
    content: component.content,
    path: path || component.data.path || '#',
    style: component.style,
  }
}

// 컴포넌트 타입별 스타일 클래스 (기본값만)
const getComponentClass = (component: UIComponent) => {
  return `dynamic-component component-${component.type}`
}

// 인사말 계산
const greeting = computed(() => {
  if (userProfile.value && typeof userProfile.value.name === 'string') {
    return `안녕하세요, ${userProfile.value.name}님!`
  }
  return '안녕하세요!'
})

// 빠른 링크
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

// 상품 카드 클릭 핸들러
const handleProductClick = (productId: string) => {
  router.push(`/products/${productId}`)
}

// 카테고리 클릭 핸들러
const handleCategoryClick = (categoryId: string) => {
  router.push(`/products?category=${categoryId}`)
}

// 동적 컴포넌트 렌더링을 위한 함수들
const getComponentTag = (type: string): string => {
  // 백엔드에서 전송한 실제 HTML 태그를 그대로 사용
  const htmlTags = ['section', 'header', 'nav', 'main', 'div', 'article', 'aside', 'footer']
  return htmlTags.includes(type) ? type : 'div'
}

const parseInlineStyle = (styleString: string): Record<string, string> => {
  // 인라인 CSS 스타일 문자열을 파싱하여 Vue 스타일 객체로 변환
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

const handleDynamicClick = (component: UIComponent) => {
  // CTA 링크나 버튼 클릭 처리
  if (component.data?.cta_link) {
    router.push(component.data.cta_link)
  } else if (component.data?.link) {
    router.push(component.data.link)
  }
}

const handleProductNavigation = (link: string) => {
  router.push(link)
}

const handleCategoryNavigation = (categoryName: string) => {
  router.push(`/products?category=${categoryName}`)
}
</script>

<template>
  <main>
    <div class="home-container">
      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>최적화된 페이지를 준비하고 있습니다...</p>
      </div>

      <!-- 동적 UI 컴포넌트들 -->
      <div v-else>
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
          </div>
        </section>

        <!-- 동적 생성된 UI 컴포넌트들 -->
        <section class="dynamic-ui-section">
          <component
            v-for="component in uiComponents"
            :key="component.id"
            :is="getComponentTag(component.type)"
            :class="getComponentClass(component)"
            :style="parseInlineStyle(component.style)"
          >
            <!-- 컴포넌트 제목 -->
            <h3 v-if="component.title" class="component-title">{{ component.title }}</h3>

            <!-- 컴포넌트 내용 -->
            <div
              v-if="component.content"
              class="component-content"
              v-html="component.content"
            ></div>

            <!-- 추가 데이터 렌더링 -->
            <div v-if="component.data" class="component-data">
              <!-- CTA 버튼 -->
              <router-link
                v-if="component.data.cta_text && component.data.cta_link"
                :to="component.data.cta_link"
                class="component-cta-button"
              >
                {{ component.data.cta_text }}
              </router-link>

              <!-- 통계 데이터 -->
              <div v-if="component.data.stats" class="stats-container">
                <div v-for="(stat, index) in component.data.stats" :key="index" class="stat-item">
                  <span class="stat-icon">{{ stat.icon }}</span>
                  <div class="stat-info">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                    <div v-if="stat.trend" class="stat-trend">{{ stat.trend }}</div>
                  </div>
                </div>
              </div>

              <!-- 상품 데이터 -->
              <div v-if="component.data.products" class="products-container">
                <div
                  v-for="(product, index) in component.data.products"
                  :key="index"
                  class="product-item"
                  @click="handleProductNavigation(product.link)"
                >
                  <h4>{{ product.name }}</h4>
                  <div class="product-price">{{ product.price }}</div>
                  <div class="product-coverage">{{ product.coverage }}</div>
                  <div v-if="product.features" class="product-features">
                    <span v-for="feature in product.features" :key="feature" class="feature-tag">
                      {{ feature }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 카테고리 데이터 -->
              <div v-if="component.data.categories" class="categories-container">
                <div
                  v-for="(category, index) in component.data.categories"
                  :key="index"
                  class="category-item"
                  @click="handleCategoryNavigation(category.name)"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <div class="category-info">
                    <div class="category-name">{{ category.name }}</div>
                    <div class="category-count">{{ category.count }}개 상품</div>
                  </div>
                </div>
              </div>
            </div>
          </component>
        </section>

        <!-- 빠른 링크 섹션 -->
        <section class="quick-links-section">
          <h2 class="section-title">빠른 링크</h2>
          <div class="quick-links-grid">
            <router-link
              v-for="link in quickLinks"
              :key="link.name"
              :to="link.path"
              class="quick-link-card card-neumorphic"
            >
              <i :class="link.icon"></i>
              <span>{{ link.name }}</span>
            </router-link>
          </div>
        </section>

        <!-- 보험 카테고리 섹션 (Backend 데이터) -->
        <section v-if="categories.length > 0" class="categories-section">
          <h2 class="section-title">보험 상품 카테고리</h2>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-card card-neumorphic"
              @click="handleCategoryClick(category.id)"
            >
              <div class="category-icon">
                <img :src="category.icon_url" :alt="category.name" />
              </div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
            </div>
          </div>
        </section>

        <!-- 인기 상품 섹션 (Backend 데이터) -->
        <section v-if="featuredProducts.length > 0" class="featured-products-section">
          <h2 class="section-title">인기 보험 상품</h2>
          <div class="products-grid">
            <div
              v-for="product in featuredProducts"
              :key="product.id"
              class="product-card card-neumorphic"
              @click="handleProductClick(product.id)"
            >
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-features">
                <span
                  v-for="feature in product.features?.slice(0, 2)"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
              <div class="product-price">월 {{ product.base_price?.toLocaleString() }}원부터</div>
            </div>
          </div>
        </section>

        <!-- 고객 후기 섹션 (Backend 데이터) -->
        <section v-if="testimonials.length > 0" class="testimonials-section">
          <h2 class="section-title">고객 후기</h2>
          <div class="testimonials-grid">
            <div
              v-for="testimonial in testimonials"
              :key="testimonial.id"
              class="testimonial-card glass-card"
            >
              <div class="testimonial-rating">
                <span v-for="n in testimonial.rating" :key="n" class="star">★</span>
              </div>
              <h4>{{ testimonial.title }}</h4>
              <blockquote>{{ testimonial.content }}</blockquote>
              <cite v-if="testimonial.is_verified" class="verified">인증된 후기</cite>
            </div>
          </div>
        </section>

        <!-- 연결 상태 표시 -->
        <div v-if="!healthStatus" class="connection-status">
          <i class="icon-warning"></i>
          <span>오프라인 모드로 실행 중입니다.</span>
        </div>
      </div>
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

/* 동적 UI 컴포넌트 스타일 */
.dynamic-ui-section {
  margin: 2rem 0;
}

.dynamic-component {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.component-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.component-content {
  line-height: 1.6;
  color: var(--color-text-soft);
  margin-bottom: 1.5rem;
}

.component-data {
  margin-top: 1.5rem;
}

.component-cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.component-cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

/* 통계 컨테이너 스타일 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  border: 1px solid var(--color-border-soft);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-soft);
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--color-success-soft);
  color: var(--color-success);
  font-weight: 600;
}

/* 상품 컨테이너 스타일 */
.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-item {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  border: 1px solid var(--color-border-soft);
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.product-item h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.product-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.product-coverage {
  font-size: 0.875rem;
  color: var(--color-text-soft);
  margin-bottom: 1rem;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.feature-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  border-radius: 20px;
  font-weight: 500;
}

/* 카테고리 컨테이너 스타일 */
.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  border: 1px solid var(--color-border-soft);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.category-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.category-info {
  flex: 1;
}

.category-name {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.category-count {
  font-size: 0.875rem;
  color: var(--color-text-soft);
}

/* 다크모드 지원 */
@media (prefers-color-scheme: dark) {
  .dynamic-component {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-item,
  .product-item,
  .category-item {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .component-title {
    color: var(--color-text-dark);
  }

  .component-content {
    color: var(--color-text-soft-dark);
  }
}
</style>
