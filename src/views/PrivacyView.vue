<script setup lang="ts">
import { ref } from 'vue'

// 목차 링크
const sections = [
  { id: 'section-1', title: '개인정보의 처리 목적' },
  { id: 'section-2', title: '개인정보의 처리 및 보유 기간' },
  { id: 'section-3', title: '개인정보의 제3자 제공' },
  { id: 'section-4', title: '개인정보처리 위탁' },
  { id: 'section-5', title: '정보주체의 권리·의무 및 행사방법' },
  { id: 'section-6', title: '처리하는 개인정보 항목' },
  { id: 'section-7', title: '개인정보의 파기' },
  { id: 'section-8', title: '개인정보의 안전성 확보조치' },
  { id: 'section-9', title: '개인정보 보호책임자' },
  { id: 'section-10', title: '개인정보처리방침 변경' },
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
</script>

<template>
  <div class="privacy-view">
    <div class="page-header glass-panel">
      <div class="header-content">
        <h1 class="page-title">개인정보처리방침</h1>
        <p class="page-description">
          SecureLife는 고객님의 개인정보를 소중히 여기며, 개인정보 보호법에 따라 아래와 같이
          개인정보처리방침을 수립하여 고지합니다.
        </p>
        <p class="updated-date">최종 업데이트: 2023년 5월 15일</p>
      </div>
    </div>

    <div class="privacy-content">
      <!-- 좌측 네비게이션 -->
      <div class="privacy-nav card-neumorphic">
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
      <div class="privacy-body card-neumorphic">
        <!-- 1. 개인정보의 처리 목적 -->
        <section id="section-1" class="privacy-section">
          <h2>1. 개인정보의 처리 목적</h2>
          <p>
            SecureLife(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
            개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는
            개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>

          <h3>가. 보험계약의 체결 및 이행</h3>
          <p>
            보험계약의 인수심사·체결·유지·관리, 보험금 등 지급·심사, 순보험요율의 산출·검증,
            민원처리 및 분쟁 대응, 보험사고조사(보험사기 조사 포함), 보험모집질서 유지 및
            과열경쟁방지를 위한 업무, 보험상품 개발, 지급여력 및 가용자본의 산출 등의 목적으로
            개인정보를 처리합니다.
          </p>

          <h3>나. 고객관리 및 마케팅</h3>
          <p>
            고객관리, 회원제 서비스 이용에 따른 본인확인, 개인 식별, 부정이용방지, 비인가 사용방지,
            서비스 제공 및 향상, 관련 정보·상품·서비스·행사 안내, 선호도 파악, 마케팅 활용 등의
            목적으로 개인정보를 처리합니다.
          </p>
        </section>

        <!-- 2. 개인정보의 처리 및 보유 기간 -->
        <section id="section-2" class="privacy-section">
          <h2>2. 개인정보의 처리 및 보유 기간</h2>
          <p>
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시
            동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>

          <h3>주요 보유 기간</h3>
          <ul>
            <li>보험계약 정보: 계약 종료일로부터 5년</li>
            <li>보험금 지급 정보: 청구일로부터 3년</li>
            <li>회원 가입 정보: 회원 탈퇴 시까지</li>
            <li>마케팅 정보: 동의 철회 시까지</li>
            <li>채용 지원 정보: 지원일로부터 1년</li>
          </ul>

          <p>
            다만, 관계 법령에 따라 달리 보존하여야 하는 경우에는 해당 법령에서 정한 기간에 따릅니다.
          </p>
        </section>

        <!-- 3. 개인정보의 제3자 제공 -->
        <section id="section-3" class="privacy-section">
          <h2>3. 개인정보의 제3자 제공</h2>
          <p>
            회사는 원칙적으로 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위
            내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게
            제공하지 않습니다. 단, 다음의 경우에는 개인정보를 제3자에게 제공할 수 있습니다.
          </p>

          <ul>
            <li>정보주체가 사전에 제3자 제공에 동의한 경우</li>
            <li>법령에 의하여 제공이 요구되거나 허용되는 경우</li>
            <li>
              서비스 제공에 관한 계약의 이행을 위하여 필요한 개인정보로서 경제적·기술적인 사유로
              통상적인 동의를 받는 것이 뚜렷하게 곤란한 경우
            </li>
            <li>개인을 식별할 수 없는 상태로 가공하여 제공하는 경우</li>
          </ul>

          <h3>제3자 제공 현황</h3>
          <table class="privacy-table">
            <thead>
              <tr>
                <th>제공받는 자</th>
                <th>제공 목적</th>
                <th>제공 항목</th>
                <th>보유 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>금융감독원</td>
                <td>보험업법 등 법령에 따른 업무수행</td>
                <td>개인식별정보, 보험계약정보, 보험금 지급정보</td>
                <td>제공 목적 달성 시까지</td>
              </tr>
              <tr>
                <td>손해보험협회</td>
                <td>보험계약의 적부조사, 보험금 지급심사</td>
                <td>개인식별정보, 보험계약정보, 보험금 지급정보</td>
                <td>제공 목적 달성 시까지</td>
              </tr>
              <tr>
                <td>생명보험협회</td>
                <td>보험계약의 적부조사, 보험금 지급심사</td>
                <td>개인식별정보, 보험계약정보, 보험금 지급정보</td>
                <td>제공 목적 달성 시까지</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 4. 개인정보처리 위탁 -->
        <section id="section-4" class="privacy-section">
          <h2>4. 개인정보처리 위탁</h2>
          <p>
            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고
            있습니다. 회사는 위탁계약 체결 시 개인정보 보호법 제26조에 따라 위탁업무 수행목적 외
            개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독,
            손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게
            처리하는지를 감독하고 있습니다.
          </p>

          <h3>위탁 현황</h3>
          <table class="privacy-table">
            <thead>
              <tr>
                <th>수탁자</th>
                <th>위탁업무 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>(주)보험IT서비스</td>
                <td>전산시스템 운영 및 유지보수</td>
              </tr>
              <tr>
                <td>(주)콜센터서비스</td>
                <td>고객센터 운영, 상담업무</td>
              </tr>
              <tr>
                <td>(주)보험심사평가</td>
                <td>보험계약 심사, 보험금 지급 심사</td>
              </tr>
              <tr>
                <td>(주)마케팅파트너스</td>
                <td>보험상품 안내 및 마케팅 활동</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- 5. 정보주체의 권리·의무 및 행사방법 -->
        <section id="section-5" class="privacy-section">
          <h2>5. 정보주체의 권리·의무 및 행사방법</h2>
          <p>
            정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수
            있습니다.
          </p>

          <ul>
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>

          <p>
            제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편, 모사전송(FAX) 등을 통하여
            하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
          </p>

          <p>
            정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는
            삭제를 완료할 때까지 당해 개인정보를 이용하거나 제3자에게 제공하지 않습니다.
          </p>

          <p>
            제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여
            하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을
            제출하셔야 합니다.
          </p>
        </section>

        <!-- 6. 처리하는 개인정보 항목 -->
        <section id="section-6" class="privacy-section">
          <h2>6. 처리하는 개인정보 항목</h2>
          <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>

          <h3>가. 보험계약 체결 및 이행</h3>
          <ul>
            <li>
              필수항목: 개인식별정보(성명, 주민등록번호, 외국인등록번호, 주소, 전화번호,
              전자우편주소), 보험계약정보, 보험금지급 관련 정보
            </li>
            <li>선택항목: 직업, 건강정보, 병력사항, 재정정보</li>
          </ul>

          <h3>나. 홈페이지 회원 가입 및 관리</h3>
          <ul>
            <li>필수항목: 성명, 아이디, 비밀번호, 전자우편주소, 휴대전화번호</li>
            <li>선택항목: 직업, 관심 보험상품</li>
          </ul>

          <h3>다. 인터넷 서비스 이용과정에서 자동으로 생성·수집되는 정보</h3>
          <ul>
            <li>IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록, 불량 이용기록 등</li>
          </ul>
        </section>

        <!-- 7. 개인정보의 파기 -->
        <section id="section-7" class="privacy-section">
          <h2>7. 개인정보의 파기</h2>
          <p>
            회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
            지체없이 해당 개인정보를 파기합니다.
          </p>

          <p>개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>

          <h3>가. 파기절차</h3>
          <p>
            회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아
            개인정보를 파기합니다.
          </p>

          <h3>나. 파기방법</h3>
          <p>
            회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이
            문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
          </p>
        </section>

        <!-- 8. 개인정보의 안전성 확보조치 -->
        <section id="section-8" class="privacy-section">
          <h2>8. 개인정보의 안전성 확보조치</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>

          <h3>가. 관리적 조치</h3>
          <p>내부관리계획 수립·시행, 정기적 직원 교육 등</p>

          <h3>나. 기술적 조치</h3>
          <p>
            개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화,
            보안프로그램 설치 등
          </p>

          <h3>다. 물리적 조치</h3>
          <p>전산실, 자료보관실 등의 접근통제 등</p>
        </section>

        <!-- 9. 개인정보 보호책임자 -->
        <section id="section-9" class="privacy-section">
          <h2>9. 개인정보 보호책임자</h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
            불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>

          <div class="contact-info">
            <div class="contact-row">
              <div class="contact-label">개인정보 보호책임자</div>
              <div class="contact-value">김정보 팀장</div>
            </div>
            <div class="contact-row">
              <div class="contact-label">부서</div>
              <div class="contact-value">정보보호팀</div>
            </div>
            <div class="contact-row">
              <div class="contact-label">연락처</div>
              <div class="contact-value">02-1234-5678, privacy@securelife.com</div>
            </div>
          </div>

          <p>
            정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
            불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는
            정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
          </p>
        </section>

        <!-- 10. 개인정보처리방침 변경 -->
        <section id="section-10" class="privacy-section">
          <h2>10. 개인정보처리방침 변경</h2>
          <p>이 개인정보처리방침은 2023년 5월 15일부터 적용됩니다.</p>

          <h3>이전 개인정보처리방침</h3>
          <ul class="version-history">
            <li><a href="#">2023년 1월 1일 ~ 2023년 5월 14일 적용</a></li>
            <li><a href="#">2022년 6월 1일 ~ 2022년 12월 31일 적용</a></li>
            <li><a href="#">2022년 1월 1일 ~ 2022년 5월 31일 적용</a></li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-view {
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
.privacy-content {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(600px, 3fr);
  gap: 2rem;
}

/* 좌측 네비게이션 */
.privacy-nav {
  padding: 1.5rem;
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.privacy-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.privacy-nav li {
  margin-bottom: 0.75rem;
}

.privacy-nav a {
  display: block;
  padding: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s;
}

.privacy-nav a:hover {
  background-color: var(--color-background-soft);
  color: var(--color-primary);
}

.privacy-nav li.active a {
  background-color: var(--color-primary);
  color: white;
  font-weight: 500;
}

/* 본문 내용 */
.privacy-body {
  padding: 2rem;
}

.privacy-section {
  margin-bottom: 3rem;
}

.privacy-section:last-child {
  margin-bottom: 0;
}

.privacy-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.privacy-section h3 {
  font-size: 1.3rem;
  margin: 1.5rem 0 1rem;
  color: var(--color-heading);
}

.privacy-section p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

.privacy-section ul,
.privacy-section ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.privacy-section li {
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

/* 테이블 스타일 */
.privacy-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.privacy-table th,
.privacy-table td {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  text-align: left;
}

.privacy-table th {
  background-color: var(--color-background-soft);
  font-weight: 600;
  color: var(--color-heading);
}

.privacy-table td {
  color: var(--color-text);
}

/* 버전 기록 */
.version-history {
  list-style: none;
  padding: 0;
}

.version-history li {
  margin-bottom: 0.5rem;
}

.version-history a {
  color: var(--color-primary);
  text-decoration: none;
}

.version-history a:hover {
  text-decoration: underline;
}

/* 연락처 정보 */
.contact-info {
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.contact-row {
  display: flex;
  margin-bottom: 0.75rem;
}

.contact-row:last-child {
  margin-bottom: 0;
}

.contact-label {
  flex: 0 0 150px;
  font-weight: 500;
  color: var(--color-text-light);
}

.contact-value {
  flex: 1;
  color: var(--color-heading);
}

/* 반응형 스타일 */
@media (max-width: 900px) {
  .privacy-content {
    grid-template-columns: 1fr;
  }

  .privacy-nav {
    position: static;
    max-height: none;
  }

  .contact-row {
    flex-direction: column;
  }

  .contact-label {
    margin-bottom: 0.25rem;
  }
}
</style>
