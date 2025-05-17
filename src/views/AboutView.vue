<script setup lang="ts">
// About 페이지 컴포넌트
</script>

<template>
  <div class="about">
    <h1>Auto UX 프로젝트 소개</h1>

    <div class="about-content">
      <section class="about-section">
        <h2>인공지능으로 향상되는 사용자 경험</h2>
        <p>
          Auto UX 프로젝트는 인공지능 기술을 활용하여 사용자 경험(UX)을 향상시키는 플랫폼입니다.
          저희는 사용자 의도를 자연어로 이해하고, 원하는 정보와 서비스를 즉각적으로 제공하는
          직관적인 인터페이스를 구축합니다.
        </p>
      </section>

      <section class="about-section">
        <h2>주요 기능</h2>
        <ul class="feature-list">
          <li>
            <strong>자연어 인식 내비게이션</strong>
            <p>
              사용자가 원하는 것을 자연스럽게 입력하면, AI가 이를 이해하고 적절한 페이지로
              안내합니다.
            </p>
          </li>
          <li>
            <strong>적응형 인터페이스</strong>
            <p>
              사용자의 행동 패턴에 따라 UI가 자동으로 최적화되어 더 나은 사용자 경험을 제공합니다.
            </p>
          </li>
          <li>
            <strong>손쉬운 통합</strong>
            <p>기존 웹사이트나 애플리케이션에 쉽게 통합하여 사용자 경험을 향상시킬 수 있습니다.</p>
          </li>
        </ul>
      </section>

      <section class="about-section">
        <h2>기술 스택</h2>
        <div class="tech-stack">
          <div class="tech-item">Vue.js</div>
          <div class="tech-item">TypeScript</div>
          <div class="tech-item">Pinia</div>
          <div class="tech-item">Vite</div>
          <div class="tech-item">자연어 처리 ML</div>
        </div>
      </section>

      <section class="about-section">
        <h2>우리 팀</h2>
        <p>
          저희는 AI, UX/UI 디자인, 웹 개발 분야의 전문가들로 구성된 팀으로, 사용자 중심의 혁신적인
          서비스를 개발하기 위해 노력하고 있습니다.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-heading);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.about-section {
  margin-bottom: 1.5rem;
}

.about-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-list li {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-list li strong {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.tech-item {
  background-color: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>
