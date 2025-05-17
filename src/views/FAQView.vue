<script setup lang="ts">
import { ref } from 'vue'

// FAQ 카테고리
const categories = [
  { id: 'general', name: '일반' },
  { id: 'product', name: '상품' },
  { id: 'claim', name: '보험금 청구' },
  { id: 'payment', name: '납입/갱신' },
  { id: 'account', name: '계정' },
]

// 현재 선택된 카테고리
const selectedCategory = ref('general')

// FAQ 데이터
const faqs = [
  {
    id: 'faq-1',
    category: 'general',
    question: '보험료 납입 방법에는 어떤 것들이 있나요?',
    answer:
      '보험료 납입은 자동이체, 신용카드 납부, 모바일 간편결제 등의 방법이 있습니다. 가입 시 선택하신 납입 방법은 마이페이지에서 확인 및 변경하실 수 있습니다.',
  },
  {
    id: 'faq-2',
    category: 'general',
    question: '보험료 납입 주기는 어떻게 되나요?',
    answer:
      '보험료 납입 주기는 일시납, 월납, 3개월납, 6개월납, 연납 중 선택 가능합니다. 일부 상품은 납입 주기가 제한될 수 있으니 상품 안내를 참고해 주세요.',
  },
  {
    id: 'faq-3',
    category: 'general',
    question: '보장 내용을 중간에 변경할 수 있나요?',
    answer:
      '일부 보험 상품의 경우 보험 계약 후에도 특약 추가/삭제, 보험금액 증액/감액 등의 변경이 가능합니다. 다만, 변경 가능 여부는 상품별로 다르니 고객센터(1588-1234)로 문의해 주세요.',
  },
  {
    id: 'faq-4',
    category: 'product',
    question: '갱신형과 비갱신형의 차이는 무엇인가요?',
    answer:
      '갱신형은 일정 기간마다 보험료가 재산정되어 일반적으로 나이가 많아질수록 보험료가 증가합니다. 비갱신형은 보험기간 동안 보험료가 변동되지 않습니다. 갱신형은 초기 보험료가 저렴하지만 장기적으로는 비갱신형보다 총 납입 보험료가 많아질 수 있습니다.',
  },
  {
    id: 'faq-5',
    category: 'product',
    question: '실손의료보험은 어떤 상품인가요?',
    answer:
      '실손의료보험은 의료비 중 본인 부담금을 보장해주는 상품으로, 국민건강보험이 보장하지 못하는 본인 부담 의료비를 보장받을 수 있습니다. 입원비, 통원비, 약제비 등을 실제 발생한 금액 내에서 보장하며, 매년 갱신을 통해 보험료가 조정됩니다.',
  },
  {
    id: 'faq-6',
    category: 'product',
    question: '종신보험과 정기보험의 차이점은 무엇인가요?',
    answer:
      '종신보험은 사망 시까지 평생 보장되는 상품으로, 사망보험금과 함께 만기 시 환급금이 발생할 수 있습니다. 정기보험은 특정 기간 동안만 보장되며 만기 시 환급금이 없어 종신보험보다 보험료가 저렴합니다.',
  },
  {
    id: 'faq-7',
    category: 'product',
    question: '어린이보험은 어떤 보장을 받을 수 있나요?',
    answer:
      '어린이보험은 성장기 어린이의 특성을 반영하여 각종 상해, 질병 진단금, 입원비, 수술비 등을 보장합니다. 또한 성인이 된 후 발생할 수 있는 질병까지도 보장하여 자녀의 미래를 준비할 수 있습니다.',
  },
  {
    id: 'faq-8',
    category: 'claim',
    question: '보험금 청구는 어떻게 하나요?',
    answer:
      '보험금 청구는 웹사이트, 모바일 앱, 고객센터를 통해 가능합니다. 홈페이지 마이페이지에서 [보험금 청구]를 클릭하거나, 고객센터(1588-1234)로 문의하시면 자세한 안내를 받으실 수 있습니다.',
  },
  {
    id: 'faq-9',
    category: 'claim',
    question: '보험금 청구 시 필요한 서류는 무엇인가요?',
    answer:
      '기본적으로 보험금 청구서, 신분증 사본, 통장 사본이 필요하며, 청구 유형에 따라 진단서, 입퇴원확인서, 진료비영수증, 수술확인서 등의 서류가 추가로 필요합니다. 청구 내용에 따라 필요 서류가 다를 수 있으니 자세한 사항은 고객센터로 문의해 주세요.',
  },
  {
    id: 'faq-10',
    category: 'claim',
    question: '보험금 지급까지 얼마나 걸리나요?',
    answer:
      '보험금은 청구서류 접수일로부터 3영업일 이내에 지급됩니다. 다만, 보험사고의 조사나 확인이 필요한 경우 최대 30영업일이 소요될 수 있습니다. 지급 지연 시에는 지연이자를 더하여 지급해 드립니다.',
  },
  {
    id: 'faq-11',
    category: 'payment',
    question: '보험료를 납입하지 못하면 어떻게 되나요?',
    answer:
      '납입기일 다음날부터 30일(납입최고기간)까지 유예기간이 있으며, 이 기간 동안 보험료를 납입하지 않으면 계약이 해지됩니다. 다만, 해지된 계약도 일정 기간 내 부활(효력회복)이 가능합니다.',
  },
  {
    id: 'faq-12',
    category: 'payment',
    question: '자동이체 계좌를 변경하고 싶어요.',
    answer:
      '자동이체 계좌 변경은 마이페이지 > 계약정보 > 보험료 납입 관리에서 변경 가능합니다. 또는 고객센터(1588-1234)로 문의하시면 변경 절차를 안내해드립니다.',
  },
  {
    id: 'faq-13',
    category: 'payment',
    question: '보험료 납입면제란 무엇인가요?',
    answer:
      '납입면제는 계약자가 특정 조건(장해상태 발생, 특정 질병 진단 등)에 해당될 경우 이후 보험료 납입이 면제되는 혜택입니다. 납입면제 조건은 상품별로 상이하니 약관을 확인해 주세요.',
  },
  {
    id: 'faq-14',
    category: 'account',
    question: '회원 정보를 변경하고 싶어요.',
    answer:
      '회원 정보 변경은 마이페이지 > 개인정보에서 가능합니다. 이메일, 전화번호, 주소 등을 변경하실 수 있으며, 보안을 위해 중요 정보 변경 시에는 본인 인증이 필요합니다.',
  },
  {
    id: 'faq-15',
    category: 'account',
    question: '아이디/비밀번호를 잊어버렸어요.',
    answer:
      '로그인 페이지에서 [아이디/비밀번호 찾기]를 통해 확인 가능합니다. 아이디는 가입 시 등록한 이메일로 발송되며, 비밀번호는 본인 인증 후 재설정할 수 있습니다.',
  },
  {
    id: 'faq-16',
    category: 'account',
    question: '회원 탈퇴는 어떻게 하나요?',
    answer:
      '마이페이지 > 설정 > 회원 탈퇴에서 가능합니다. 단, 보험 계약이 있는 경우 모든 계약 해지 후에 탈퇴할 수 있으며, 탈퇴 시 개인정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.',
  },
]

// 현재 카테고리에 맞는 FAQ만 필터링
const filteredFaqs = ref(faqs.filter((faq) => faq.category === selectedCategory.value))

// 카테고리 변경 시 필터링 업데이트
const changeCategory = (category: string) => {
  selectedCategory.value = category
  filteredFaqs.value = faqs.filter((faq) => faq.category === category)
}

// 아코디언 상태 관리
const openedFaq = ref('')

const toggleFaq = (faqId: string) => {
  if (openedFaq.value === faqId) {
    openedFaq.value = ''
  } else {
    openedFaq.value = faqId
  }
}

// 검색 기능
const searchQuery = ref('')
const searchResults = ref<typeof faqs>([])

const searchFaqs = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = faqs.filter(
    (faq) => faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
  )
}
</script>

<template>
  <div class="faq-view">
    <div class="page-header glass-panel">
      <div class="header-content">
        <h1 class="page-title">자주 묻는 질문</h1>
        <p class="page-description">
          고객님들께서 자주 문의하시는 내용에 대한 답변을 모았습니다. 원하시는 내용을 검색하거나
          카테고리별로 찾아보세요.
        </p>
      </div>
    </div>

    <!-- 검색 영역 -->
    <div class="search-section card-neumorphic">
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="궁금한 내용을 검색해보세요"
          @input="searchFaqs"
          class="search-input"
        />
        <button class="search-button" @click="searchFaqs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- 검색 결과 -->
    <div v-if="searchResults.length > 0" class="search-results card-neumorphic">
      <div class="search-results-header">
        <h2>검색 결과 ({{ searchResults.length }})</h2>
        <button
          class="clear-search"
          @click="
            () => {
              searchQuery = ''
              searchResults = []
            }
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          검색결과 닫기
        </button>
      </div>

      <div class="faq-accordion">
        <div v-for="faq in searchResults" :key="faq.id" class="faq-item">
          <div
            class="faq-question"
            :class="{ active: openedFaq === faq.id }"
            @click="toggleFaq(faq.id)"
          >
            <div class="question-content">
              <div class="category-tag">
                {{ categories.find((c) => c.id === faq.category)?.name }}
              </div>
              <h3>{{ faq.question }}</h3>
            </div>
            <div class="question-icon">
              <div v-if="openedFaq === faq.id">−</div>
              <div v-else>+</div>
            </div>
          </div>
          <div class="faq-answer" :class="{ active: openedFaq === faq.id }">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 카테고리 및 FAQ 목록 -->
    <div v-if="searchResults.length === 0" class="faq-content">
      <div class="category-navigation">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="changeCategory(category.id)"
          :class="['category-button', { active: selectedCategory === category.id }]"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="faq-accordion">
        <div v-for="faq in filteredFaqs" :key="faq.id" class="faq-item">
          <div
            class="faq-question"
            :class="{ active: openedFaq === faq.id }"
            @click="toggleFaq(faq.id)"
          >
            <div class="question-content">
              <h3>{{ faq.question }}</h3>
            </div>
            <div class="question-icon">
              <div v-if="openedFaq === faq.id">−</div>
              <div v-else>+</div>
            </div>
          </div>
          <div class="faq-answer" :class="{ active: openedFaq === faq.id }">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 추가 문의 섹션 -->
    <div class="contact-section glass-card">
      <h2>원하는 답변을 찾지 못하셨나요?</h2>
      <p>
        찾으시는 답변이 없거나 추가 문의사항이 있으시면 고객센터로 연락해 주세요. 전문 상담사가
        친절하게 안내해 드립니다.
      </p>
      <div class="contact-methods">
        <div class="contact-method">
          <div class="contact-icon">📞</div>
          <div class="contact-info">
            <h3>고객센터</h3>
            <p>1588-1234</p>
            <p>평일 09:00-18:00</p>
          </div>
        </div>

        <div class="contact-method">
          <div class="contact-icon">💬</div>
          <div class="contact-info">
            <h3>채팅상담</h3>
            <p>24시간 이용 가능한 AI 채팅</p>
            <RouterLink to="/consultation" class="button-3d">상담하기</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-view {
  max-width: 900px;
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
    radial-gradient(circle at 70% 30%, rgba(79, 70, 229, 0.15), transparent 50%),
    radial-gradient(circle at 30% 70%, rgba(6, 182, 212, 0.1), transparent 50%);
  z-index: -1;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-weight: 700;
}

.page-description {
  font-size: 1.1rem;
  color: var(--color-text);
  max-width: 700px;
  margin: 0 auto;
}

/* 검색 섹션 */
.search-section {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface-soft);
  color: var(--color-text);
  font-size: 1.1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.search-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  transition: color 0.3s;
}

.search-button:hover {
  color: var(--color-primary);
}

/* 검색 결과 */
.search-results {
  padding: 2rem;
  margin-bottom: 2rem;
}

.search-results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-results-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.clear-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;
}

.clear-search:hover {
  color: var(--color-primary);
}

.category-tag {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary-light);
  color: white;
  border-radius: var(--border-radius-full);
  margin-right: 0.5rem;
}

/* 카테고리 네비게이션 */
.category-navigation {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: var(--shadow-sm);
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-button.active {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
}

/* FAQ 아코디언 */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: var(--color-surface);
  transition: all 0.3s;
}

.faq-item:hover {
  box-shadow: var(--shadow-md);
}

.faq-question {
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.faq-question.active {
  background-color: var(--color-primary);
  color: white;
}

.question-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.question-content h3 {
  margin: 0;
  font-size: 1.1rem;
}

.question-icon {
  font-size: 1.5rem;
  font-weight: 200;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0, 1, 0, 1);
}

.faq-answer.active {
  max-height: 1000px;
  transition: all 0.5s cubic-bezier(1, 0, 1, 0);
}

.faq-answer p {
  margin: 0;
  padding: 1.5rem;
  color: var(--color-text);
  background-color: var(--color-surface-soft);
  border-top: 1px solid var(--color-border);
  line-height: 1.6;
}

/* 문의 섹션 */
.contact-section {
  padding: 2.5rem;
  text-align: center;
  margin: 3rem 0;
}

.contact-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.contact-section > p {
  max-width: 600px;
  margin: 0 auto 2rem;
  color: var(--color-text);
}

.contact-methods {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.contact-method {
  display: flex;
  align-items: center;
  text-align: left;
}

.contact-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-background-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 1.5rem;
  box-shadow: var(--shadow-md);
}

.contact-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.contact-info p {
  margin: 0 0 0.5rem;
  color: var(--color-text-light);
}

.button-3d {
  margin-top: 0.5rem;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .contact-methods {
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }

  .category-button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
