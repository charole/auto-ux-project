<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product, Category, UIComponent } from '../services/BffService'
import { BffService } from '../services/BffService'

const route = useRoute()
const router = useRouter()

// 상태 관리
const isLoading = ref(true)
const isProcessing = ref(false)
const selectedCategory = ref('all')
const searchQuery = ref('')

// 데이터 상태
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const filteredProducts = ref<Product[]>([])
const uiComponents = ref<UIComponent[]>([])

// BFF 서비스 인스턴스
const bffService = new BffService()

// 사용자 정보
const userId = ref('')

// 보험료 계산기 상태
const calculatorForm = ref({
  name: '',
  age: null as unknown as number,
  gender: '',
  productType: '',
})

// 보험료 결과
const calculationResult = ref({
  show: false,
  loading: false,
  monthlyPrice: 0,
  coverage: 0,
  recommendation: '',
})

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  await loadInitialData()

  // URL 쿼리 파라미터에서 카테고리 설정
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
  }

  // URL 쿼리 파라미터에서 검색어 설정
  if (route.query.search) {
    searchQuery.value = route.query.search as string
  }
})

// 카테고리 변경 감지
watch(selectedCategory, (newCategory) => {
  updateFilters()

  // URL 업데이트
  router.replace({
    query: {
      ...route.query,
      category: newCategory === 'all' ? undefined : newCategory,
    },
  })
})

// 검색어 변경 감지
watch(searchQuery, (newQuery) => {
  updateFilters()

  // URL 업데이트
  router.replace({
    query: {
      ...route.query,
      search: newQuery || undefined,
    },
  })
})

// 초기 데이터 로드
const loadInitialData = async () => {
  try {
    isLoading.value = true

    // 사용자 ID 설정
    userId.value = 'demo-user-001'

    // 동적 UI 생성
    await generateProductsPageUI()

    // 카테고리 및 상품 로드
    await Promise.all([loadCategories(), loadProducts()])

    // 필터 적용
    updateFilters()
  } catch (error) {
    console.error('상품 페이지 초기 데이터 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 상품 페이지 동적 UI 생성
const generateProductsPageUI = async () => {
  try {
    const response = await bffService.generateDynamicUI('products', userId.value)

    if (response.success) {
      uiComponents.value = response.components
    }
  } catch (error) {
    console.error('상품 페이지 UI 생성 실패:', error)
  }
}

// 카테고리 데이터 로드
const loadCategories = async () => {
  try {
    const response = await bffService.getInsuranceCategories()

    if (response.success) {
      // '전체' 카테고리 추가
      categories.value = [
        {
          id: 'all',
          name: '전체상품',
          description: '모든 보험 상품',
          icon_url: '',
          sort_order: 0,
          is_active: true,
          created_at: new Date().toString(),
        },
        ...response.data,
      ]
    }
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

// 상품 데이터 로드
const loadProducts = async () => {
  try {
    const categoryId = selectedCategory.value === 'all' ? undefined : selectedCategory.value
    const response = await bffService.getInsuranceProducts(categoryId)

    if (response.success) {
      products.value = response.data
    }
  } catch (error) {
    console.error('상품 로드 실패:', error)
  }
}

// 필터 업데이트
const updateFilters = () => {
  let filtered = [...products.value]

  // 카테고리 필터
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((product) => product.category_id === selectedCategory.value)
  }

  // 검색어 필터
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.features?.some((feature) => feature.toLowerCase().includes(query)),
    )
  }

  filteredProducts.value = filtered
}

// 카테고리 변경
const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

// 상품 상세 페이지로 이동
const viewProductDetail = (productId: string) => {
  router.push(`/products/${productId}`)
}

// 상품 비교 기능
const compareProducts = (productIds: string[]) => {
  if (productIds.length > 1) {
    router.push({
      path: '/products/compare',
      query: { products: productIds.join(',') },
    })
  }
}

// 보험료 계산
const calculateInsurance = async () => {
  if (
    !calculatorForm.value.name ||
    !calculatorForm.value.age ||
    !calculatorForm.value.gender ||
    !calculatorForm.value.productType
  ) {
    return
  }

  calculationResult.value.loading = true
  calculationResult.value.show = false

  try {
    // Backend API를 통한 보험료 계산 (임시로 클라이언트에서 계산)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const basePrice = Math.floor(calculatorForm.value.age * 550)
    const genderFactor = calculatorForm.value.gender === 'male' ? 1.15 : 0.95
    let productFactor = 1

    switch (calculatorForm.value.productType) {
      case 'life':
        productFactor = 1.2
        calculationResult.value.recommendation = '안심 종합보험'
        calculationResult.value.coverage = 20000000
        break
      case 'health':
        productFactor = 1.3
        calculationResult.value.recommendation = '미래 암보험'
        calculationResult.value.coverage = 15000000
        break
      case 'car':
        productFactor = 0.9
        calculationResult.value.recommendation = '스마트 운전자보험'
        calculationResult.value.coverage = 10000000
        break
      default:
        productFactor = 1.0
        calculationResult.value.recommendation = '종합보험'
        calculationResult.value.coverage = 10000000
    }

    calculationResult.value.monthlyPrice = Math.floor(basePrice * genderFactor * productFactor)
    calculationResult.value.show = true
  } catch (error) {
    console.error('보험료 계산 실패:', error)
  } finally {
    calculationResult.value.loading = false
  }
}

// 계산 결과 초기화
const resetCalculator = () => {
  calculatorForm.value = {
    name: '',
    age: null as unknown as number,
    gender: '',
    productType: '',
  }
  calculationResult.value.show = false
}

// 상담 신청
const requestConsultation = (productId?: string) => {
  router.push({
    path: '/consultation',
    query: productId ? { product: productId } : {},
  })
}

// 청구 페이지로 이동
const goToClaim = () => {
  router.push('/claim')
}

// 인기 상품 필터
const popularProducts = computed(() => {
  return filteredProducts.value.filter((product) => product.is_popular).slice(0, 3)
})

// 카테고리별 상품 수
const getCategoryCount = (categoryId: string) => {
  if (categoryId === 'all') return products.value.length
  return products.value.filter((product) => product.category_id === categoryId).length
}

// 컴포넌트 스타일 클래스
const getComponentClass = (component: UIComponent) => {
  const baseClass = 'dynamic-component'
  const typeClass = `component-${component.type}`
  const styleClass = `style-${component.style}`

  return `${baseClass} ${typeClass} ${styleClass}`
}
</script>

<template>
  <main class="products-page">
    <div class="container">
      <!-- 페이지 헤더 -->
      <header class="page-header glass-panel">
        <h1>보험 상품</h1>
        <p>다양한 보험 상품을 비교하고 나에게 맞는 보험을 찾아보세요.</p>

        <!-- 검색 바 -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="상품명이나 키워드로 검색하세요..."
            class="search-input"
          />
          <button class="search-button">
            <i class="icon-search"></i>
          </button>
        </div>
      </header>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>보험 상품을 불러오고 있습니다...</p>
      </div>

      <!-- 메인 콘텐츠 -->
      <div v-else class="main-content">
        <!-- 동적 생성된 UI 컴포넌트들 -->
        <section v-if="uiComponents.length > 0" class="dynamic-ui-section">
          <div
            v-for="component in uiComponents"
            :key="component.id"
            :class="getComponentClass(component)"
          >
            <!-- Hero Section -->
            <template v-if="component.type === 'hero_section'">
              <div class="hero-dynamic glass-card">
                <h2>{{ component.title }}</h2>
                <p>{{ component.content }}</p>
              </div>
            </template>

            <!-- Notice -->
            <template v-else-if="component.type === 'notice'">
              <div :class="`notice notice-${component.style} glass-card`">
                <h4>{{ component.title }}</h4>
                <p>{{ component.content }}</p>
              </div>
            </template>

            <!-- Stats -->
            <template v-else-if="component.type === 'stats'">
              <div class="stats-dynamic glass-card">
                <h3>{{ component.title }}</h3>
                <div class="stats-grid">
                  <div v-for="(stat, index) in component.data.stats" :key="index" class="stat-item">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>

        <!-- 카테고리 필터 -->
        <section class="category-filter">
          <h2 class="sr-only">카테고리 선택</h2>
          <div class="category-tabs">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="['category-tab', { active: selectedCategory === category.id }]"
            >
              {{ category.name }}
              <span class="count">({{ getCategoryCount(category.id) }})</span>
            </button>
          </div>
        </section>

        <!-- 인기 상품 섹션 -->
        <section v-if="popularProducts.length > 0" class="popular-products">
          <h2 class="section-title">인기 상품</h2>
          <div class="products-grid popular">
            <div
              v-for="product in popularProducts"
              :key="product.id"
              class="product-card popular-card glass-card"
              @click="viewProductDetail(product.id)"
            >
              <div class="product-badge">인기</div>
              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div v-if="product.features?.length" class="features">
                <span
                  v-for="feature in product.features.slice(0, 2)"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
              <div class="product-price">월 {{ product.base_price?.toLocaleString() }}원부터</div>
              <div class="product-actions">
                <button class="btn-primary" @click.stop="viewProductDetail(product.id)">
                  자세히 보기
                </button>
                <button class="btn-secondary" @click.stop="requestConsultation(product.id)">
                  상담신청
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 상품 목록 -->
        <section class="products-section">
          <div class="section-header">
            <h2 class="section-title">
              {{
                selectedCategory === 'all'
                  ? '전체 상품'
                  : categories.find((c) => c.id === selectedCategory)?.name
              }}
            </h2>
            <div class="results-count">{{ filteredProducts.length }}개 상품</div>
          </div>

          <!-- 정렬 및 필터 옵션 -->
          <div class="filter-controls">
            <select class="sort-select">
              <option value="popular">인기순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="name">이름순</option>
            </select>
          </div>

          <!-- 상품 그리드 -->
          <div v-if="filteredProducts.length > 0" class="products-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="product-card card-neumorphic"
              @click="viewProductDetail(product.id)"
            >
              <div v-if="product.is_popular" class="product-badge">인기</div>
              <div v-if="product.is_new" class="product-badge new">신상품</div>

              <h3>{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>

              <div v-if="product.features?.length" class="features">
                <span
                  v-for="feature in product.features.slice(0, 3)"
                  :key="feature"
                  class="feature-tag"
                >
                  {{ feature }}
                </span>
              </div>

              <div class="product-price">
                <span v-if="product.base_price">
                  월 {{ product.base_price.toLocaleString() }}원부터
                </span>
                <span v-else>상담 후 결정</span>
              </div>

              <div class="product-actions">
                <button class="btn-primary" @click.stop="viewProductDetail(product.id)">
                  상세보기
                </button>
                <button class="btn-secondary" @click.stop="requestConsultation(product.id)">
                  상담신청
                </button>
              </div>
            </div>
          </div>

          <!-- 검색 결과 없음 -->
          <div v-else class="no-results glass-card">
            <div class="no-results-icon">🔍</div>
            <h3>검색 결과가 없습니다</h3>
            <p>다른 검색어나 카테고리를 시도해보세요.</p>
            <button
              class="btn-primary"
              @click="
                searchQuery = ''
                selectedCategory = 'all'
              "
            >
              전체 상품 보기
            </button>
          </div>
        </section>

        <!-- 보험료 계산기 -->
        <section class="calculator-section">
          <div class="calculator-card glass-card">
            <h2 class="section-title">보험료 간단 계산</h2>
            <p class="section-subtitle">기본 정보로 예상 보험료를 확인해보세요</p>

            <form @submit.prevent="calculateInsurance" class="calculator-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">이름</label>
                  <input
                    id="name"
                    v-model="calculatorForm.name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="age">나이</label>
                  <input
                    id="age"
                    v-model.number="calculatorForm.age"
                    type="number"
                    placeholder="나이"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="gender">성별</label>
                  <select id="gender" v-model="calculatorForm.gender" required>
                    <option value="">선택하세요</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="productType">보험 유형</label>
                  <select id="productType" v-model="calculatorForm.productType" required>
                    <option value="">선택하세요</option>
                    <option value="life">생명보험</option>
                    <option value="health">건강보험</option>
                    <option value="car">자동차보험</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                class="btn-primary calculate-btn"
                :disabled="calculationResult.loading"
              >
                <span v-if="calculationResult.loading">계산 중...</span>
                <span v-else>보험료 계산하기</span>
              </button>
            </form>

            <!-- 계산 결과 -->
            <div v-if="calculationResult.show" class="calculation-result">
              <h3>계산 결과</h3>
              <div class="result-details">
                <div class="result-item">
                  <label>예상 월 보험료</label>
                  <strong>{{ calculationResult.monthlyPrice.toLocaleString() }}원</strong>
                </div>
                <div class="result-item">
                  <label>보장 금액</label>
                  <strong>{{ (calculationResult.coverage / 10000).toFixed(0) }}만원</strong>
                </div>
                <div class="result-item">
                  <label>추천 상품</label>
                  <strong>{{ calculationResult.recommendation }}</strong>
                </div>
              </div>

              <div class="result-actions">
                <button class="btn-primary" @click="requestConsultation()">전문 상담 신청</button>
                <button class="btn-secondary" @click="resetCalculator">다시 계산</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 추가 서비스 -->
        <section class="additional-services">
          <h2 class="section-title">추가 서비스</h2>
          <div class="services-grid">
            <div class="service-card glass-card" @click="requestConsultation()">
              <div class="service-icon">💬</div>
              <h3>전문 상담</h3>
              <p>보험 전문가와 1:1 맞춤 상담을 받아보세요</p>
            </div>

            <div class="service-card glass-card" @click="goToClaim()">
              <div class="service-icon">📋</div>
              <h3>보험금 청구</h3>
              <p>간편하게 보험금 청구 신청을 해보세요</p>
            </div>

            <div class="service-card glass-card" @click="router.push('/faq')">
              <div class="service-icon">❓</div>
              <h3>자주 묻는 질문</h3>
              <p>궁금한 내용을 빠르게 확인해보세요</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.products-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  text-align: center;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.2), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.15), transparent 50%);
  z-index: -1;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-weight: 700;
}

.page-description {
  font-size: 1.2rem;
  color: var(--color-text);
}

.text-accent {
  color: var(--color-accent);
  font-weight: 600;
}

.section-header {
  margin-bottom: 2rem;
  text-align: center;
}

.section-header h2 {
  font-size: 2rem;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.section-header p {
  color: var(--color-text-light);
}

/* 계산기 섹션 */
.calculator-section {
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.calculator-container {
  position: relative;
  min-height: 300px;
}

.calculator-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-heading);
  font-size: 1rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

input[type='text'],
input[type='number'],
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface-soft);
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

/* 계산 결과 */
.calculation-result {
  max-width: 600px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease;
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-header h3 {
  font-size: 1.5rem;
  color: var(--color-heading);
}

.result-content {
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 500;
  color: var(--color-text-light);
}

.result-value {
  font-weight: 600;
  color: var(--color-heading);
}

.result-value.price {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.note {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  text-align: center;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* 로딩 인디케이터 */
.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  border-radius: var(--border-radius-lg);
}

.dark-mode .loading-indicator {
  background: rgba(31, 41, 55, 0.8);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-background-mute);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin-bottom: 1rem;
}

/* 상품 섹션 */
.products-section {
  margin-bottom: 3rem;
}

.category-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 2rem 0;
}

.category-tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-weight: 500;
  position: relative;
  transition: all 0.3s;
}

.category-tab:hover {
  color: var(--color-primary);
}

.category-tab.active {
  color: var(--color-primary);
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 30px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-full);
  animation: scaleWidth 0.3s var(--easing-standard);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.product-card {
  border-radius: var(--border-radius-lg);
  background-color: var(--color-surface);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid var(--color-border);
}

.product-card.highlighted {
  border: 1px solid var(--color-primary-light);
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.2);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  height: 120px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.product-tag {
  background-color: var(--color-primary-light);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.product-name {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.product-description {
  color: var(--color-text);
  margin-bottom: 1rem;
}

.product-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  flex-grow: 1;
}

.product-features li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
  color: var(--color-text-light);
}

.product-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
}

.product-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.product-actions a {
  flex: 1;
  text-align: center;
}

/* FAQ 섹션 */
.faq-section {
  padding: 2.5rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1.5rem;
}

.faq-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.faq-question h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.faq-answer {
  color: var(--color-text);
}

.faq-action {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* 버튼 스타일은 App.vue에 정의된 것을 사용 */
.secondary-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.secondary-button:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleWidth {
  from {
    width: 0;
  }
  to {
    width: 30px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .result-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .result-actions a,
  .result-actions button {
    width: 100%;
  }

  .product-actions {
    flex-direction: column;
  }
}
</style>
