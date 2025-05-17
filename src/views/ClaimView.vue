<script setup lang="ts">
import { ref, reactive } from 'vue'

// 보험금 청구 단계
const steps = ['청구 정보 입력', '서류 업로드', '확인 및 제출']
const currentStep = ref(0)

// 청구 폼 데이터
const claimForm = reactive({
  // 1단계: 청구 정보
  contractNumber: '',
  claimType: '',
  claimReason: '',
  diagnosisDate: '',
  hospitalName: '',
  treatmentPeriod: '',
  accountHolder: '',
  bankName: '',
  accountNumber: '',

  // 2단계: 서류 업로드
  documents: {
    identification: null as string | null,
    medicalCertificate: null as string | null,
    receiptDocument: null as string | null,
    additionalDocument: null as string | null,
  },

  // 동의사항
  agreements: {
    personalInfo: false,
    medicalInfo: false,
    thirdPartyInfo: false,
  },
})

// 청구 타입 옵션
const claimTypeOptions = [
  { value: 'medicalFee', text: '의료비 청구' },
  { value: 'diagnosis', text: '진단비 청구' },
  { value: 'surgery', text: '수술비 청구' },
  { value: 'hospitalization', text: '입원비 청구' },
  { value: 'disability', text: '장해보험금 청구' },
  { value: 'death', text: '사망보험금 청구' },
  { value: 'other', text: '기타' },
]

// 은행 옵션
const bankOptions = [
  { value: 'kb', text: 'KB국민은행' },
  { value: 'shinhan', text: '신한은행' },
  { value: 'woori', text: '우리은행' },
  { value: 'hana', text: '하나은행' },
  { value: 'nh', text: '농협은행' },
  { value: 'ibk', text: 'IBK기업은행' },
  { value: 'sc', text: 'SC제일은행' },
  { value: 'keb', text: 'KEB하나은행' },
  { value: 'daegu', text: '대구은행' },
  { value: 'busan', text: '부산은행' },
  { value: 'post', text: '우체국' },
]

// 다음 단계로 이동
const nextStep = () => {
  if (validateCurrentStep()) {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }
}

// 이전 단계로 이동
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 현재 단계 유효성 검사
const validateCurrentStep = () => {
  if (currentStep.value === 0) {
    // 1단계 검증
    if (
      !claimForm.contractNumber ||
      !claimForm.claimType ||
      !claimForm.claimReason ||
      !claimForm.bankName ||
      !claimForm.accountNumber ||
      !claimForm.accountHolder
    ) {
      alert('필수 항목을 모두 입력해주세요.')
      return false
    }
    return true
  } else if (currentStep.value === 1) {
    // 2단계 검증
    if (!claimForm.documents.identification || !claimForm.documents.medicalCertificate) {
      alert('필수 서류를 업로드해주세요.')
      return false
    }
    return true
  }
  return true
}

// 파일 업로드 처리
const handleFileUpload = (event: Event, documentType: string) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // 실제 구현에서는 파일을 서버에 업로드하거나 처리하는 로직이 필요함
    // 여기서는 간단히 파일명만 저장
    claimForm.documents[documentType as keyof typeof claimForm.documents] = file.name
  }
}

// 청구서 제출
const submitClaim = () => {
  // 모든 동의사항 체크 확인
  if (
    !claimForm.agreements.personalInfo ||
    !claimForm.agreements.medicalInfo ||
    !claimForm.agreements.thirdPartyInfo
  ) {
    alert('모든 약관에 동의해주세요.')
    return
  }

  // 여기서는 제출 완료 메시지만 표시
  // 실제 구현에서는 API 호출 등을 통해 서버에 데이터 전송
  alert(
    '보험금 청구가 성공적으로 접수되었습니다. 청구번호: CL-' + Math.floor(Math.random() * 1000000),
  )
  // 홈 또는 마이페이지로 리다이렉션 등의 처리
}
</script>

<template>
  <div class="claim-view">
    <div class="page-header glass-panel">
      <div class="header-content">
        <h1 class="page-title">보험금 청구</h1>
        <p class="page-description">
          간편하게 보험금 청구를 신청하실 수 있습니다. 필요한 정보와 서류를 준비해주세요.
        </p>
      </div>
    </div>

    <!-- 단계 진행 표시 -->
    <div class="step-indicators card-neumorphic">
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="['step', { active: index === currentStep, completed: index < currentStep }]"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-text">{{ step }}</div>
      </div>
    </div>

    <!-- 청구 폼 -->
    <div class="claim-form card-neumorphic">
      <!-- 1단계: 청구 정보 입력 -->
      <div v-if="currentStep === 0" class="step-content">
        <h2 class="step-title">청구 정보 입력</h2>
        <p class="step-description">보험금 청구에 필요한 기본 정보를 입력해주세요.</p>

        <div class="form-group">
          <label for="contractNumber">계약번호*</label>
          <input
            type="text"
            id="contractNumber"
            v-model="claimForm.contractNumber"
            placeholder="보험 계약번호를 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label for="claimType">청구 유형*</label>
          <select id="claimType" v-model="claimForm.claimType" required>
            <option value="" disabled selected>청구 유형을 선택하세요</option>
            <option v-for="option in claimTypeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="claimReason">청구 사유*</label>
          <textarea
            id="claimReason"
            v-model="claimForm.claimReason"
            placeholder="청구 사유를 입력하세요"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="diagnosisDate">진단일자</label>
          <input type="date" id="diagnosisDate" v-model="claimForm.diagnosisDate" />
        </div>

        <div class="form-group">
          <label for="hospitalName">의료기관명</label>
          <input
            type="text"
            id="hospitalName"
            v-model="claimForm.hospitalName"
            placeholder="진료받은 의료기관명을 입력하세요"
          />
        </div>

        <div class="form-group">
          <label for="treatmentPeriod">치료기간</label>
          <input
            type="text"
            id="treatmentPeriod"
            v-model="claimForm.treatmentPeriod"
            placeholder="예: 2023.01.15 ~ 2023.01.20"
          />
        </div>

        <div class="section-divider">
          <h3>보험금 수령 계좌 정보</h3>
        </div>

        <div class="form-group">
          <label for="accountHolder">예금주명*</label>
          <input
            type="text"
            id="accountHolder"
            v-model="claimForm.accountHolder"
            placeholder="예금주명을 입력하세요"
            required
          />
        </div>

        <div class="form-group">
          <label for="bankName">은행명*</label>
          <select id="bankName" v-model="claimForm.bankName" required>
            <option value="" disabled selected>은행을 선택하세요</option>
            <option v-for="bank in bankOptions" :key="bank.value" :value="bank.value">
              {{ bank.text }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="accountNumber">계좌번호*</label>
          <input
            type="text"
            id="accountNumber"
            v-model="claimForm.accountNumber"
            placeholder="'-' 없이 입력하세요"
            required
          />
        </div>

        <div class="note">
          <p>* 표시는 필수 입력 항목입니다.</p>
        </div>

        <div class="form-actions">
          <button type="button" class="button-3d" @click="nextStep">다음 단계</button>
        </div>
      </div>

      <!-- 2단계: 서류 업로드 -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="step-title">서류 업로드</h2>
        <p class="step-description">
          청구에 필요한 서류를 업로드해주세요. 파일은 PDF, JPG, PNG 형식으로 5MB 이하로 업로드
          가능합니다.
        </p>

        <div class="document-upload">
          <div class="upload-item">
            <div class="upload-label">
              <span class="required">*</span> 신분증
              <span class="upload-description">주민등록증, 운전면허증, 여권 등</span>
            </div>
            <div class="upload-control">
              <input
                type="file"
                id="identification"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="(e) => handleFileUpload(e, 'identification')"
              />
              <label for="identification" class="upload-button">
                {{ claimForm.documents.identification || '파일 선택' }}
              </label>
            </div>
          </div>

          <div class="upload-item">
            <div class="upload-label">
              <span class="required">*</span> 진단서
              <span class="upload-description">병명이 명시된 진단서</span>
            </div>
            <div class="upload-control">
              <input
                type="file"
                id="medicalCertificate"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="(e) => handleFileUpload(e, 'medicalCertificate')"
              />
              <label for="medicalCertificate" class="upload-button">
                {{ claimForm.documents.medicalCertificate || '파일 선택' }}
              </label>
            </div>
          </div>

          <div class="upload-item">
            <div class="upload-label">
              영수증
              <span class="upload-description">진료비 영수증, 처방전 등</span>
            </div>
            <div class="upload-control">
              <input
                type="file"
                id="receiptDocument"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="(e) => handleFileUpload(e, 'receiptDocument')"
              />
              <label for="receiptDocument" class="upload-button">
                {{ claimForm.documents.receiptDocument || '파일 선택' }}
              </label>
            </div>
          </div>

          <div class="upload-item">
            <div class="upload-label">
              추가 서류
              <span class="upload-description">필요시 추가 서류 업로드</span>
            </div>
            <div class="upload-control">
              <input
                type="file"
                id="additionalDocument"
                accept=".pdf,.jpg,.jpeg,.png"
                @change="(e) => handleFileUpload(e, 'additionalDocument')"
              />
              <label for="additionalDocument" class="upload-button">
                {{ claimForm.documents.additionalDocument || '파일 선택' }}
              </label>
            </div>
          </div>
        </div>

        <div class="note">
          <p>* 표시는 필수 업로드 항목입니다.</p>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button" @click="prevStep">이전 단계</button>
          <button type="button" class="button-3d" @click="nextStep">다음 단계</button>
        </div>
      </div>

      <!-- 3단계: 확인 및 제출 -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="step-title">확인 및 제출</h2>
        <p class="step-description">입력하신 정보를 확인하시고 동의 후 제출해주세요.</p>

        <div class="confirmation-details">
          <h3>청구 정보</h3>
          <div class="detail-item">
            <div class="detail-label">계약번호</div>
            <div class="detail-value">{{ claimForm.contractNumber }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">청구 유형</div>
            <div class="detail-value">
              {{ claimTypeOptions.find((option) => option.value === claimForm.claimType)?.text }}
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">청구 사유</div>
            <div class="detail-value">{{ claimForm.claimReason }}</div>
          </div>

          <h3>수령 계좌 정보</h3>
          <div class="detail-item">
            <div class="detail-label">예금주</div>
            <div class="detail-value">{{ claimForm.accountHolder }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">은행명</div>
            <div class="detail-value">
              {{ bankOptions.find((option) => option.value === claimForm.bankName)?.text }}
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">계좌번호</div>
            <div class="detail-value">{{ claimForm.accountNumber }}</div>
          </div>

          <h3>업로드 서류</h3>
          <div class="detail-item">
            <div class="detail-label">신분증</div>
            <div class="detail-value">{{ claimForm.documents.identification }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">진단서</div>
            <div class="detail-value">{{ claimForm.documents.medicalCertificate }}</div>
          </div>

          <div v-if="claimForm.documents.receiptDocument" class="detail-item">
            <div class="detail-label">영수증</div>
            <div class="detail-value">{{ claimForm.documents.receiptDocument }}</div>
          </div>

          <div v-if="claimForm.documents.additionalDocument" class="detail-item">
            <div class="detail-label">추가 서류</div>
            <div class="detail-value">{{ claimForm.documents.additionalDocument }}</div>
          </div>
        </div>

        <div class="agreements-section">
          <h3>약관 동의</h3>

          <div class="agreement-item">
            <input type="checkbox" id="personalInfo" v-model="claimForm.agreements.personalInfo" />
            <label for="personalInfo">
              개인정보 수집 및 이용에 동의합니다. <span class="required">(필수)</span>
            </label>
          </div>

          <div class="agreement-item">
            <input type="checkbox" id="medicalInfo" v-model="claimForm.agreements.medicalInfo" />
            <label for="medicalInfo">
              의료정보 제공에 동의합니다. <span class="required">(필수)</span>
            </label>
          </div>

          <div class="agreement-item">
            <input
              type="checkbox"
              id="thirdPartyInfo"
              v-model="claimForm.agreements.thirdPartyInfo"
            />
            <label for="thirdPartyInfo">
              제3자 정보제공에 동의합니다. <span class="required">(필수)</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="secondary-button" @click="prevStep">이전 단계</button>
          <button type="button" class="button-3d" @click="submitClaim">청구서 제출</button>
        </div>
      </div>
    </div>

    <!-- 안내사항 -->
    <div class="info-section glass-card">
      <h2>청구 안내사항</h2>
      <div class="info-content">
        <div class="info-item">
          <h3>청구 접수 후 절차</h3>
          <p>
            청구 접수 후 담당자가 내용을 검토하며, 추가 서류가 필요한 경우 별도로 연락드립니다. 심사
            결과는 접수일로부터 3영업일 내 안내됩니다.
          </p>
        </div>

        <div class="info-item">
          <h3>보험금 지급 소요 시간</h3>
          <p>
            일반적인 경우 청구서류 접수일로부터 3영업일 이내에 보험금을 지급해드립니다. 다만, 사고
            조사나 확인이 필요한 경우 지급이 지연될 수 있습니다.
          </p>
        </div>

        <div class="info-item">
          <h3>문의처</h3>
          <p>
            보험금 청구에 관해 궁금하신 점은 고객센터(1588-1234)로 문의하시거나, 1:1 상담을 통해
            안내받으실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.claim-view {
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

/* 단계 인디케이터 */
.step-indicators {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
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

.step.active:not(:last-child)::after {
  background-color: var(--color-primary);
}

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

/* 청구 폼 */
.claim-form {
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.step-title {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.step-description {
  color: var(--color-text-light);
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-heading);
}

input[type='text'],
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

.section-divider {
  margin: 2rem 0 1.5rem;
}

.section-divider h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.note {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 1.5rem;
}

.required {
  color: var(--color-error);
}

/* 파일 업로드 */
.document-upload {
  margin-bottom: 2rem;
}

.upload-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
}

.upload-item:last-child {
  border-bottom: none;
}

.upload-label {
  flex: 1;
  font-weight: 500;
  color: var(--color-heading);
}

.upload-description {
  display: block;
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.upload-control {
  flex: 1;
  text-align: right;
}

.upload-control input[type='file'] {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.upload-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-button:hover {
  background-color: var(--color-background-soft);
  border-color: var(--color-primary);
}

/* 확인 및 제출 */
.confirmation-details {
  background-color: var(--color-surface-soft);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 2rem;
}

.confirmation-details h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin: 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.confirmation-details h3:first-child {
  margin-top: 0;
}

.detail-item {
  display: flex;
  padding: 0.75rem 0;
}

.detail-label {
  flex: 0 0 120px;
  font-weight: 500;
  color: var(--color-text-light);
}

.detail-value {
  flex: 1;
  color: var(--color-text);
}

/* 약관 동의 */
.agreements-section {
  margin: 2rem 0;
}

.agreements-section h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.agreement-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.agreement-item input[type='checkbox'] {
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
}

.agreement-item label {
  margin-bottom: 0;
  font-weight: 400;
}

/* 버튼 및 액션 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
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

/* 안내사항 */
.info-section {
  padding: 2.5rem;
  margin-bottom: 3rem;
}

.info-section h2 {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  text-align: center;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-item h3 {
  font-size: 1.2rem;
  color: var(--color-heading);
  margin-bottom: 0.75rem;
}

.info-item p {
  color: var(--color-text);
  line-height: 1.6;
}

/* 반응형 */
@media (max-width: 768px) {
  .step-indicators {
    padding: 1rem;
  }

  .step-text {
    display: none;
  }

  .form-actions {
    flex-direction: column;
  }

  .secondary-button,
  .button-3d {
    width: 100%;
  }

  .upload-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .upload-control {
    width: 100%;
    text-align: left;
  }

  .upload-button {
    width: 100%;
    max-width: none;
  }

  .detail-item {
    flex-direction: column;
  }

  .detail-label {
    margin-bottom: 0.25rem;
  }

  .confirmation-details {
    padding: 1rem;
  }
}
</style>
