<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

// 다크모드 토글
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
const route = useRoute()
const showPageTransition = ref(false)

// 페이지 전환 애니메이션
watch(
  () => route.path,
  () => {
    showPageTransition.value = true
    setTimeout(() => {
      showPageTransition.value = false
    }, 800)
  },
)

// 다크모드 전환
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
}

onMounted(() => {
  // 초기 다크모드 설정
  document.documentElement.classList.toggle('dark-mode', isDarkMode.value)
})
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="noise-overlay"></div>
    <div class="glass-panel"></div>

    <header class="app-header">
      <div class="logo-container">
        <div class="logo-shape"></div>
        <h1 class="app-name">SecureLife</h1>
      </div>

      <nav class="main-nav">
        <RouterLink to="/" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon home-icon"></span>
            <span class="nav-text">홈</span>
          </div>
        </RouterLink>

        <RouterLink to="/products" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon products-icon"></span>
            <span class="nav-text">보험상품</span>
          </div>
        </RouterLink>

        <RouterLink to="/claim" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon claim-icon"></span>
            <span class="nav-text">보험금청구</span>
          </div>
        </RouterLink>

        <RouterLink to="/consultation" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon consultation-icon"></span>
            <span class="nav-text">상담</span>
          </div>
        </RouterLink>

        <RouterLink to="/mypage" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon mypage-icon"></span>
            <span class="nav-text">마이페이지</span>
          </div>
        </RouterLink>

        <RouterLink to="/about" custom v-slot="{ navigate, isActive }">
          <div @click="navigate" :class="['nav-item', { active: isActive }]">
            <span class="nav-icon about-icon"></span>
            <span class="nav-text">회사소개</span>
          </div>
        </RouterLink>

        <button class="theme-toggle" @click="toggleDarkMode" aria-label="테마 전환">
          <span class="theme-icon" :class="isDarkMode ? 'sun-icon' : 'moon-icon'"></span>
        </button>
      </nav>
    </header>

    <main class="app-content">
      <transition name="page-transition" mode="out-in">
        <RouterView />
      </transition>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>SecureLife 보험</h3>
          <p>고객 중심의 혁신적인 보험 서비스</p>
          <div class="social-links">
            <a href="#" class="social-icon facebook"></a>
            <a href="#" class="social-icon twitter"></a>
            <a href="#" class="social-icon instagram"></a>
          </div>
        </div>

        <div class="footer-section links">
          <h4>빠른 링크</h4>
          <RouterLink to="/privacy">개인정보처리방침</RouterLink>
          <RouterLink to="/terms">이용약관</RouterLink>
          <RouterLink to="/faq">자주 묻는 질문</RouterLink>
        </div>

        <div class="footer-section contact">
          <h4>고객센터</h4>
          <p>1588-1234</p>
          <p>평일 09:00-18:00</p>
          <p>contact@securelife.com</p>
        </div>
      </div>

      <div class="copyright">
        <p>&copy; 2025 SecureLife 보험. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  /* 기본 테마 - 파스텔톤 */
  --color-primary: #8a9cf5; /* 파스텔 보라색 */
  --color-primary-light: #adb8ff;
  --color-primary-dark: #707bc9;
  --color-secondary: #6ed9e5; /* 파스텔 하늘색 */
  --color-secondary-light: #9eeaf2;
  --color-accent: #ffc178; /* 파스텔 주황색 */
  --color-success: #87e5b2; /* 파스텔 녹색 */
  --color-warning: #ffd76e; /* 파스텔 노란색 */
  --color-danger: #ff9f9f; /* 파스텔 빨간색 */

  --color-background: #fafbff;
  --color-background-soft: #f5f7fe;
  --color-background-mute: #eef1fc;
  --color-surface: #ffffff;
  --color-surface-soft: #fafbff;

  --color-heading: #3d4368;
  --color-text: #4f546e;
  --color-text-light: #7d8199;
  --color-border: #e6eaff;

  --gradient-primary: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  --gradient-secondary: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
  --gradient-accent: linear-gradient(135deg, var(--color-accent), #ffcf9e);

  --color-primary-soft: rgba(138, 156, 245, 0.15); /* 파스텔 보라색 배경 */

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  --shadow-neumorphic:
    8px 8px 16px rgba(174, 174, 192, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.8);
  --shadow-neumorphic-inset:
    inset 6px 6px 12px rgba(174, 174, 192, 0.2), inset -6px -6px 12px rgba(255, 255, 255, 0.25);

  --blur-glass: 20px;
  --opacity-glass: 0.7;

  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
  --border-radius-xl: 1.5rem;
  --border-radius-full: 9999px;

  --font-family-sans:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Pretendard', 'Roboto', sans-serif;
  --font-family-heading: 'Pretendard', -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Menlo', monospace;

  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.5s ease;

  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
}

:root.dark-mode {
  --color-primary: #8a9cf5; /* 파스텔 보라색 유지 */
  --color-primary-light: #adb8ff;
  --color-primary-dark: #707bc9;

  --color-background: #242638; /* 어두운 파스텔 배경 */
  --color-background-soft: #2d2f42;
  --color-background-mute: #363a53;
  --color-surface: #2d2f42;
  --color-surface-soft: #363a53;

  --color-heading: #f0f2ff;
  --color-text: #d4daf0;
  --color-text-light: #b0b6d1;
  --color-border: #4e5373;

  --shadow-neumorphic: 8px 8px 16px rgba(20, 22, 36, 0.6), -8px -8px 16px rgba(56, 58, 83, 0.2);
  --shadow-neumorphic-inset:
    inset 6px 6px 12px rgba(20, 22, 36, 0.4), inset -6px -6px 12px rgba(56, 58, 83, 0.1);
}

@font-face {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 400;
  src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2')
    format('woff2');
}

@font-face {
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2')
    format('woff2');
}

/* Global Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  position: relative;
}

html,
body {
  height: 100%;
  width: 100%;
}

body {
  font-family: var(--font-family-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);
  overflow-x: hidden;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* App Layout */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=');
  pointer-events: none;
  z-index: -1;
}

.glass-panel {
  top: 0;
  left: 0;
  width: 100%;
  background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.15), transparent 70%);
  background-size: 200% 200%;
  animation: pulse 15s ease infinite alternate;
}

@keyframes pulse {
  0%,
  100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}

/* Header */
.app-header {
  padding: 1rem 2rem;
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  background: rgba(255, 255, 255, var(--opacity-glass));
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  position: sticky;
  top: 0;
  transition: all var(--transition-normal);
}

.dark-mode .app-header {
  background: rgba(17, 24, 39, var(--opacity-glass));
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-shape {
  width: 32px;
  height: 32px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-md);
  position: relative;
  transform: rotate(45deg);
  transition: transform var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.logo-shape::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: var(--shadow-neumorphic-inset);
}

.logo-shape:hover {
  transform: rotate(135deg);
}

.app-name {
  font-family: var(--font-family-heading);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin: 0;
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Navigation */
.main-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text-light);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: var(--gradient-primary);
  transition: width var(--transition-normal);
  border-radius: var(--border-radius-full);
}

.nav-item:hover,
.nav-item.active {
  color: var(--color-primary);
}

.nav-item:hover::before,
.nav-item.active::before {
  width: 50%;
}

.nav-item.active {
  box-shadow: var(--shadow-neumorphic);
  background-color: var(--color-surface);
}

.dark-mode .nav-item.active {
  background-color: var(--color-surface);
  box-shadow: var(--shadow-neumorphic);
}

.nav-icon {
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  position: relative;
}

.nav-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Home icon */
.home-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>');
}

/* Products icon */
.products-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>');
}

/* Claim icon */
.claim-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>');
}

/* Consultation icon */
.consultation-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>');
}

/* Mypage icon */
.mypage-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>');
}

/* About icon */
.about-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>');
}

/* 다크모드에서 헤더 아이콘 색상 변경 */
.dark-mode .home-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>');
}

.dark-mode .products-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>');
}

.dark-mode .claim-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>');
}

.dark-mode .consultation-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>');
}

.dark-mode .mypage-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>');
}

.dark-mode .about-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>');
}

/* Main content */
.app-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Footer */
.app-footer {
  background-color: var(--color-background-soft);
  color: var(--color-text-light);
  padding: 3rem 2rem 1.5rem;
  margin-top: 4rem;
  position: relative;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.footer-section h4 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.footer-section p {
  margin-bottom: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background-color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.social-icon:hover {
  transform: translateY(-5px);
  background-color: var(--color-primary);
}

.footer-section.links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-section.links a {
  color: var(--color-text-light);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-section.links a:hover {
  color: var(--color-primary);
}

.copyright {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.875rem;
}

/* Page transition animations */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.5s var(--easing-decelerate);
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive layout */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    padding: 1rem;
  }

  .logo-container {
    margin-bottom: 1rem;
  }

  .main-nav {
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .nav-item {
    padding: 0.5rem;
  }

  .nav-text {
    font-size: 0.7rem;
  }

  .theme-toggle {
    margin-top: 0.5rem;
  }

  .app-content {
    padding: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}

/* Animation Keyframes */
@keyframes rotateIn {
  from {
    transform: rotate(-180deg);
    opacity: 0;
  }
  to {
    transform: rotate(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Utility Classes */
.text-gradient {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-neumorphic {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-neumorphic);
  transition:
    transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.card-neumorphic:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
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
  transition: all var(--transition-normal);
  box-shadow: 0 4px 0 var(--color-primary-dark);
  position: relative;
  top: 0;
}

.button-3d:hover {
  top: -2px;
  box-shadow: 0 6px 0 var(--color-primary-dark);
}

.button-3d:active {
  top: 4px;
  box-shadow: 0 0 0 var(--color-primary-dark);
}

.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dark-mode .glass-card {
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-toggle {
  border: none;
  background: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background-soft);
  box-shadow: var(--shadow-neumorphic);
  transition: all var(--transition-normal);
  margin-left: 1rem;
}

.theme-toggle:hover {
  transform: scale(1.05);
}

.theme-toggle:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-neumorphic-inset);
}

.theme-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  transition: transform var(--transition-slow);
}

.sun-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="gold"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>');
  animation: rotateIn var(--transition-slow) ease both;
}

.moon-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>');
  animation: rotateIn var(--transition-slow) ease both;
}

.dark-mode .moon-icon {
  filter: brightness(1.5);
}
</style>
