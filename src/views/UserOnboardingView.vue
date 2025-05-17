<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 온보딩 단계
const steps = [
  { id: 'welcome', title: '환영합니다' },
  { id: 'basics', title: '기본정보' },
  { id: 'insurance', title: '보험정보' },
  { id: 'interests', title: '관심사항' },
  { id: 'complete', title: '완료' },
]
const currentStepIndex = ref(0)
const currentStep = computed(() => steps[currentStepIndex.value])

// 사용자 정보 폼
const userForm = reactive({
  // 기본정보
  name: '',
  gender: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',

  // 보험정보
  hasInsurance: null as boolean | null,
  insuranceTypes: [] as string[],
  insuranceBudget: '',
  familyMembers: [] as string[],
  healthStatus: '',

  // 관심사항
  productInterests: [] as string[],
  servicePreferences: [] as string[],
  communicationPreferences: [] as string[],
})

// 폼 유효성 검증
const validators = {
  basics: computed(() => {
    return (
      !!userForm.name &&
      !!userForm.gender &&
      !!userForm.birthDate &&
      !!userForm.email &&
      !!userForm.phone
    )
  }),
  insurance: computed(() => {
    return userForm.hasInsurance !== null
  }),
  interests: computed(() => {
    return userForm.productInterests.length > 0
  }),
}

// 온보딩 저장 상태
const isSubmitting = ref(false)
const submitted = ref(false)

// 다음 단계로 이동
const nextStep = () => {
  if (currentStepIndex.value < steps.length - 1) {
    // 현재 단계에 따른 유효성 검증
    if (currentStep.value.id === 'basics' && !validators.basics.value) {
      alert('기본 정보를 모두 입력해주세요.')
      return
    }

    if (currentStep.value.id === 'insurance' && !validators.insurance.value) {
      alert('보험 관련 정보를 입력해주세요.')
      return
    }

    if (currentStep.value.id === 'interests' && !validators.interests.value) {
      alert('최소 하나 이상의 관심사를 선택해주세요.')
      return
    }

    currentStepIndex.value++
    window.scrollTo(0, 0)
  }
}

// 이전 단계로 이동
const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    window.scrollTo(0, 0)
  }
}

// 온보딩 완료 및 정보 제출
const completeOnboarding = () => {
  isSubmitting.value = true

  // 실제 구현에서는 API 호출을 통해 서버에 데이터를 저장
  setTimeout(() => {
    // 로컬 스토리지에 사용자 정보 저장 (실제 앱에서는 서버에 저장)
    localStorage.setItem('userProfile', JSON.stringify(userForm))
    submitted.value = true
    isSubmitting.value = false

    // 완료 단계로 이동
    currentStepIndex.value = steps.length - 1
  }, 1500)
}

// 홈으로 이동
const goToHome = () => {
  router.push('/')
}

// 보험 유형 옵션
const insuranceTypeOptions = [
  { id: 'life', label: '생명보험' },
  { id: 'health', label: '건강보험' },
  { id: 'car', label: '자동차보험' },
  { id: 'fire', label: '화재보험' },
  { id: 'travel', label: '여행자보험' },
  { id: 'pension', label: '연금보험' },
  { id: 'cancer', label: '암보험' },
  { id: 'dental', label: '치과보험' },
  { id: 'accident', label: '상해보험' },
  { id: 'saving', label: '저축보험' },
]

// 가족 구성원 옵션
const familyMemberOptions = [
  { id: 'spouse', label: '배우자' },
  { id: 'children', label: '자녀' },
  { id: 'parents', label: '부모님' },
  { id: 'siblings', label: '형제자매' },
  { id: 'grandparents', label: '조부모' },
]

// 관심 상품 옵션
const productInterestOptions = [
  { id: 'retirement', label: '은퇴/연금 설계' },
  { id: 'healthCare', label: '건강 관리/의료' },
  { id: 'childEducation', label: '자녀 교육/양육' },
  { id: 'assetGrowth', label: '자산 증식' },
  { id: 'deathBenefit', label: '사망 보장' },
  { id: 'disabilityIncome', label: '장애/소득 보장' },
  { id: 'estateTransfer', label: '상속/증여' },
]

// 서비스 선호도 옵션
const servicePreferenceOptions = [
  { id: 'online', label: '온라인 서비스' },
  { id: 'mobileApp', label: '모바일 앱' },
  { id: 'consultant', label: '전문 상담사 상담' },
  { id: 'branch', label: '지점 방문' },
  { id: 'homeVisit', label: '방문 서비스' },
]

// 커뮤니케이션 선호도 옵션
const communicationPreferenceOptions = [
  { id: 'email', label: '이메일' },
  { id: 'sms', label: 'SMS/문자' },
  { id: 'phone', label: '전화' },
  { id: 'app', label: '앱 알림' },
  { id: 'mail', label: '우편' },
]

// 진행 상태 계산
const progress = computed(() => {
  if (currentStepIndex.value === 0) return 0
  if (currentStepIndex.value === steps.length - 1) return 100
  return Math.round((currentStepIndex.value / (steps.length - 2)) * 100)
})
</script>

<template>
  <div class="onboarding-view">
    <!-- 헤더 및 진행 상태 -->
    <div class="onboarding-header glass-panel">
      <h1 class="page-title" v-if="currentStep.id !== 'complete'">
        SecureLife <span class="text-gradient">시작하기</span>
      </h1>
      <h1 class="page-title" v-else>
        <span class="text-gradient">환영합니다!</span>
      </h1>

      <div
        v-if="currentStep.id !== 'welcome' && currentStep.id !== 'complete'"
        class="progress-bar-container"
      >
        <div class="progress-bar">
          <div class="progress-indicator" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="progress-text">{{ progress }}% 완료</div>
      </div>
    </div>

    <!-- 단계 표시 -->
    <div
      v-if="currentStep.id !== 'welcome' && currentStep.id !== 'complete'"
      class="step-indicators card-neumorphic"
    >
      <div
        v-for="(step, index) in steps.slice(1, -1)"
        :key="step.id"
        :class="[
          'step',
          { active: index + 1 === currentStepIndex },
          { completed: index + 1 < currentStepIndex },
        ]"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-text">{{ step.title }}</div>
      </div>
    </div>

    <!-- 온보딩 컨텐츠 -->
    <div class="onboarding-content card-neumorphic">
      <!-- 1. 환영 단계 -->
      <div v-if="currentStep.id === 'welcome'" class="step-content welcome-step">
        <h2>SecureLife와 함께 안전한 미래를 준비하세요</h2>
        <p>
          개인 맞춤형 보험 서비스를 이용하기 위해 간단한 정보 입력이 필요합니다. 입력하신 정보를
          바탕으로 최적의 보험 상품과 서비스를 추천해 드립니다.
        </p>

        <div class="welcome-features">
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h3>정보 보호</h3>
            <p>모든 정보는 안전하게 암호화되어 보호됩니다.</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <h3>맞춤형 서비스</h3>
            <p>개인 정보를 기반으로 딱 맞는 보험 상품을 추천해 드립니다.</p>
          </div>

          <div class="feature-item">
            <div class="feature-icon">⏱️</div>
            <h3>소요 시간</h3>
            <p>약 3분 정도의 시간이 소요됩니다.</p>
          </div>
        </div>

        <div class="step-actions">
          <button @click="nextStep" class="button-3d">시작하기</button>
        </div>
      </div>

      <!-- 2. 기본 정보 단계 -->
      <div v-if="currentStep.id === 'basics'" class="step-content">
        <h2>기본 정보를 입력해주세요</h2>
        <p>고객님의 기본 정보를 입력해 주세요. 모든 필드는 필수입니다.</p>

        <div class="form-group">
          <label for="name">이름</label>
          <input
            type="text"
            id="name"
            v-model="userForm.name"
            placeholder="이름을 입력하세요"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="gender">성별</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="userForm.gender" value="male" />
                <span>남성</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="userForm.gender" value="female" />
                <span>여성</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label for="birthDate">생년월일</label>
            <input type="date" id="birthDate" v-model="userForm.birthDate" required />
          </div>
        </div>

        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="userForm.email"
            placeholder="example@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="phone">연락처</label>
          <input
            type="tel"
            id="phone"
            v-model="userForm.phone"
            placeholder="01012345678"
            pattern="[0-9]{10,11}"
            required
          />
        </div>

        <div class="form-group">
          <label for="address">주소</label>
          <input
            type="text"
            id="address"
            v-model="userForm.address"
            placeholder="주소를 입력하세요"
          />
        </div>

        <div class="step-actions">
          <button @click="prevStep" class="secondary-button">이전</button>
          <button @click="nextStep" class="button-3d">다음</button>
        </div>
      </div>

      <!-- 3. 보험 정보 단계 -->
      <div v-if="currentStep.id === 'insurance'" class="step-content">
        <h2>보험 관련 정보를 알려주세요</h2>
        <p>고객님께 적합한 보험 상품을 추천하기 위한 정보입니다.</p>

        <div class="form-group">
          <label>현재 가입하신 보험이 있으신가요?</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="userForm.hasInsurance" :value="true" />
              <span>예</span>
            </label>
            <label class="radio-label">
              <input type="radio" v-model="userForm.hasInsurance" :value="false" />
              <span>아니오</span>
            </label>
          </div>
        </div>

        <div v-if="userForm.hasInsurance" class="form-group">
          <label>어떤 종류의 보험에 가입되어 있나요? (복수 선택 가능)</label>
          <div class="checkbox-grid">
            <label v-for="option in insuranceTypeOptions" :key="option.id" class="checkbox-label">
              <input type="checkbox" v-model="userForm.insuranceTypes" :value="option.id" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="insuranceBudget">월 보험료로 지출 가능한 금액은 얼마인가요?</label>
          <select id="insuranceBudget" v-model="userForm.insuranceBudget">
            <option value="" disabled selected>선택하세요</option>
            <option value="under50000">5만원 미만</option>
            <option value="50000to100000">5만원 ~ 10만원</option>
            <option value="100000to200000">10만원 ~ 20만원</option>
            <option value="200000to300000">20만원 ~ 30만원</option>
            <option value="over300000">30만원 이상</option>
          </select>
        </div>

        <div class="form-group">
          <label>함께 보장받고 싶은 가족 구성원이 있나요? (복수 선택 가능)</label>
          <div class="checkbox-grid">
            <label v-for="option in familyMemberOptions" :key="option.id" class="checkbox-label">
              <input type="checkbox" v-model="userForm.familyMembers" :value="option.id" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="healthStatus">본인의 건강 상태는 어떻게 되나요?</label>
          <select id="healthStatus" v-model="userForm.healthStatus">
            <option value="" disabled selected>선택하세요</option>
            <option value="veryGood">매우 건강함</option>
            <option value="good">건강한 편임</option>
            <option value="neutral">보통</option>
            <option value="concerning">건강에 약간 이상이 있음</option>
            <option value="chronicDisease">만성질환 있음</option>
          </select>
        </div>

        <div class="step-actions">
          <button @click="prevStep" class="secondary-button">이전</button>
          <button @click="nextStep" class="button-3d">다음</button>
        </div>
      </div>

      <!-- 4. 관심사항 단계 -->
      <div v-if="currentStep.id === 'interests'" class="step-content">
        <h2>관심사를 알려주세요</h2>
        <p>
          고객님의 관심사에 맞는 보험 상품과 서비스를 추천해 드립니다. 최소 하나 이상 선택해주세요.
        </p>

        <div class="form-group">
          <label>관심있는 보험 상품 분야는 무엇인가요? (복수 선택 가능)</label>
          <div class="checkbox-grid">
            <label v-for="option in productInterestOptions" :key="option.id" class="checkbox-label">
              <input type="checkbox" v-model="userForm.productInterests" :value="option.id" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>선호하는 서비스 방식은 무엇인가요? (복수 선택 가능)</label>
          <div class="checkbox-grid">
            <label
              v-for="option in servicePreferenceOptions"
              :key="option.id"
              class="checkbox-label"
            >
              <input type="checkbox" v-model="userForm.servicePreferences" :value="option.id" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>선호하는 안내 방식은 무엇인가요? (복수 선택 가능)</label>
          <div class="checkbox-grid">
            <label
              v-for="option in communicationPreferenceOptions"
              :key="option.id"
              class="checkbox-label"
            >
              <input
                type="checkbox"
                v-model="userForm.communicationPreferences"
                :value="option.id"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <div class="step-actions">
          <button @click="prevStep" class="secondary-button">이전</button>
          <button @click="completeOnboarding" class="button-3d" :disabled="isSubmitting">
            <span v-if="isSubmitting">제출 중...</span>
            <span v-else>완료</span>
          </button>
        </div>
      </div>

      <!-- 5. 완료 단계 -->
      <div v-if="currentStep.id === 'complete'" class="step-content completion-step">
        <div class="completion-icon">✓</div>
        <h2>등록이 완료되었습니다!</h2>
        <p>
          SecureLife와 함께해 주셔서 감사합니다. 입력하신 정보를 바탕으로 맞춤형 보험 서비스를
          제공해 드리겠습니다. 홈 페이지에서 다양한 보험 상품을 확인해보세요.
        </p>

        <div class="personalized-message">
          <h3>{{ userForm.name }}님을 위한 맞춤 보험 추천</h3>
          <p>
            입력하신 정보를 분석한 결과,
            <strong>{{
              productInterestOptions.find((p) => p.id === userForm.productInterests[0])?.label
            }}</strong>
            관련 보험 상품이 가장 적합할 것으로 판단됩니다. 자세한 내용은 홈 화면에서 확인하실 수
            있습니다.
          </p>
        </div>

        <div class="step-actions centered">
          <button @click="goToHome" class="button-3d">홈으로 가기</button>
        </div>
      </div>
    </div>

    <!-- 하단 정보 보호 안내 -->
    <div v-if="currentStep.id !== 'complete'" class="footer-info glass-card">
      <div class="info-icon">🔒</div>
      <div class="info-text">
        <h3>개인정보 보호 안내</h3>
        <p>
          입력하신 모든 정보는 안전하게 보호되며, 동의하신 목적 이외의 용도로는 사용되지 않습니다.
          자세한 내용은 <RouterLink to="/privacy">개인정보처리방침</RouterLink>을 확인해주세요.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-view {
  max-width: 900px;
  margin: 0 auto;
}

.onboarding-header {
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: var(--border-radius-lg);
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-weight: 700;
}

.text-gradient {
  background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.progress-bar-container {
  max-width: 400px;
  margin: 0 auto;
}

.progress-bar {
  height: 8px;
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-indicator {
  height: 100%;
  background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
  border-radius: var(--border-radius-full);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-light);
  text-align: right;
}

/* 단계 인디케이터 */
.step-indicators {
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: var(--color-border);
  z-index: 0;
}

.step.active:not(:last-child)::after,
.step.completed:not(:last-child)::after {
  background-color: var(--color-primary);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  color: var(--color-text-light);
}

.step.active .step-number {
  background-color: var(--color-primary);
  color: white;
}

.step.completed .step-number {
  background-color: var(--color-success);
  color: white;
}

.step-text {
  font-size: 0.9rem;
  color: var(--color-text-light);
  text-align: center;
}

.step.active .step-text {
  font-weight: 600;
  color: var(--color-primary);
}

.step.completed .step-text {
  color: var(--color-success);
}

/* 온보딩 컨텐츠 */
.onboarding-content {
  padding: 2.5rem;
  margin-bottom: 2rem;
}

.step-content {
  max-width: 700px;
  margin: 0 auto;
}

.step-content h2 {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.step-content > p {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-heading);
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='date'],
select,
textarea {
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
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.radio-group,
.checkbox-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.radio-label,
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input,
.checkbox-label input {
  margin-right: 0.5rem;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

/* 환영 단계 */
.welcome-step {
  text-align: center;
}

.welcome-features {
  display: flex;
  justify-content: space-between;
  margin: 3rem 0;
  gap: 2rem;
}

.feature-item {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--color-surface-soft);
  border-radius: var(--border-radius-md);
  text-align: center;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-item h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.feature-item p {
  color: var(--color-text-light);
  font-size: 0.95rem;
}

/* 완료 단계 */
.completion-step {
  text-align: center;
  padding: 2rem 0;
}

.completion-icon {
  width: 100px;
  height: 100px;
  background-color: var(--color-success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 2rem;
}

.personalized-message {
  margin: 2.5rem 0;
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
}

.personalized-message h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

/* 버튼 스타일 */
.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2.5rem;
  gap: 1rem;
}

.step-actions.centered {
  justify-content: center;
}

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

.button-3d {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow:
    0 4px 6px rgba(50, 50, 93, 0.11),
    0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all var(--transition-normal);
  transform: translateY(0);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.button-3d:hover {
  transform: translateY(-2px);
  box-shadow:
    0 7px 14px rgba(50, 50, 93, 0.1),
    0 3px 6px rgba(0, 0, 0, 0.08);
}

.button-3d:active {
  transform: translateY(1px);
}

.button-3d:disabled {
  background-color: var(--color-background-mute);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 푸터 정보 */
.footer-info {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.info-icon {
  font-size: 1.8rem;
}

.info-text h3 {
  font-size: 1.1rem;
  color: var(--color-heading);
  margin-bottom: 0.25rem;
}

.info-text p {
  font-size: 0.95rem;
  color: var(--color-text-light);
  margin: 0;
}

.info-text a {
  color: var(--color-primary);
  text-decoration: none;
}

.info-text a:hover {
  text-decoration: underline;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .welcome-features {
    flex-direction: column;
  }

  .step-text {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .step-actions {
    flex-direction: column;
  }

  .step-actions button {
    width: 100%;
  }

  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .footer-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
