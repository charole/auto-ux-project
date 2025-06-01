import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

// 키워드와 경로 매핑 타입 정의
interface RouteMapping {
  keywords: string[]
  route: string
  description: string
}

// 결과 메시지 타입 정의
interface ResultMessage {
  type: 'success' | 'info' | 'warning' | 'error'
  text: string
}

export interface QueryHistoryItem {
  query: string
  response: string
  timestamp: string
}

// 검색 결과 히스토리 아이템 타입 정의
export interface SearchHistoryItem {
  query: string
  timestamp: string
  result: import('../services/BffService').BffResponse
}

// 웹사이트 페이지 타입 정의
export interface WebsitePage {
  path: string
  title: string
  description: string
  keywords: string[]
}

// 사용자 프로필 타입 정의
interface UserProfile {
  name?: string
  age?: number
  digitalProficiency?: 'low' | 'medium' | 'high'
  preferences?: {
    fontSize?: string
    contrast?: string
    interactionMethod?: string
  }
  [key: string]: unknown
}

export const useAINavigatorStore = defineStore('aiNavigator', () => {
  const router = useRouter()
  const userInput = ref('')
  const isProcessing = ref(false)
  const lastProcessedInput = ref('')
  const matchResult = ref<{ route: string; confidence: number } | null>(null)
  const resultMessage = ref<ResultMessage | null>(null)
  const suggestions = ref<string[]>([])
  const queryHistory = ref<QueryHistoryItem[]>([])
  const searchHistory = ref<SearchHistoryItem[]>([])
  const userProfile = ref<UserProfile | null>(null)

  // 웹사이트 페이지 정보
  const websitePages: WebsitePage[] = [
    {
      path: '/products',
      title: '보험 상품',
      description: '생명보험, 건강보험, 암보험, 자동차보험 등 다양한 보험 상품 정보',
      keywords: ['보험', '상품', '생명', '건강', '암', '자동차', '보장', '보험료', '보험금'],
    },
    {
      path: '/claim',
      title: '보험금 청구',
      description: '보험금 청구 방법, 필요 서류, 청구 절차 및 보험금 지급 과정',
      keywords: ['청구', '보험금', '서류', '절차', '지급', '청구서', '신청'],
    },
    {
      path: '/mypage',
      title: '마이페이지',
      description: '계약 정보, 청구 내역, 개인정보 관리 등 사용자 계정 관리',
      keywords: ['계정', '내정보', '계약', '내역', '관리', '마이', '개인'],
    },
    {
      path: '/consultation',
      title: '상담 서비스',
      description: '보험 관련 전문 상담사와의 상담 예약 및 문의',
      keywords: ['상담', '문의', '질문', '예약', '전화', '상담사', '연락'],
    },
    {
      path: '/faq',
      title: '자주 묻는 질문',
      description: '보험 가입, 청구, 상품 관련 자주 묻는 질문과 답변',
      keywords: ['FAQ', '질문', '답변', '도움말', '자주', '문의'],
    },
    {
      path: '/about',
      title: '회사 소개',
      description: '회사 소개, 비전 및 미션, 연혁, 경영 철학',
      keywords: ['소개', '정보', '회사', '기업', '서비스', '어바웃', '비전', '미션'],
    },
    {
      path: '/',
      title: '홈',
      description: '메인 홈페이지',
      keywords: ['홈', '메인', '시작', '처음'],
    },
  ]

  // 키워드와 경로 매핑 (나중에 확장 가능)
  const routeMappings: RouteMapping[] = [
    {
      keywords: [
        '상담',
        '문의',
        '질문',
        '고객센터',
        '연락',
        '도움',
        '지원',
        '컨택',
        'contact',
        'help',
        'support',
        'consult',
      ],
      route: '/consultation',
      description: '상담 페이지에서는 문의사항을 등록하거나 직접 연락처를 확인할 수 있습니다.',
    },
    {
      keywords: [
        '소개',
        '정보',
        '회사',
        '기업',
        '서비스',
        '어바웃',
        'about',
        'info',
        'company',
        'service',
      ],
      route: '/about',
      description: '회사 소개 페이지에서는 저희 서비스와 비전에 대해 알아볼 수 있습니다.',
    },
    {
      keywords: ['홈', '메인', '처음', '시작', 'home', 'main', 'start'],
      route: '/',
      description: '메인 페이지로 이동합니다.',
    },
  ]

  // 사용자 입력을 처리하는 함수
  function processInput(input: string) {
    if (!input.trim()) {
      resultMessage.value = {
        type: 'warning',
        text: '검색어를 입력해주세요.',
      }
      return false
    }

    isProcessing.value = true
    userInput.value = input
    lastProcessedInput.value = input
    resultMessage.value = null
    suggestions.value = []

    try {
      const result = findBestMatch(input)
      matchResult.value = result

      if (result && result.confidence > 0.3) {
        // 충분한 신뢰도가 있을 때 라우팅
        const description = getRouteDescription(result.route)
        resultMessage.value = {
          type: 'success',
          text: `"${description}" 페이지로 이동합니다.`,
        }

        // 약간의 지연 후 라우팅 (사용자에게 피드백을 보여주기 위해)
        setTimeout(() => {
          router.push(result.route)
        }, 300)

        // 히스토리에 추가
        addToHistory({
          query: input,
          response: resultMessage.value?.text || '응답을 찾을 수 없습니다.',
          timestamp: new Date().toISOString(),
        })

        return true
      } else {
        // 추천 키워드 생성
        generateSuggestions(input)

        // 검색 결과 페이지로 이동
        router.push({
          path: '/search',
          query: { q: input },
        })

        resultMessage.value = {
          type: 'info',
          text: '검색 결과로 이동합니다.',
        }
        return true
      }
    } finally {
      isProcessing.value = false
    }
  }

  // 경로에 해당하는 페이지 정보 찾기
  function getPageByPath(path: string): WebsitePage | null {
    return websitePages.find((page) => page.path === path) || null
  }

  // 검색 히스토리에 추가
  function addSearchHistory(item: SearchHistoryItem) {
    searchHistory.value.unshift(item)

    // 최대 20개 항목만 저장
    if (searchHistory.value.length > 20) {
      searchHistory.value = searchHistory.value.slice(0, 20)
    }

    // 로컬 스토리지에 저장
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    } catch (e) {
      // 저장 실패 시 무시
    }
  }

  // 입력과 가장 일치하는 경로를 찾는 함수
  function findBestMatch(input: string): { route: string; confidence: number } | null {
    if (!input) return null

    const lowercaseInput = input.toLowerCase()
    let bestMatch = { route: '', confidence: 0 }

    routeMappings.forEach((mapping) => {
      const keywordsFound = mapping.keywords.filter((keyword) =>
        lowercaseInput.includes(keyword.toLowerCase()),
      )

      if (keywordsFound.length > 0) {
        // 간단한 신뢰도 점수 계산 (키워드 개수와 길이 기반)
        const confidence = Math.min(
          1,
          keywordsFound.length / 3 + // 키워드를 더 많이 포함할수록 높은 점수
            keywordsFound.reduce((acc, kw) => acc + kw.length, 0) / (input.length * 0.7), // 키워드가 입력의 더 많은 부분을 차지할수록 높은 점수
        )

        if (confidence > bestMatch.confidence) {
          bestMatch = { route: mapping.route, confidence }
        }
      }
    })

    return bestMatch.confidence > 0 ? bestMatch : null
  }

  // 입력과 관련된 추천 검색어 생성
  function generateSuggestions(input: string) {
    const allKeywords = routeMappings.flatMap((mapping) => mapping.keywords)
    const suggestionsSet = new Set<string>()

    // 간단한 검색어 추천 (포함된 단어 기반)
    for (const keyword of allKeywords) {
      if (
        keyword.length > 2 &&
        (input.toLowerCase().includes(keyword.substring(0, 2).toLowerCase()) ||
          keyword
            .toLowerCase()
            .includes(input.substring(0, Math.min(2, input.length)).toLowerCase()))
      ) {
        suggestionsSet.add(keyword)
      }
    }

    // 각 매핑에서 대표 키워드 추가
    routeMappings.forEach((mapping) => {
      if (suggestionsSet.size < 5) {
        suggestionsSet.add(mapping.keywords[0])
      }
    })

    suggestions.value = Array.from(suggestionsSet).slice(0, 5)
  }

  // 특정 경로에 대한 설명 가져오기
  function getRouteDescription(route: string): string {
    const mapping = routeMappings.find((m) => m.route === route)
    return mapping ? mapping.description : ''
  }

  // 히스토리에 쿼리 추가
  function addToHistory(item: QueryHistoryItem) {
    queryHistory.value.unshift(item)

    // 최대 20개 항목만 저장
    if (queryHistory.value.length > 20) {
      queryHistory.value = queryHistory.value.slice(0, 20)
    }
  }

  // 사용자 프로필 가져오기
  function getUserProfile() {
    // 로컬 스토리지에서 사용자 프로필 정보 가져오기
    if (!userProfile.value) {
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        try {
          userProfile.value = JSON.parse(storedProfile)
        } catch (e) {
          userProfile.value = null
        }
      }
    }
    return userProfile.value
  }

  // 스토어 초기화
  function reset() {
    userInput.value = ''
    lastProcessedInput.value = ''
    matchResult.value = null
    resultMessage.value = null
    suggestions.value = []
  }

  return {
    userInput,
    isProcessing,
    lastProcessedInput,
    matchResult,
    resultMessage,
    suggestions,
    queryHistory,
    searchHistory,
    processInput,
    getRouteDescription,
    addToHistory,
    getUserProfile,
    getPageByPath,
    addSearchHistory,
    reset,
  }
})
