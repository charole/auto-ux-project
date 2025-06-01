// Backend API 연동을 위한 서비스
export class BffService {
  private apiBaseUrl: string
  private userProfile: Record<string, unknown> | null = null

  constructor() {
    // Backend API URL 설정
    this.apiBaseUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000'

    // 로컬 스토리지에서 사용자 프로필 로드
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      try {
        this.userProfile = JSON.parse(storedProfile)
      } catch (e) {
        console.error('Failed to parse user profile from localStorage', e)
      }
    }
  }

  // 사용자 프로필 설정
  public setUserProfile(profile: Record<string, unknown>): void {
    this.userProfile = profile
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }

  // 동적 UI 생성 요청 - 백엔드 API와 매칭
  public async generateDynamicUI(
    pageType: string,
    userId?: string,
    productId?: string,
    customRequirements?: string,
  ): Promise<DynamicUIResponse> {
    try {
      const params = new URLSearchParams({
        page_type: pageType,
        ...(userId && { user_id: userId }),
        ...(productId && { product_id: productId }),
        ...(customRequirements && { user_query: customRequirements }),
      })

      // 🚀 스마트 AI Agent 엔드포인트 호출 (GET 방식)
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/generate-ui?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`스마트 API 호출 실패: ${response.status}`)
      }

      const data = await response.json()
      console.log('🤖 BFF 스마트 AI 응답:', data.ai_generated ? 'AI Agent 활성' : '일반 모드')
      return this.convertToUIResponse(data)
    } catch (error) {
      console.error('🚀 스마트 Dynamic UI 생성 실패:', error)
      return this.generateFallbackUI(pageType)
    }
  }

  // 보험 상품 목록 조회 - 백엔드 API와 매칭
  public async getInsuranceProducts(
    category?: string,
    limit: number = 20,
  ): Promise<APIResponse<Product[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(category && { category }),
      })

      // 백엔드 실제 엔드포인트: /api/v1/ux/products
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/products?${params}`)

      if (!response.ok) {
        throw new Error(`상품 조회 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('보험 상품 조회 실패:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      }
    }
  }

  // 보험 카테고리 조회 - 백엔드 API와 매칭
  public async getInsuranceCategories(): Promise<APIResponse<Category[]>> {
    try {
      // 백엔드 실제 엔드포인트: /api/v1/ux/categories
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/categories`)

      if (!response.ok) {
        throw new Error(`카테고리 조회 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('보험 카테고리 조회 실패:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      }
    }
  }

  // 헬스체크 - 백엔드 API와 매칭
  public async healthCheck(): Promise<boolean> {
    try {
      // 백엔드 실제 엔드포인트: /api/v1/ux/health
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/health`)
      const data = await response.json()
      return data.status === 'healthy'
    } catch (error) {
      console.error('헬스체크 실패:', error)
      return false
    }
  }

  // 통합 검색 기능 - 새로운 백엔드 검색 API 활용
  public async searchContent(
    query: string,
    limit: number = 20,
    includeProducts: boolean = true,
    includeFaqs: boolean = true,
    includeTestimonials: boolean = true,
  ): Promise<APIResponse<SearchResults>> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        include_products: includeProducts.toString(),
        include_faqs: includeFaqs.toString(),
        include_testimonials: includeTestimonials.toString(),
      })

      // 백엔드 실제 엔드포인트: /api/v1/ux/search
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/search?${params}`)

      if (!response.ok) {
        throw new Error(`검색 실패: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: data.success,
        data: data.data,
        total: data.total_results,
        error: data.success ? undefined : '검색 중 오류가 발생했습니다.',
      }
    } catch (error) {
      console.error('검색 실패:', error)
      return {
        success: false,
        data: {
          products: [],
          faqs: [],
          testimonials: [],
        },
        error: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.',
      }
    }
  }

  // FAQ 목록 조회 - 백엔드 API와 매칭
  public async getFAQs(category?: string): Promise<APIResponse<FAQ[]>> {
    try {
      const params = new URLSearchParams()
      if (category) {
        params.append('category', category)
      }

      // 백엔드 실제 엔드포인트: /api/v1/ux/faqs
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/faqs?${params}`)

      if (!response.ok) {
        throw new Error(`FAQ 조회 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('FAQ 조회 실패:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'FAQ 조회 중 오류가 발생했습니다.',
      }
    }
  }

  // 고객 후기 조회 - 백엔드 API와 매칭
  public async getCustomerTestimonials(
    productId?: string,
    limit: number = 20,
  ): Promise<APIResponse<Testimonial[]>> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      })

      if (productId) {
        params.append('product_id', productId)
      }

      // 백엔드 실제 엔드포인트: /api/v1/ux/testimonials
      const response = await fetch(`${this.apiBaseUrl}/api/v1/ux/testimonials?${params}`)

      if (!response.ok) {
        throw new Error(`고객 후기 조회 실패: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('고객 후기 조회 실패:', error)
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : '고객 후기 조회 중 오류가 발생했습니다.',
      }
    }
  }

  // 사용자 보험 가입 정보 조회 (미구현 - 백엔드에 엔드포인트 없음)
  public async getUserPolicies(userId: string): Promise<APIResponse<Policy[]>> {
    console.warn('getUserPolicies: 백엔드에 해당 엔드포인트가 없습니다.')
    return {
      success: false,
      data: [],
      error: '해당 기능은 아직 구현되지 않았습니다.',
    }
  }

  // 사용자 청구 내역 조회 (미구현 - 백엔드에 엔드포인트 없음)
  public async getUserClaims(userId: string): Promise<APIResponse<Claim[]>> {
    console.warn('getUserClaims: 백엔드에 해당 엔드포인트가 없습니다.')
    return {
      success: false,
      data: [],
      error: '해당 기능은 아직 구현되지 않았습니다.',
    }
  }

  // 레거시 호환성을 위한 메서드 - 검색 결과로 응답 생성
  public async processUserQuery(query: string): Promise<BffResponse> {
    try {
      // 새로운 검색 API를 사용하여 결과 생성
      const searchResults = await this.searchContent(query, 10, true, true, true)

      if (!searchResults.success) {
        throw new Error(searchResults.error || '검색 실패')
      }

      // 검색 결과를 BffResponse 형식으로 변환
      const answer = this.generateAnswerFromSearchResults(query, searchResults.data)
      const recommendedPath = this.getRecommendedPathFromSearchResults(searchResults.data)

      return {
        answer,
        recommendedPath,
        confidence: this.calculateSearchConfidence(searchResults.data),
        contentType: 'search_results',
        hasLinks: true,
        components: this.generateComponentsFromSearchResults(searchResults.data),
        searchResults: searchResults.data,
      }
    } catch (error) {
      console.error('Query 처리 실패:', error)

      // 기존 방식으로 폴백
      try {
        const pageType = this.inferPageTypeFromQuery(query)
        const result = await this.generateDynamicUI(pageType, undefined, undefined, query)

        return {
          answer: this.generateAnswerFromComponents(result.components),
          recommendedPath: this.getRecommendedPathFromPageType(pageType),
          confidence: 0.6,
          contentType: 'dynamic_ui',
          hasLinks: true,
          components: result.components,
        }
      } catch (fallbackError) {
        return {
          answer: `죄송합니다, 요청을 처리하는 중 오류가 발생했습니다. ${error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'}`,
          recommendedPath: null,
          confidence: 0,
          contentType: 'error',
          hasLinks: false,
          components: [],
        }
      }
    }
  }

  // 검색 결과로부터 답변 생성
  private generateAnswerFromSearchResults(query: string, results: SearchResults): string {
    const { products, faqs, testimonials } = results
    const totalResults = products.length + faqs.length + testimonials.length

    if (totalResults === 0) {
      return `'${query}'에 대한 검색 결과를 찾을 수 없습니다. 다른 검색어를 시도해보세요.`
    }

    let answer = `'${query}'에 대한 검색 결과입니다.\n\n`

    // 보험 상품 결과
    if (products.length > 0) {
      answer += `**관련 보험 상품 (${products.length}개)**\n`
      products.slice(0, 3).forEach((product, index) => {
        answer += `${index + 1}. **${product.name}**\n`
        answer += `   ${product.description}\n`
        answer += `   보험료: ${product.base_price?.toLocaleString()}원/월\n\n`
      })
    }

    // FAQ 결과
    if (faqs.length > 0) {
      answer += `**관련 FAQ (${faqs.length}개)**\n`
      faqs.slice(0, 2).forEach((faq, index) => {
        answer += `${index + 1}. **${faq.question}**\n`
        answer += `   ${faq.answer.substring(0, 100)}...\n\n`
      })
    }

    // 고객 후기 결과
    if (testimonials.length > 0) {
      answer += `**고객 후기 (${testimonials.length}개)**\n`
      testimonials.slice(0, 2).forEach((testimonial, index) => {
        answer += `${index + 1}. **${testimonial.title}** (⭐${testimonial.rating}/5)\n`
        answer += `   ${testimonial.content.substring(0, 80)}...\n\n`
      })
    }

    return answer
  }

  // 검색 결과로부터 추천 경로 생성
  private getRecommendedPathFromSearchResults(results: SearchResults): string | null {
    const { products, faqs } = results

    if (products.length > 0) {
      return '/products'
    }

    if (faqs.length > 0) {
      return '/faq'
    }

    return null
  }

  // 검색 신뢰도 계산
  private calculateSearchConfidence(results: SearchResults): number {
    const totalResults = results.products.length + results.faqs.length + results.testimonials.length

    if (totalResults === 0) return 0
    if (totalResults >= 5) return 0.9
    if (totalResults >= 3) return 0.7
    if (totalResults >= 1) return 0.5

    return 0.3
  }

  // 검색 결과로부터 UI 컴포넌트 생성
  private generateComponentsFromSearchResults(results: SearchResults): UIComponent[] {
    const components: UIComponent[] = []

    // 상품 결과 컴포넌트
    if (results.products.length > 0) {
      components.push({
        type: 'product_list',
        id: 'search_products',
        title: `관련 보험 상품 (${results.products.length}개)`,
        content: '검색어와 관련된 보험 상품들입니다.',
        data: { products: results.products.slice(0, 6) },
        style:
          'background: #f8f9ff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #4f46e5;',
        priority: 1,
      })
    }

    // FAQ 결과 컴포넌트
    if (results.faqs.length > 0) {
      components.push({
        type: 'faq_list',
        id: 'search_faqs',
        title: `관련 FAQ (${results.faqs.length}개)`,
        content: '자주 묻는 질문들을 확인해보세요.',
        data: { faqs: results.faqs.slice(0, 5) },
        style:
          'background: #f0f9ff; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #0ea5e9;',
        priority: 2,
      })
    }

    // 후기 결과 컴포넌트
    if (results.testimonials.length > 0) {
      components.push({
        type: 'testimonial_list',
        id: 'search_testimonials',
        title: `고객 후기 (${results.testimonials.length}개)`,
        content: '실제 고객들의 생생한 후기를 확인해보세요.',
        data: { testimonials: results.testimonials.slice(0, 4) },
        style:
          'background: #f0fdf4; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #10b981;',
        priority: 3,
      })
    }

    return components
  }

  // AI 응답 개선 메서드 (SearchResultView.vue에서 사용)
  public enhanceAIResponse(response: BffResponse): BffResponse {
    try {
      // 응답 개선 로직
      const enhancedAnswer = this.enhanceAnswerText(response.answer)
      const enhancedComponents =
        response.components?.map((comp) => this.enhanceComponent(comp)) || []

      return {
        ...response,
        answer: enhancedAnswer,
        components: enhancedComponents,
        hasLinks: this.detectLinks(enhancedAnswer),
        uiSuggestions: this.generateUIEnhancements(response),
      }
    } catch (error) {
      console.error('AI 응답 개선 실패:', error)
      return response // 원본 응답 반환
    }
  }

  // 답변 텍스트 개선
  private enhanceAnswerText(answer: string): string {
    if (!answer) return answer

    let enhanced = answer

    // 마크다운 링크 처리
    enhanced = enhanced.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    )

    // 강조 텍스트 처리
    enhanced = enhanced.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    enhanced = enhanced.replace(/\*([^*]+)\*/g, '<em>$1</em>')

    // 줄바꿈 처리
    enhanced = enhanced.replace(/\n\n/g, '</p><p>')
    enhanced = enhanced.replace(/\n/g, '<br>')

    // 문단 태그로 감싸기
    if (!enhanced.startsWith('<p>')) {
      enhanced = `<p>${enhanced}</p>`
    }

    return enhanced
  }

  // 컴포넌트 개선
  private enhanceComponent(component: UIComponent): UIComponent {
    return {
      ...component,
      title: this.enhanceText(component.title),
      content: this.enhanceText(component.content),
    }
  }

  // 텍스트 개선 (기본적인 마크다운 처리)
  private enhanceText(text: string): string {
    if (!text) return text

    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  }

  // 링크 감지
  private detectLinks(text: string): boolean {
    const linkRegex = /(https?:\/\/[^\s]+)|(<a[^>]*>)/i
    return linkRegex.test(text)
  }

  // UI 개선사항 생성
  private generateUIEnhancements(response: BffResponse): BffResponse['uiSuggestions'] {
    return {
      fontSize: response.confidence > 0.7 ? 'medium' : 'large',
      contrast: 'high',
      simplicity: response.contentType === 'error' ? 'minimal' : 'standard',
      interactionMethod: 'touch',
    }
  }

  // 마크다운 링크를 HTML로 변환 (AIResponse.vue에서 사용)
  public convertMarkdownLinksToHtml(content: string): string {
    if (!content) return content

    let processed = content

    // 마크다운 링크 [텍스트](URL) → HTML 링크
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="adaptive-link">$1</a>',
    )

    // 일반 URL을 링크로 변환
    processed = processed.replace(
      /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="adaptive-link">$1</a>',
    )

    // 강조 문법 처리
    processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    processed = processed.replace(/\*([^*]+)\*/g, '<em>$1</em>')

    // 줄바꿈 처리
    processed = processed.replace(/\n\n/g, '</p><p>')
    processed = processed.replace(/\n/g, '<br>')

    // 문단 태그로 감싸기 (이미 HTML 태그가 없을 때만)
    if (!processed.includes('<p>') && !processed.includes('<div>')) {
      processed = `<p>${processed}</p>`
    }

    return processed
  }

  // 컴포넌트를 답변 텍스트로 변환
  private generateAnswerFromComponents(components: UIComponent[]): string {
    if (!components || components.length === 0) {
      return '요청하신 정보를 준비하고 있습니다.'
    }

    const answers = components
      .map((comp) => {
        switch (comp.type) {
          case 'hero_section':
            return `${comp.title}: ${comp.content}`
          case 'product_card':
            return `추천 상품: ${comp.title} - ${comp.content}`
          case 'notice':
            return `안내: ${comp.content}`
          case 'faq_item':
            return `Q: ${comp.title}\nA: ${comp.content}`
          default:
            return comp.content || comp.title || ''
        }
      })
      .filter(Boolean)

    return answers.join('\n\n')
  }

  // 쿼리에서 페이지 타입 추론
  private inferPageTypeFromQuery(query: string): string {
    const queryLower = query.toLowerCase()

    if (queryLower.includes('상품') || queryLower.includes('보험')) {
      return 'products'
    } else if (queryLower.includes('청구') || queryLower.includes('보험금')) {
      return 'claim'
    } else if (
      queryLower.includes('내') ||
      queryLower.includes('계약') ||
      queryLower.includes('가입')
    ) {
      return 'mypage'
    } else if (queryLower.includes('상담') || queryLower.includes('문의')) {
      return 'consultation'
    } else if (queryLower.includes('질문') || queryLower.includes('faq')) {
      return 'faq'
    }

    return 'home'
  }

  // 페이지 타입에서 추천 경로 생성
  private getRecommendedPathFromPageType(pageType: string): string | null {
    const pathMap: Record<string, string> = {
      home: '/',
      products: '/products',
      claim: '/claim',
      mypage: '/mypage',
      consultation: '/consultation',
      faq: '/faq',
    }

    return pathMap[pageType] || null
  }

  // Backend 응답을 UI 응답으로 변환
  private convertToUIResponse(backendResponse: any): DynamicUIResponse {
    return {
      success: true,
      components: backendResponse.components || [],
      layout: backendResponse.layout || { type: 'stack', spacing: 'medium' },
      accessibility: backendResponse.accessibility || { high_contrast: false, large_text: false },
      metadata: backendResponse.metadata || {},
      error: null,
    }
  }

  // 폴백 UI 생성
  private generateFallbackUI(pageType: string): DynamicUIResponse {
    const fallbackComponents: UIComponent[] = [
      {
        type: 'notice',
        id: 'fallback',
        title: '잠시만 기다려주세요',
        content: '데이터를 불러오는 중입니다. 잠시만 기다려주세요.',
        data: {},
        style: 'info',
        priority: 1,
      },
    ]

    return {
      success: false,
      components: fallbackComponents,
      layout: { type: 'stack', spacing: 'medium' },
      accessibility: { high_contrast: false, large_text: false },
      metadata: { fallback: true, pageType },
      error: '일시적 오류가 발생했습니다.',
    }
  }
}

// 타입 정의들
export interface DynamicUIResponse {
  success: boolean
  components: UIComponent[]
  layout: {
    type: string
    spacing: string
    columns?: number
  }
  accessibility: {
    high_contrast: boolean
    large_text: boolean
    simplified_layout?: boolean
  }
  metadata: Record<string, any>
  error: string | null
}

export interface UIComponent {
  type: string
  id: string
  title: string
  content: string
  data: Record<string, any>
  style: string
  priority: number
}

export interface APIResponse<T> {
  success: boolean
  data: T
  total?: number
  error?: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string
  features: string[]
  base_price: number
  max_coverage: number
  age_limit_min: number
  age_limit_max: number
  tags: string[]
  is_popular: boolean
  is_new: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon_url: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Policy {
  id: string
  user_id: string
  product_id: string
  policy_number: string
  status: string
  start_date: string
  end_date: string | null
  premium_amount: number
  coverage_amount: number
  beneficiary_name: string
  created_at: string
  updated_at: string
}

export interface Claim {
  id: string
  user_id: string
  policy_id: string
  claim_number: string
  claim_type: string
  status: string
  claim_amount: number
  approved_amount: number | null
  description: string
  documents: string[]
  submitted_at: string
  reviewed_at: string | null
  processed_at: string | null
  created_at: string
}

export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  keywords: string[]
  view_count: number
  is_popular: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  user_id: string
  product_id: string
  rating: number
  title: string
  content: string
  is_featured: boolean
  is_verified: boolean
  created_at: string
  // 검색 결과에서 조인된 데이터
  users?: {
    name: string
  }
  insurance_products?: {
    name: string
    insurance_categories?: {
      name: string
    }
  }
}

// 레거시 호환성을 위한 기존 인터페이스
export interface BffResponse {
  answer: string
  recommendedPath: string | null
  confidence: number
  contentType: string
  hasLinks: boolean
  components?: UIComponent[]
  searchResults?: SearchResults
  uiSuggestions?: {
    fontSize: string
    contrast: string
    simplicity: string
    interactionMethod: string
  }
}

// 검색 결과 타입 정의
export interface SearchResults {
  products: Product[]
  faqs: FAQ[]
  testimonials: Testimonial[]
}
