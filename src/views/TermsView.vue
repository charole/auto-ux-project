<script setup lang="ts">
import { ref } from 'vue'

// 목차 링크
const sections = [
  { id: 'section-1', title: '제1조 (목적)' },
  { id: 'section-2', title: '제2조 (정의)' },
  { id: 'section-3', title: '제3조 (약관의 효력 및 변경)' },
  { id: 'section-4', title: '제4조 (서비스의 제공 및 변경)' },
  { id: 'section-5', title: '제5조 (서비스 이용계약의 성립)' },
  { id: 'section-6', title: '제6조 (회원가입)' },
  { id: 'section-7', title: '제7조 (개인정보의 보호 및 사용)' },
  { id: 'section-8', title: '제8조 (회원의 의무)' },
  { id: 'section-9', title: '제9조 (회사의 의무)' },
  { id: 'section-10', title: '제10조 (저작권의 귀속 및 이용제한)' },
]

// 현재 활성화된 섹션 (스크롤 위치 표시용)
const activeSection = ref('section-1')

// 섹션으로 스크롤
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

// 스크롤 이벤트 함수 제거 및 주석 정리
// 필요시 아래 코드를 활성화하여 스크롤 위치에 따른 활성 섹션 업데이트 기능 사용 가능
/*
import { onMounted, onUnmounted } from 'vue'

// 스크롤 이벤트에 따른 활성 섹션 업데이트
const handleScroll = () => {
  const scrollPosition = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i].id)
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = sections[i].id
      break
    }
  }
}

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
*/
</script>

<template>
  <div class="terms-view">
    <div class="page-header glass-panel">
      <div class="header-content">
        <h1 class="page-title">이용약관</h1>
        <p class="page-description">
          SecureLife 서비스 이용약관입니다. 서비스를 이용하시기 전에 반드시 읽어주시기 바랍니다.
        </p>
        <p class="updated-date">최종 업데이트: 2023년 5월 15일</p>
      </div>
    </div>

    <div class="terms-content">
      <!-- 좌측 네비게이션 -->
      <div class="terms-nav card-neumorphic">
        <nav>
          <ul>
            <li
              v-for="section in sections"
              :key="section.id"
              :class="{ active: activeSection === section.id }"
            >
              <a href="#" @click.prevent="scrollToSection(section.id)">
                {{ section.title }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- 본문 내용 -->
      <div class="terms-body card-neumorphic">
        <!-- 1. 목적 -->
        <section id="section-1" class="terms-section">
          <h2>제1조 (목적)</h2>
          <p>
            이 약관은 SecureLife(이하 '회사')가 제공하는 보험 서비스(이하 '서비스')를 이용함에 있어
            회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <!-- 2. 정의 -->
        <section id="section-2" class="terms-section">
          <h2>제2조 (정의)</h2>
          <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>

          <ol>
            <li>
              '서비스'라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치)와 상관없이
              회원이 이용할 수 있는 SecureLife 관련 제반 서비스를 의미합니다.
            </li>
            <li>
              '회원'이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고
              회사가 제공하는 서비스를 이용하는 고객을 말합니다.
            </li>
            <li>
              '아이디(ID)'라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는
              문자와 숫자의 조합을 의미합니다.
            </li>
            <li>
              '비밀번호'라 함은 회원이 부여 받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해
              회원 자신이 정한 문자 또는 숫자의 조합을 의미합니다.
            </li>
          </ol>
        </section>

        <!-- 3. 약관의 효력 및 변경 -->
        <section id="section-3" class="terms-section">
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <p>
            본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력이 발생합니다. 회사는
            필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 회사가 제공하는 홈페이지나 기타
            방법을 통해 공지함으로써 효력이 발생합니다.
          </p>
          <p>
            회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 회사가
            제공하는 웹사이트 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
            다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이전에 공지하여야 하며,
            이메일 등 전자적 수단을 통해 개별적으로 통지합니다.
          </p>
        </section>

        <!-- 4. 서비스의 제공 및 변경 -->
        <section id="section-4" class="terms-section">
          <h2>제4조 (서비스의 제공 및 변경)</h2>
          <p>회사는 다음과 같은 업무를 수행합니다.</p>
          <ol>
            <li>보험 상품 소개 및 가입 서비스</li>
            <li>보험금 청구 및 지급 서비스</li>
            <li>계약 조회 및 관리 서비스</li>
            <li>고객 상담 서비스</li>
            <li>보험 정보 제공 서비스</li>
            <li>기타 회사가 정하는 서비스</li>
          </ol>
          <p>
            회사는 서비스를 일정 범위로 분할하여 각 범위별로 이용 가능 시간을 별도로 정할 수 있으며,
            이 경우 그 내용을 사전에 공지합니다. 회사는 기술적 사양의 변경 등의 이유로 서비스의
            내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공 일자를 사전에 공지합니다.
          </p>
        </section>

        <!-- 5. 서비스 이용계약의 성립 -->
        <section id="section-5" class="terms-section">
          <h2>제5조 (서비스 이용계약의 성립)</h2>
          <p>
            서비스 이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여
            동의하고 회원가입 신청을 한 후 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
          </p>
          <p>
            회사는 가입신청자의 신청에 대하여 서비스 이용을 승낙함을 원칙으로 합니다. 다만, 회사는
            다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수
            있습니다.
          </p>
          <ol>
            <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
            <li>허위의 정보를 기재하거나, 회사가 요구하는 내용을 기재하지 않은 경우</li>
            <li>14세 미만 아동이 법정대리인(부모 등)의 동의를 얻지 않은 경우</li>
            <li>
              이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반한 경우
            </li>
          </ol>
        </section>

        <!-- 6. 회원가입 -->
        <section id="section-6" class="terms-section">
          <h2>제6조 (회원가입)</h2>
          <p>
            회원가입은 개인정보 수집에 동의하고, 본인확인 과정을 거친 후 이용계약 체결 단계에서
            이루어집니다. 회사는 회원에게 아이디를 부여하고, 회원은 비밀번호를 설정합니다.
          </p>
          <p>
            회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 즉시 전자우편 또는 회사가 정한
            방법으로 이를 회사에 알려야 합니다. 회원이 변경사항에 대한 통지를 하지 않아 발생하는
            불이익에 대해서는 회사는 책임을 지지 않습니다.
          </p>
        </section>

        <!-- 7. 개인정보의 보호 및 사용 -->
        <section id="section-7" class="terms-section">
          <h2>제7조 (개인정보의 보호 및 사용)</h2>
          <p>
            회사는 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.
            개인정보의 보호 및 사용에 대해서는 개인정보처리방침에 따릅니다. 회사는 회원이 안전하게
            서비스를 이용할 수 있도록 개인정보보호를 위한 보안 시스템을 갖추고 있습니다.
          </p>
          <p>
            회사는 서비스의 제공 목적 이외에 이용자의 개인정보를 이용하거나 이용자의 동의 없이
            제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
          </p>
          <ol>
            <li>관계법령에 의하여 수사상의 목적으로 관계기관으로부터 요구가 있는 경우</li>
            <li>
              통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는
              형태로 제공하는 경우
            </li>
          </ol>
        </section>

        <!-- 8. 회원의 의무 -->
        <section id="section-8" class="terms-section">
          <h2>제8조 (회원의 의무)</h2>
          <p>회원은 다음 행위를 하여서는 안 됩니다.</p>
          <ol>
            <li>신청 또는 변경 시 허위내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
            <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>
              외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 공개 또는
              게시하는 행위
            </li>
            <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ol>
        </section>

        <!-- 9. 회사의 의무 -->
        <section id="section-9" class="terms-section">
          <h2>제9조 (회사의 의무)</h2>
          <p>
            회사는 관계 법령과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고
            안정적으로 서비스를 제공하기 위하여 최선을 다합니다. 회사는 회원이 안전하게 서비스를
            이용할 수 있도록 개인정보 보호를 위한 보안 시스템을 갖추어야 합니다.
          </p>
          <p>
            회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할
            경우에는 이를 처리하여야 합니다. 회원이 제기한 의견이나 불만사항에 대해서는 게시판을
            활용하거나 전자우편 등을 통하여 회원에게 처리과정 및 결과를 전달합니다.
          </p>
        </section>

        <!-- 10. 저작권의 귀속 및 이용제한 -->
        <section id="section-10" class="terms-section">
          <h2>제10조 (저작권의 귀속 및 이용제한)</h2>
          <p>
            회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다. 회원은 회사가
            제공하는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포,
            방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
          <p>
            회원이 서비스 내에 게시한 게시물(이하 "게시물")의 저작권은 해당 게시물의 저작자에게
            귀속됩니다. 회원이 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션
            등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어
            게시될 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-view {
  max-width: 1100px;
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
  margin: 0 auto 1rem;
}

.updated-date {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

/* 내용 레이아웃 */
.terms-content {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(600px, 3fr);
  gap: 2rem;
}

/* 좌측 네비게이션 */
.terms-nav {
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.terms-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.terms-nav li {
  margin-bottom: 0.75rem;
}

.terms-nav a {
  display: block;
  padding: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
}

.terms-nav a:hover {
  background-color: var(--color-background-soft);
  color: var(--color-primary);
}

.terms-nav li.active a {
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
}

/* 본문 내용 */
.terms-body {
  padding: 2rem;
}

.terms-section {
  margin-bottom: 3rem;
}

.terms-section:last-child {
  margin-bottom: 0;
}

.terms-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.terms-section h3 {
  font-size: 1.3rem;
  margin: 1.5rem 0 1rem;
  color: var(--color-heading);
}

.terms-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

.terms-section ul,
.terms-section ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.terms-section li {
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

/* 반응형 스타일 */
@media (max-width: 900px) {
  .terms-content {
    grid-template-columns: 1fr;
  }

  .terms-nav {
    position: static;
    max-height: none;
  }
}
</style>
