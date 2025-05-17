import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ConsultationView from '../views/ConsultationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/consultation',
      name: 'consultation',
      component: ConsultationView,
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/claim',
      name: 'claim',
      component: () => import('../views/ClaimView.vue'),
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../views/MyPageView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FAQView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('../views/UserOnboardingView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchResultView.vue'),
    },
  ],
})

// 온보딩 여부 확인 후 리다이렉트
router.beforeEach((to, from, next) => {
  // 온보딩이 필요한지 확인 (로컬 스토리지에 사용자 정보 존재 여부)
  const userProfileExists = localStorage.getItem('userProfile') !== null

  // 온보딩 페이지로 가는 경우 또는 이미 유저 정보가 있는 경우는 그대로 진행
  if (to.name === 'onboarding' || userProfileExists) {
    next()
    return
  }

  // 첫 방문자이고 '/' 외의 다른 페이지로 접근 시도 시 먼저 온보딩으로 리다이렉션
  if (to.path !== '/') {
    next({ name: 'onboarding' })
    return
  }

  next()
})

export default router
