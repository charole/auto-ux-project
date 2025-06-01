<script setup lang="ts">
import { ref, computed } from 'vue'

// 현재 로그인한 사용자인지 확인 (실제 구현 시 스토어나 서비스에서 가져와야 함)
const isLoggedIn = ref(localStorage.getItem('userProfile') !== null)

// 상담 유형
const consultationTypes = [
  { value: 'service', label: '서비스 문의' },
  { value: 'technical', label: '기술 지원' },
  { value: 'billing', label: '결제 문의' },
  { value: 'claim', label: '보험금 청구 문의' },
  { value: 'product', label: '상품 문의' },
  { value: 'other', label: '기타' },
]

// 예약 가능한 날짜 및 시간 (실제로는 API에서 가져와야 함)
const availableDates = ref([
  { date: '2025-05-01', times: ['10:00', '13:00', '15:00', '17:00'] },
  { date: '2025-05-02', times: ['09:00', '11:00', '14:00', '16:00'] },
  { date: '2025-05-03', times: ['10:00', '13:00', '15:00'] },
  { date: '2025-05-06', times: ['09:00', '11:00', '14:00', '16:00', '17:00'] },
  { date: '2025-05-07', times: ['10:00', '13:00', '15:00', '17:00'] },
])

// 선택된 날짜
const selectedDate = ref('')
// 선택된 시간
const selectedTime = ref('')
// 현재 선택된 탭
const activeTab = ref('form')

// 선택된 날짜에 따른 가능한 시간 목록
const availableTimesForSelectedDate = computed(() => {
  const found = availableDates.value.find((item) => item.date === selectedDate.value)
  return found ? found.times : []
})

// 채팅 메시지
const chatMessages = ref([
  {
    sender: 'system',
    message: '안녕하세요! SecureLife 상담 서비스입니다. 무엇을 도와드릴까요?',
    time: '12:30',
  },
])
const newMessage = ref('')

// 채팅 메시지 전송
function sendMessage() {
  if (!newMessage.value.trim()) return

  // 사용자 메시지 추가
  chatMessages.value.push({
    sender: 'user',
    message: newMessage.value,
    time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  })

  // 메시지 입력창 초기화
  newMessage.value = ''

  // 자동 응답 (실제로는 API 연동 필요)
  setTimeout(() => {
    chatMessages.value.push({
      sender: 'agent',
      message: '문의해주셔서 감사합니다. 담당 상담사가 곧 답변 드리겠습니다.',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    })
  }, 1000)
}

// 과거 상담 내역 (실제로는 API에서 가져와야 함)
const consultationHistory = ref([
  { id: 1, date: '2025-04-20', title: '보험금 청구 관련 문의', status: '답변완료' },
  { id: 2, date: '2025-04-15', title: '상품 가입 문의', status: '답변완료' },
  { id: 3, date: '2025-04-10', title: '계약 변경 관련 문의', status: '처리중' },
])

// FAQ 항목
const faqItems = ref([
  {
    question: '보험금 청구는 어떻게 하나요?',
    answer:
      '보험금 청구는 마이페이지 > 보험금 청구 메뉴를 통해 온라인으로 신청 가능합니다. 필요한 서류를 첨부하여 제출하시면 심사 후 처리됩니다.',
    isOpen: false,
  },
  {
    question: '계약 내용을 변경하고 싶어요.',
    answer:
      '계약 내용 변경은 마이페이지에서 가능합니다. 변경하고자 하는 항목에 따라 필요한 서류가 다를 수 있으니 상담원 문의를 권장합니다.',
    isOpen: false,
  },
  {
    question: '보험료 납입 방법을 변경할 수 있나요?',
    answer:
      '네, 보험료 납입 방법은 마이페이지 > 계약관리에서 변경 가능합니다. 납입 주기, 납입 방법(자동이체, 카드 등) 모두 변경 가능합니다.',
    isOpen: false,
  },
  {
    question: '보험 해지 시 환급금은 어떻게 계산되나요?',
    answer:
      '보험 해지 시 환급금은 납입한 보험료와 해지 시점의 책임준비금 등에 따라 계산됩니다. 정확한 금액은 상담원을 통해 확인하시는 것이 좋습니다.',
    isOpen: false,
  },
  {
    question: '보험 계약 대출은 어떻게 신청하나요?',
    answer:
      '보험 계약 대출은 마이페이지 > 계약대출 메뉴에서 신청 가능합니다. 대출 한도 및 이율은 계약 내용에 따라 다를 수 있습니다.',
    isOpen: false,
  },
])

// FAQ 토글
function toggleFaq(index: number) {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen
}
</script>

<template>
  <div class="consultation">
    <h1>상담 서비스</h1>

    <div class="tab-navigation">
      <button :class="['tab-button', { active: activeTab === 'form' }]" @click="activeTab = 'form'">
        상담 요청
      </button>
      <button :class="['tab-button', { active: activeTab === 'chat' }]" @click="activeTab = 'chat'">
        실시간 채팅
      </button>
      <button
        :class="['tab-button', { active: activeTab === 'appointment' }]"
        @click="activeTab = 'appointment'"
      >
        상담 예약
      </button>
      <button
        v-if="isLoggedIn"
        :class="['tab-button', { active: activeTab === 'history' }]"
        @click="activeTab = 'history'"
      >
        상담 내역
      </button>
      <button :class="['tab-button', { active: activeTab === 'faq' }]" @click="activeTab = 'faq'">
        자주 묻는 질문
      </button>
    </div>

    <div class="tab-content">
      <!-- 상담 요청 폼 -->
      <div v-if="activeTab === 'form'" class="consultation-content">
        <div class="description">
          <h2>어떤 도움이 필요하신가요?</h2>
          <p>
            저희 전문 상담사들이 고객님의 문의사항에 친절하게 답변해 드립니다. 아래 폼을
            작성하시거나 직접 연락처로 문의해주세요.
          </p>
        </div>

        <form class="consultation-form">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" placeholder="이름을 입력해주세요" />
          </div>

          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일을 입력해주세요" />
          </div>

          <div class="form-group">
            <label for="phone">연락처</label>
            <input type="tel" id="phone" placeholder="연락처를 입력해주세요" />
          </div>

          <div class="form-group">
            <label for="category">문의 유형</label>
            <select id="category">
              <option value="" disabled selected>문의 유형을 선택해주세요</option>
              <option v-for="type in consultationTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">문의 내용</label>
            <textarea
              id="message"
              rows="5"
              placeholder="문의하실 내용을 자세히 적어주세요"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="file">첨부파일</label>
            <input type="file" id="file" />
            <p class="help-text">최대 10MB, 이미지 또는 PDF 파일만 가능합니다.</p>
          </div>

          <button type="submit" class="submit-button">제출하기</button>
        </form>

        <div class="contact-info">
          <h3>직접 연락하기</h3>
          <p><strong>전화:</strong> 02-123-4567</p>
          <p><strong>이메일:</strong> support@securelife.com</p>
          <p><strong>운영시간:</strong> 평일 9:00 - 18:00 (공휴일 제외)</p>
        </div>
      </div>

      <!-- 실시간 채팅 -->
      <div v-if="activeTab === 'chat'" class="chat-container">
        <div class="chat-messages">
          <div
            v-for="(msg, index) in chatMessages"
            :key="index"
            :class="['chat-message', msg.sender]"
          >
            <div class="message-content">
              <p>{{ msg.message }}</p>
              <span class="message-time">{{ msg.time }}</span>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input
            type="text"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="메시지를 입력하세요..."
          />
          <button @click="sendMessage" class="send-button">전송</button>
        </div>
      </div>

      <!-- 상담 예약 -->
      <div v-if="activeTab === 'appointment'" class="appointment-container">
        <div class="description">
          <h2>전문 상담사와 예약 상담</h2>
          <p>
            원하시는 날짜와 시간에 전문 상담사와 1:1 상담을 예약하실 수 있습니다. 예약 후 선택하신
            방법(전화, 화상)으로 상담이 진행됩니다.
          </p>
        </div>

        <div class="appointment-form">
          <div class="form-group">
            <label for="consultation-type">상담 유형</label>
            <select id="consultation-type">
              <option value="" disabled selected>상담 유형을 선택해주세요</option>
              <option v-for="type in consultationTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="consultation-method">상담 방법</label>
            <select id="consultation-method">
              <option value="" disabled selected>상담 방법을 선택해주세요</option>
              <option value="phone">전화 상담</option>
              <option value="video">화상 상담</option>
              <option value="visit">방문 상담</option>
            </select>
          </div>

          <div class="form-group">
            <label for="consultation-date">상담 날짜</label>
            <select id="consultation-date" v-model="selectedDate">
              <option value="" disabled selected>날짜를 선택해주세요</option>
              <option
                v-for="dateOption in availableDates"
                :key="dateOption.date"
                :value="dateOption.date"
              >
                {{ dateOption.date }}
              </option>
            </select>
          </div>

          <div class="form-group" v-if="selectedDate">
            <label for="consultation-time">상담 시간</label>
            <select id="consultation-time" v-model="selectedTime">
              <option value="" disabled selected>시간을 선택해주세요</option>
              <option v-for="time in availableTimesForSelectedDate" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="appointment-note">상담 내용</label>
            <textarea
              id="appointment-note"
              rows="4"
              placeholder="상담 받고 싶은 내용을 간략히 적어주세요"
            ></textarea>
          </div>

          <button type="submit" class="submit-button">예약하기</button>
        </div>
      </div>

      <!-- 상담 내역 -->
      <div v-if="activeTab === 'history'" class="history-container">
        <h2>상담 내역</h2>
        <div v-if="consultationHistory.length === 0" class="empty-history">
          <p>상담 내역이 없습니다.</p>
        </div>
        <div v-else class="history-list">
          <div v-for="history in consultationHistory" :key="history.id" class="history-item">
            <div class="history-date">{{ history.date }}</div>
            <div class="history-title">{{ history.title }}</div>
            <div
              :class="['history-status', history.status === '답변완료' ? 'completed' : 'pending']"
            >
              {{ history.status }}
            </div>
            <button class="view-button">상세보기</button>
          </div>
        </div>
      </div>

      <!-- 자주 묻는 질문 -->
      <div v-if="activeTab === 'faq'" class="faq-container">
        <h2>자주 묻는 질문</h2>
        <div class="faq-list">
          <div
            v-for="(faq, index) in faqItems"
            :key="index"
            class="faq-item"
            :class="{ open: faq.isOpen }"
          >
            <div class="faq-question" @click="toggleFaq(index)">
              <h3>{{ faq.question }}</h3>
              <span class="toggle-icon">+</span>
            </div>
            <div class="faq-answer" v-show="faq.isOpen">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.consultation {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.consultation h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
  text-align: center;
}

/* 탭 네비게이션 스타일 */
.tab-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.tab-button {
  padding: 0.75rem 1.25rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-button:hover {
  background-color: var(--color-primary-soft);
}

.tab-button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 상담 폼 스타일 */
.consultation-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.description {
  margin-bottom: 1.5rem;
}

.description h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.description p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.consultation-form {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  background-color: var(--color-background-soft);
}

.form-group textarea {
  resize: vertical;
}

.help-text {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-top: 0.5rem;
}

.submit-button {
  background-color: var(--color-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.submit-button:hover {
  background-color: var(--color-primary-dark);
}

.contact-info {
  background-color: var(--color-primary-soft);
  padding: 1.5rem;
  border-radius: var(--border-radius-lg);
  margin-top: 2rem;
}

.contact-info h3 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.contact-info p {
  margin-bottom: 0.5rem;
}

/* 채팅 스타일 */
.chat-container {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  height: 70vh;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  margin-bottom: 1rem;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.agent .message-content,
.chat-message.system .message-content {
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg) 0;
}

.chat-message.user .message-content {
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 var(--border-radius-lg);
}

.message-content {
  padding: 1rem;
  max-width: 70%;
  position: relative;
}

.message-content p {
  margin: 0;
  word-break: break-word;
}

.message-time {
  font-size: 0.75rem;
  color: var(--color-text-light);
  position: absolute;
  bottom: 0.3rem;
  right: 0.5rem;
}

.chat-message.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
  font-size: 1rem;
}

.chat-input .send-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
  cursor: pointer;
}

/* 예약 스타일 */
.appointment-container {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.appointment-form {
  margin-top: 2rem;
}

/* 상담 내역 스타일 */
.history-container {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.history-container h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.empty-history {
  text-align: center;
  padding: 3rem 0;
  color: var(--color-text-light);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.history-item:hover {
  background-color: var(--color-primary-soft);
}

.history-date {
  width: 120px;
  font-weight: 600;
}

.history-title {
  flex: 1;
}

.history-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.history-status.completed {
  background-color: var(--color-success);
  color: rgba(0, 0, 0, 0.7);
}

.history-status.pending {
  background-color: var(--color-warning);
  color: rgba(0, 0, 0, 0.7);
}

.view-button {
  margin-left: 1rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
  cursor: pointer;
}

/* FAQ 스타일 */
.faq-container {
  background-color: var(--color-surface);
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.faq-container h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.faq-question {
  padding: 1.25rem;
  background-color: var(--color-background-soft);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.faq-question:hover {
  background-color: var(--color-primary-soft);
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
}

.toggle-icon {
  font-size: 1.5rem;
  transition: transform var(--transition-fast);
}

.faq-item.open .toggle-icon {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 1.25rem;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.faq-answer p {
  margin: 0;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .consultation-content {
    grid-template-columns: 1fr;
  }
}
</style>
