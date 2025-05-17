<script setup lang="ts">
import { ref, reactive } from 'vue'

// 가상의 로그인 사용자 정보
const userInfo = reactive({
  name: '김보험',
  id: 'insurance_kim',
  email: 'kim@example.com',
  phone: '010-1234-5678',
  birthDate: '1985-05-15',
  address: '서울특별시 강남구 테헤란로 123',
  joinDate: '2022-09-15',
  lastLogin: '2023-05-10 14:30:22',
  profileImage: null,
})

// 계약 정보
const contracts = [
  {
    id: 'CL12345678',
    name: '안심 종합보험',
    startDate: '2022-10-01',
    endDate: '2032-10-01',
    status: 'active',
    premium: '45,000원/월',
    paymentDate: '매월 15일',
    insuredAmount: '3억원',
    insuranceType: '생명보험',
  },
  {
    id: 'CM98765432',
    name: '미래 암보험',
    startDate: '2023-03-15',
    endDate: '2033-03-15',
    status: 'active',
    premium: '35,000원/월',
    paymentDate: '매월 10일',
    insuredAmount: '1억원',
    insuranceType: '건강보험',
  },
  {
    id: 'CA45678901',
    name: '스마트 운전자보험',
    startDate: '2022-05-20',
    endDate: '2027-05-20',
    status: 'active',
    premium: '25,000원/월',
    paymentDate: '매월 25일',
    insuredAmount: '5000만원',
    insuranceType: '자동차보험',
  },
]

// 보험금 청구 내역
const claims = [
  {
    id: 'CL-123456',
    productName: '미래 암보험',
    claimDate: '2023-04-15',
    claimAmount: '5,000,000원',
    status: 'completed',
    processingDate: '2023-04-20',
    reason: '대장 내시경 검사',
    documents: ['진단서', '의료비 영수증', '검사 결과지'],
  },
  {
    id: 'CL-789012',
    productName: '스마트 운전자보험',
    claimDate: '2023-02-10',
    claimAmount: '1,200,000원',
    status: 'completed',
    processingDate: '2023-02-15',
    reason: '차량 접촉사고',
    documents: ['교통사고 사실확인원', '진단서', '치료비 영수증'],
  },
  {
    id: 'CL-345678',
    productName: '안심 종합보험',
    claimDate: '2023-05-01',
    claimAmount: '800,000원',
    status: 'processing',
    processingDate: null,
    reason: '부상 치료',
    documents: ['진단서', '치료비 영수증'],
  },
]

// 활동 내역
const activities = [
  {
    id: 'ACT-001',
    type: 'login',
    date: '2023-05-10 14:30:22',
    description: '로그인',
  },
  {
    id: 'ACT-002',
    type: 'contract_view',
    date: '2023-05-10 14:32:05',
    description: '계약정보 조회',
  },
  {
    id: 'ACT-003',
    type: 'claim_create',
    date: '2023-05-01 10:15:33',
    description: '보험금 청구 접수',
  },
  {
    id: 'ACT-004',
    type: 'payment',
    date: '2023-04-15 00:00:00',
    description: '미래 암보험 보험료 납입',
  },
  {
    id: 'ACT-005',
    type: 'profile_update',
    date: '2023-03-20 16:45:12',
    description: '연락처 정보 수정',
  },
]

// 현재 활성 탭
const activeTab = ref('info')

// 개인정보 수정 모드
const editMode = ref(false)
const editForm = reactive({ ...userInfo })

// 개인정보 저장
const saveProfile = () => {
  Object.assign(userInfo, editForm)
  editMode.value = false
}

// 로그아웃
const logout = () => {
  alert('로그아웃 되었습니다.')
  // 실제 구현에서는 인증 상태를 변경하고 홈으로 리디렉션
}
</script>

<template>
  <div class="mypage-view">
    <h1 class="page-title">마이페이지</h1>

    <!-- 사용자 요약 정보 -->
    <div class="user-summary card-neumorphic">
      <div class="profile-area">
        <div class="profile-image">
          <span>{{ userInfo.name.charAt(0) }}</span>
        </div>
        <div class="profile-info">
          <h2>{{ userInfo.name }}님</h2>
          <p>{{ userInfo.email }}</p>
          <p class="last-login">마지막 로그인: {{ userInfo.lastLogin }}</p>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-value">{{ contracts.length }}</div>
          <div class="summary-label">가입 상품</div>
        </div>

        <div class="summary-card">
          <div class="summary-value">{{ claims.length }}</div>
          <div class="summary-label">보험금 청구</div>
        </div>

        <div class="summary-card">
          <div class="summary-value">
            {{ claims.filter((claim) => claim.status === 'processing').length }}
          </div>
          <div class="summary-label">진행 중</div>
        </div>

        <div class="logout-button">
          <button @click="logout" class="secondary-button">로그아웃</button>
        </div>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="tab-navigation">
      <button @click="activeTab = 'info'" :class="['tab-button', { active: activeTab === 'info' }]">
        개인정보
      </button>
      <button
        @click="activeTab = 'contracts'"
        :class="['tab-button', { active: activeTab === 'contracts' }]"
      >
        계약정보
      </button>
      <button
        @click="activeTab = 'claims'"
        :class="['tab-button', { active: activeTab === 'claims' }]"
      >
        보험금 청구내역
      </button>
      <button
        @click="activeTab = 'activity'"
        :class="['tab-button', { active: activeTab === 'activity' }]"
      >
        활동내역
      </button>
    </div>

    <!-- 개인정보 탭 -->
    <div v-if="activeTab === 'info'" class="tab-content card-neumorphic">
      <div class="tab-header">
        <h2>개인정보</h2>
        <button v-if="!editMode" @click="editMode = true" class="secondary-button small">
          수정
        </button>
      </div>

      <div v-if="editMode" class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="editForm.name" />
          </div>

          <div class="form-group">
            <label for="id">아이디</label>
            <input type="text" id="id" v-model="editForm.id" disabled />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="editForm.email" />
          </div>

          <div class="form-group">
            <label for="phone">연락처</label>
            <input type="tel" id="phone" v-model="editForm.phone" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="birthDate">생년월일</label>
            <input type="date" id="birthDate" v-model="editForm.birthDate" />
          </div>

          <div class="form-group">
            <label for="address">주소</label>
            <input type="text" id="address" v-model="editForm.address" />
          </div>
        </div>

        <div class="form-actions">
          <button @click="editMode = false" class="secondary-button">취소</button>
          <button @click="saveProfile" class="button-3d">저장</button>
        </div>
      </div>

      <div v-else class="info-display">
        <div class="info-row">
          <div class="info-label">이름</div>
          <div class="info-value">{{ userInfo.name }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">아이디</div>
          <div class="info-value">{{ userInfo.id }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">이메일</div>
          <div class="info-value">{{ userInfo.email }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">연락처</div>
          <div class="info-value">{{ userInfo.phone }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">생년월일</div>
          <div class="info-value">{{ userInfo.birthDate }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">주소</div>
          <div class="info-value">{{ userInfo.address }}</div>
        </div>

        <div class="info-row">
          <div class="info-label">가입일</div>
          <div class="info-value">{{ userInfo.joinDate }}</div>
        </div>
      </div>
    </div>

    <!-- 계약정보 탭 -->
    <div v-if="activeTab === 'contracts'" class="tab-content card-neumorphic">
      <div class="tab-header">
        <h2>계약정보</h2>
      </div>

      <div class="contracts-list">
        <div v-for="contract in contracts" :key="contract.id" class="contract-item">
          <div class="contract-header">
            <div class="contract-title">
              <h3>{{ contract.name }}</h3>
              <span class="contract-type">{{ contract.insuranceType }}</span>
            </div>
            <div class="contract-status" :class="contract.status">
              {{ contract.status === 'active' ? '유효' : '만료' }}
            </div>
          </div>

          <div class="contract-details">
            <div class="detail-row">
              <div class="detail-label">계약번호</div>
              <div class="detail-value">{{ contract.id }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">보험기간</div>
              <div class="detail-value">{{ contract.startDate }} ~ {{ contract.endDate }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">보험료</div>
              <div class="detail-value">{{ contract.premium }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">납입일</div>
              <div class="detail-value">{{ contract.paymentDate }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">보장금액</div>
              <div class="detail-value">{{ contract.insuredAmount }}</div>
            </div>
          </div>

          <div class="contract-actions">
            <RouterLink :to="`/products/${contract.id}`" class="secondary-button"
              >상세보기</RouterLink
            >
            <RouterLink :to="`/claim?contract=${contract.id}`" class="button-3d small"
              >청구하기</RouterLink
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 보험금 청구내역 탭 -->
    <div v-if="activeTab === 'claims'" class="tab-content card-neumorphic">
      <div class="tab-header">
        <h2>보험금 청구내역</h2>
        <RouterLink to="/claim" class="button-3d small">새 청구</RouterLink>
      </div>

      <div class="claims-list">
        <div v-for="claim in claims" :key="claim.id" class="claim-item">
          <div class="claim-header">
            <div class="claim-title">
              <h3>{{ claim.productName }}</h3>
              <span class="claim-id">{{ claim.id }}</span>
            </div>
            <div class="claim-status" :class="claim.status">
              {{ claim.status === 'completed' ? '지급완료' : '처리중' }}
            </div>
          </div>

          <div class="claim-details">
            <div class="detail-row">
              <div class="detail-label">청구사유</div>
              <div class="detail-value">{{ claim.reason }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">청구일자</div>
              <div class="detail-value">{{ claim.claimDate }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">청구금액</div>
              <div class="detail-value highlight">{{ claim.claimAmount }}</div>
            </div>

            <div class="detail-row" v-if="claim.processingDate">
              <div class="detail-label">처리일자</div>
              <div class="detail-value">{{ claim.processingDate }}</div>
            </div>

            <div class="detail-row">
              <div class="detail-label">제출서류</div>
              <div class="detail-value documents">
                <span v-for="(doc, index) in claim.documents" :key="index" class="document-tag">
                  {{ doc }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 활동내역 탭 -->
    <div v-if="activeTab === 'activity'" class="tab-content card-neumorphic">
      <div class="tab-header">
        <h2>활동내역</h2>
      </div>

      <div class="activity-timeline">
        <div v-for="activity in activities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type"></div>
          <div class="activity-content">
            <div class="activity-date">{{ activity.date }}</div>
            <div class="activity-description">{{ activity.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mypage-view {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--color-heading);
  font-weight: 700;
}

/* 사용자 요약 정보 */
.user-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
}

.profile-area {
  display: flex;
  align-items: center;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: 600;
  margin-right: 1.5rem;
}

.profile-info h2 {
  margin: 0 0 0.25rem;
  font-size: 1.5rem;
  color: var(--color-heading);
}

.profile-info p {
  margin: 0;
  color: var(--color-text);
}

.profile-info .last-login {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.5rem;
}

.summary-cards {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.summary-card {
  text-align: center;
  min-width: 80px;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
}

.summary-label {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

/* 탭 네비게이션 */
.tab-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: var(--color-text-light);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.tab-button.active {
  color: var(--color-primary);
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

/* 탭 컨텐츠 */
.tab-content {
  padding: 2rem;
  margin-bottom: 2rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tab-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-heading);
}

/* 개인정보 */
.info-row {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  flex: 0 0 150px;
  font-weight: 500;
  color: var(--color-text-light);
}

.info-value {
  flex: 1;
  color: var(--color-text);
}

/* 편집 폼 */
.edit-form {
  padding: 1rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-light);
  font-size: 0.95rem;
}

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='date'] {
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

input:disabled {
  background-color: var(--color-background-mute);
  cursor: not-allowed;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* 버튼 */
.button-3d.small,
.secondary-button.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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
}

.secondary-button:hover {
  background-color: rgba(79, 70, 229, 0.1);
}

/* 계약 정보 */
.contract-item {
  background-color: var(--color-surface-soft);
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.contract-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.contract-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contract-title h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.contract-type {
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius-full);
  color: var(--color-text-light);
}

.contract-status {
  font-size: 0.9rem;
  font-weight: 600;
}

.contract-status.active {
  color: var(--color-success);
}

.contract-status.expired {
  color: var(--color-text-light);
}

.contract-details {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  flex: 0 0 120px;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.detail-value {
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-text);
}

.detail-value.highlight {
  font-weight: 600;
  color: var(--color-primary);
}

.contract-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
}

/* 청구 내역 */
.claim-item {
  background-color: var(--color-surface-soft);
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.claim-title {
  display: flex;
  flex-direction: column;
}

.claim-title h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-heading);
}

.claim-id {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.claim-status {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
}

.claim-status.completed {
  background-color: var(--color-success);
  color: white;
}

.claim-status.processing {
  background-color: var(--color-primary);
  color: white;
}

.documents {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.document-tag {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  background-color: var(--color-background-mute);
  border-radius: var(--border-radius-full);
  color: var(--color-text-light);
}

/* 활동내역 */
.activity-timeline {
  position: relative;
  padding-left: 2rem;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 0.65rem;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: var(--color-border);
}

.activity-item {
  position: relative;
  padding-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
}

.activity-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  position: absolute;
  left: -2rem;
  top: 0.25rem;
}

.activity-icon.login {
  background-color: var(--color-primary);
}

.activity-icon.contract_view {
  background-color: var(--color-secondary);
}

.activity-icon.claim_create {
  background-color: var(--color-warning);
}

.activity-icon.payment {
  background-color: var(--color-success);
}

.activity-icon.profile_update {
  background-color: var(--color-accent);
}

.activity-content {
  flex: 1;
}

.activity-date {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.activity-description {
  color: var(--color-text);
}

/* 반응형 */
@media (max-width: 768px) {
  .user-summary {
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .tab-navigation {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    text-align: center;
    padding: 0.75rem 0.5rem;
  }

  .contract-header,
  .claim-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .contract-actions {
    flex-direction: column;
  }

  .contract-actions a,
  .contract-actions button {
    width: 100%;
    text-align: center;
  }
}
</style>
