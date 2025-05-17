<script setup lang="ts">
import { ref, computed } from 'vue'

// 상품 카테고리
const categories = [
  { id: 'all', name: '전체상품' },
  { id: 'life', name: '생명보험' },
  { id: 'health', name: '건강보험' },
  { id: 'car', name: '자동차보험' },
  { id: 'property', name: '재물보험' },
]

const selectedCategory = ref('all')

// 보험 상품 데이터
const products = [
  {
    id: 'life-1',
    category: 'life',
    name: '안심 종합보험',
    description: '사망/상해 종합 보장으로 가족의 행복을 지킵니다',
    features: [
      '사망보험금 최대 3억원',
      '각종 재해사고 의료비 보장',
      '중대질병 진단금 보장',
      '저렴한 보험료와 다양한 특약',
    ],
    price: '월 45,000원부터',
    image: '🛡️',
    highlight: true,
    tags: ['인기상품', '가족보험'],
  },
  {
    id: 'health-1',
    category: 'health',
    name: '미래 암보험',
    description: '국내 사망원인 1위, 암에 대한 강력한 보장플랜',
    features: [
      '암 진단시 최대 1억원 지급',
      '암 수술비/입원비 보장',
      '항암치료비 추가 보장',
      '특약으로 3대 질병까지 보장 가능',
    ],
    price: '월 35,000원부터',
    image: '🏥',
    highlight: true,
    tags: ['베스트셀러', '프리미엄'],
  },
  {
    id: 'car-1',
    category: 'car',
    name: '스마트 운전자보험',
    description: '교통사고 발생 시 경제적 부담을 줄여줍니다',
    features: [
      '자동차 사고 부상 치료비 지원',
      '벌금, 변호사 선임비용 보장',
      '면허정지/취소 위로금 지급',
      '자동차 시장가액의 손해액 보장',
    ],
    price: '월 25,000원부터',
    image: '🚗',
    highlight: false,
    tags: ['신상품'],
  },
  {
    id: 'life-2',
    category: 'life',
    name: '어린이 종합보험',
    description: '우리 아이의 미래를 위한 종합 보장 플랜',
    features: [
      '성장기 안전사고 보장',
      '입원/통원 의료비 보장',
      '학업 중단 시 교육비 지원',
      '만기 시 학자금 지원 옵션',
    ],
    price: '월 30,000원부터',
    image: '👶',
    highlight: false,
    tags: ['어린이', '교육보험'],
  },
  {
    id: 'health-2',
    category: 'health',
    name: '실버 케어보험',
    description: '노후 건강을 책임지는 시니어 특화 건강보험',
    features: [
      '노인성 질환 진단비 보장',
      '간병비용 지급',
      '입원일당 및 수술비 보장',
      '장기요양 서비스 연계',
    ],
    price: '월 55,000원부터',
    image: '👵',
    highlight: false,
    tags: ['시니어', '간병보장'],
  },
  {
    id: 'property-1',
    category: 'property',
    name: '주택 화재보험',
    description: '소중한 내 집을 위한 안전 보장 솔루션',
    features: [
      '화재로 인한 건물/가재도구 손해 보상',
      '도난 및 침수 피해 보상',
      '일상생활 배상책임 보장',
      '임시 거주비용 지원',
    ],
    price: '월 15,000원부터',
    image: '🏠',
    highlight: false,
    tags: ['주택', '화재보험'],
  },
  {
    id: 'car-2',
    category: 'car',
    name: '프리미엄 자동차보험',
    description: '더 넓은 보장범위로 운전의 품격을 높이세요',
    features: [
      '무제한 대인/대물 배상 책임',
      '자기신체사고 최대 1억원 보장',
      '고급 렌트카 지원 서비스',
      '24시간 긴급출동 서비스',
    ],
    price: '월 80,000원부터',
    image: '🚙',
    highlight: true,
    tags: ['프리미엄', '무제한보장'],
  },
  {
    id: 'health-3',
    category: 'health',
    name: '단기 여행자보험',
    description: '여행 중 발생할 수 있는 위험에 대비하세요',
    features: [
      '해외 의료비 실비 보장',
      '여행 취소/지연에 따른 보상',
      '수하물 분실/파손 보상',
      '24시간 해외 의료 지원 서비스',
    ],
    price: '1일 3,000원부터',
    image: '✈️',
    highlight: false,
    tags: ['여행', '단기보험'],
  },
]

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

// 선택된 카테고리에 따른 상품 필터링
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products
  }
  return products.filter((product) => product.category === selectedCategory.value)
})

// 보험료 계산
const calculateInsurance = () => {
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

  // 계산 시뮬레이션 (실제로는 API 호출)
  setTimeout(() => {
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
        calculationResult.value.coverage = 30000000
        break
      case 'car':
        productFactor = 0.95
        calculationResult.value.recommendation = '스마트 운전자보험'
        calculationResult.value.coverage = 15000000
        break
      case 'property':
        productFactor = 0.8
        calculationResult.value.recommendation = '주택 화재보험'
        calculationResult.value.coverage = 10000000
        break
    }

    calculationResult.value.monthlyPrice =
      Math.round((basePrice * genderFactor * productFactor) / 100) * 100
    calculationResult.value.loading = false
    calculationResult.value.show = true
  }, 1500)
}

// 폼 초기화
const resetForm = () => {
  calculatorForm.value = {
    name: '',
    age: null as unknown as number,
    gender: '',
    productType: '',
  }
  calculationResult.value.show = false
}
</script>

<template>
  <div class="products-view">
    <div class="page-header glass-panel">
      <div class="header-content">
        <h1 class="page-title">보험상품</h1>
        <p class="page-description">
          고객님의 든든한 미래를 위한 <span class="text-accent">맞춤형 보험상품</span>을 찾아보세요.
        </p>
      </div>
    </div>

    <!-- 보험료 계산기 섹션 -->
    <section class="calculator-section card-neumorphic">
      <div class="section-header">
        <h2>보험료 계산기</h2>
        <p>간단한 정보 입력으로 예상 보험료를 확인해보세요</p>
      </div>

      <div class="calculator-container">
        <form
          @submit.prevent="calculateInsurance"
          class="calculator-form"
          v-if="!calculationResult.show"
        >
          <div class="form-row">
            <div class="form-group">
              <label for="name">이름</label>
              <input type="text" id="name" v-model="calculatorForm.name" required />
            </div>

            <div class="form-group">
              <label for="age">나이</label>
              <input
                type="number"
                id="age"
                v-model="calculatorForm.age"
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
                <option value="" disabled selected>선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            <div class="form-group">
              <label for="productType">희망 보험 종류</label>
              <select id="productType" v-model="calculatorForm.productType" required>
                <option value="" disabled selected>선택하세요</option>
                <option value="life">생명보험</option>
                <option value="health">건강보험</option>
                <option value="car">자동차보험</option>
                <option value="property">재물보험</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="button-3d">보험료 계산하기</button>
          </div>
        </form>

        <div class="calculation-result" v-if="calculationResult.show">
          <div class="result-header">
            <h3>{{ calculatorForm.name }}님의 예상 보험료</h3>
          </div>

          <div class="result-content">
            <div class="result-item">
              <div class="result-label">월 보험료</div>
              <div class="result-value price">
                {{ calculationResult.monthlyPrice.toLocaleString() }}원
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">보장금액</div>
              <div class="result-value">
                최대 {{ (calculationResult.coverage / 10000).toLocaleString() }}만원
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">추천상품</div>
              <div class="result-value">{{ calculationResult.recommendation }}</div>
            </div>
          </div>

          <p class="note">* 위 금액은 예상 금액으로, 정확한 보험료는 상담을 통해 확인해 주세요.</p>

          <div class="result-actions">
            <button @click="resetForm" class="secondary-button">다시 계산하기</button>
            <RouterLink to="/consultation" class="button-3d">상담 신청하기</RouterLink>
          </div>
        </div>

        <div class="loading-indicator" v-if="calculationResult.loading">
          <div class="spinner"></div>
          <p>보험료를 계산 중입니다...</p>
        </div>
      </div>
    </section>

    <!-- 보험상품 목록 섹션 -->
    <section class="products-section">
      <div class="section-header">
        <h2>보험상품 라인업</h2>
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="['category-tab', { active: selectedCategory === category.id }]"
          >
            {{ category.name }}
            <div class="tab-indicator" v-if="selectedCategory === category.id"></div>
          </button>
        </div>
      </div>

      <div class="products-grid">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          :class="{ highlighted: product.highlight }"
        >
          <div class="product-image">{{ product.image }}</div>
          <div class="product-content">
            <div class="product-tags">
              <span class="product-tag" v-for="tag in product.tags" :key="tag">{{ tag }}</span>
            </div>
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description }}</p>
            <ul class="product-features">
              <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
            </ul>
            <div class="product-price">{{ product.price }}</div>
            <div class="product-actions">
              <RouterLink :to="`/consultation?product=${product.id}`" class="secondary-button"
                >상담 신청</RouterLink
              >
              <RouterLink :to="`/products/${product.id}`" class="button-3d">자세히 보기</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ 섹션 -->
    <section class="faq-section glass-card">
      <div class="section-header">
        <h2>자주 묻는 질문</h2>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <div class="faq-question">
            <h3>보험상품 가입 시 유의사항이 있나요?</h3>
          </div>
          <div class="faq-answer">
            <p>
              보험가입 시에는 계약 전 알릴 의무가 있으며, 청약철회 기간은 보험증권을 받은 날로부터
              15일 이내입니다. 또한 보험료 납입 기간과 보장 내용을 꼼꼼히 확인하시기 바랍니다.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h3>보험료는 어떻게 결정되나요?</h3>
          </div>
          <div class="faq-answer">
            <p>
              보험료는 연령, 성별, 직업, 건강상태, 가입 금액 등에 따라 달라집니다. 정확한 보험료는
              상담사와 상담 후 결정됩니다.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <h3>보험금 청구는 어떻게 하나요?</h3>
          </div>
          <div class="faq-answer">
            <p>
              보험금 청구는 홈페이지, 모바일 앱, 고객센터 전화를 통해 가능합니다. 필요한 서류는
              진단서, 진료차트, 영수증 등이 있으며 청구 유형에 따라 다를 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div class="faq-action">
        <RouterLink to="/faq" class="secondary-button">더 많은 FAQ 보기</RouterLink>
      </div>
    </section>
  </div>
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
