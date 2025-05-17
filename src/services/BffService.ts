// OpenAI API 연동을 위한 서비스
export class BffService {
  private apiKey: string
  private apiEndpoint = 'https://api.openai.com/v1/chat/completions'
  private userProfile: Record<string, unknown> | null = null
  private model = 'gpt-3.5-turbo' // 기본 모델 설정

  // 웹사이트 구조 및 데이터 정보 (실제 데이터로 확장 필요)
  private websiteStructure = {
    pages: [
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
    ],
    products: [
      {
        id: 'life-insurance',
        name: '생명보험',
        description: '사망, 질병, 노후 등 다양한 위험에 대비하는 종합 생명보험 상품',
        features: ['사망보험금', '질병보장', '노후연금', '저축기능'],
      },
      {
        id: 'health-insurance',
        name: '건강보험',
        description: '입원, 수술, 진단비 등 다양한 의료 비용을 보장하는 건강보험 상품',
        features: ['입원비', '수술비', '진단비', '통원치료비'],
      },
      {
        id: 'cancer-insurance',
        name: '암보험',
        description: '암 진단, 치료, 수술 등 암 관련 비용을 특화하여 보장하는 상품',
        features: ['암진단비', '암수술비', '항암치료비', '입원비'],
      },
      {
        id: 'car-insurance',
        name: '자동차보험',
        description: '자동차 사고로 인한 피해와 책임을 보장하는 자동차 전용 보험',
        features: ['대인배상', '대물배상', '자기신체사고', '자기차량손해'],
      },
    ],
  }

  constructor() {
    // 환경 변수에서 API 키 가져오기
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''

    // API 키 확인
    if (!this.apiKey) {
      console.warn(
        'OpenAI API key is not set in environment variables (VITE_OPENAI_API_KEY). Using mock responses instead.',
      )
    }

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

  // 사용자 질의에 대한 맞춤형 응답 생성
  public async processUserQuery(query: string): Promise<BffResponse> {
    try {
      // API 키가 설정되지 않은 경우 개발용 응답 반환
      if (!this.apiKey) {
        console.warn('OpenAI API key not set. Using mock response.')
        return this.generateMockResponse(query)
      }

      // OpenAI API 호출을 위한 메시지 준비
      const messages = this.buildPrompt(query)

      // OpenAI API 호출
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI API Error:', errorData)

        // 할당량 초과 오류 확인
        if (errorData.error && errorData.error.code === 'insufficient_quota') {
          throw new Error('OpenAI API 할당량이 초과되었습니다. 결제 정보를 확인해주세요.')
        }

        throw new Error(`OpenAI API 호출 중 오류 발생: ${response.status}`)
      }

      const responseData = await response.json()
      const aiResponse = responseData.choices[0].message.content.trim()

      return this.parseAiResponse(aiResponse)
    } catch (error) {
      console.error('Error processing user query:', error)
      return {
        answer: `죄송합니다, 요청을 처리하는 중 오류가 발생했습니다. ${error instanceof Error ? error.message : '잠시 후 다시 시도해 주세요.'}`,
        recommendedPath: null,
        confidence: 0,
        contentType: 'error',
        hasLinks: false,
      }
    }
  }

  // 사용자 프로필과 질의를 포함한 프롬프트 생성
  private buildPrompt(query: string): Array<{ role: string; content: string }> {
    const messages = [
      {
        role: 'system',
        content: `당신은 SecureLife 보험회사의 AI 어시스턴트입니다. 사용자의 질문에 친절하게 답변해주고, 
                관련 페이지를 추천해주는 역할을 합니다.
                
                SecureLife 웹사이트 구조와 데이터:
                ${JSON.stringify(this.websiteStructure, null, 2)}
                
                응답은 반드시 다음 JSON 형식으로 반환해주세요:
                {
                  "answer": "사용자 질문에 대한 답변",
                  "recommendedPath": "추천 경로 (/products, /claim 등) 또는 null",
                  "confidence": 추천 신뢰도 (0-1 사이 숫자),
                  "contentType": "응답 유형 (text, json, html, error 중 하나)",
                  "uiSuggestions": {
                    "fontSize": "표준 | 크게 | 매우 크게",
                    "contrast": "표준 | 높음",
                    "simplicity": "표준 | 높음",
                    "interactionMethod": "표준 | 간편함"
                  }
                }
                
                가능한 recommendedPath:
                - /products : 보험 상품 관련 질문
                - /claim : 보험금 청구 관련 질문
                - /mypage : 사용자 정보 관련 질문
                - /consultation : 상담 관련 질문
                - /faq : 자주 묻는 질문
                - null : 명확한 경로가 없는 경우

                마크다운 링크 사용 지침:
                - 응답 내용에 관련 페이지를 언급할 때는 반드시 마크다운 링크 형식을 사용하세요: [링크텍스트](/경로)
                - 예시: "보험금 청구는 [청구 페이지](/claim)에서 가능합니다."
                - 모든 링크는 반드시 웹사이트 구조에 정의된 유효한 경로여야 합니다.
                
                UI/UX 개인화 지침:
                1. 고령 사용자(65세 이상) 또는 디지털 역량이 낮은 사용자:
                   - 큰 글자 크기 사용 ("크게" 또는 "매우 크게")
                   - 높은 대비 사용 ("높음")
                   - 간단한 UI 사용 ("높음")
                   - 명확한 상호작용 방식 제공 ("간편함")
                   - 링크에는 "클릭하세요", "여기를 누르세요" 같은 명확한 액션 텍스트 사용
                   - 가능한 한 많은 정보를 명시적으로 제공
                
                2. 일반 사용자(성인):
                   - 표준 글자 크기
                   - 보통 수준의 UI 복잡성
                   - 링크는 컨텍스트에 맞게 자연스럽게 배치
                
                3. 디지털 역량이 높은 사용자:
                   - 간결한 응답
                   - 전문 용어 사용 가능
                   - 효율적인 정보 전달
                
                응답 시 다음 요소를 항상 고려하여 개인화하세요:
                1. 사용자의 연령
                2. 디지털 역량 수준
                3. UI 선호도
                4. 이전 상호작용 패턴
                5. 특별한 요구사항(시각적 제약 등)
                
                링크 처리 우선순위:
                1. 사용자가 언급한 주제와 가장 관련있는 페이지 링크 제공
                2. 질문에서 언급하지 않았더라도 관련성 높은 추가 페이지 링크 제공
                3. 관련 상품 또는 서비스에 대한 링크 제공
                
                중요: 모든 응답은 사용자의 특성과 선호도에 최적화되어야 합니다. 사용자가 편안하고 효율적으로 정보를 얻을 수 있도록 하세요.`,
      },
    ]

    // 사용자 프로필이 있는 경우 컨텍스트에 추가 및 프로필 기반 맞춤 지침 생성
    if (this.userProfile) {
      // 기본 프로필 정보 추가
      messages.push({
        role: 'system',
        content: `사용자 정보: ${JSON.stringify(this.userProfile)}`,
      })

      // 사용자 특성에 따른 맞춤형 지침 생성
      const age = this.userProfile.age as number | undefined
      const digitalProficiency = this.userProfile.digitalProficiency as string | undefined
      const preferences = this.userProfile.preferences as Record<string, string> | undefined

      let personalizedInstructions = '사용자 맞춤 지침:\n'

      if (age !== undefined) {
        if (age >= 65) {
          personalizedInstructions +=
            '- 고령 사용자입니다. 명확하고 간단한 언어를 사용하고, 큰 글자와 명확한 액션을 제안하세요.\n'
          personalizedInstructions +=
            '- 링크는 "여기를 클릭하세요"와 같이 명확하게 표시하고 버튼 형태로 제공하는 것이 좋습니다.\n'
        } else if (age <= 30) {
          personalizedInstructions +=
            '- 젊은 사용자입니다. 간결하고 직관적인 정보 제공이 효과적입니다.\n'
        }
      }

      if (digitalProficiency) {
        if (digitalProficiency === 'low') {
          personalizedInstructions +=
            '- 디지털 역량이 낮은 사용자입니다. 기술 용어를 피하고 단계별 안내를 제공하세요.\n'
          personalizedInstructions +=
            '- 모든 액션은 명시적으로 설명하고, 여러 선택지보다는 명확한 하나의 경로를 제안하세요.\n'
        } else if (digitalProficiency === 'high') {
          personalizedInstructions +=
            '- 디지털 역량이 높은 사용자입니다. 효율적인 정보와 고급 옵션도 함께 제공할 수 있습니다.\n'
        }
      }

      if (preferences) {
        if (preferences.fontSize) {
          personalizedInstructions += `- 사용자가 선호하는 글자 크기: ${preferences.fontSize}\n`
        }
        if (preferences.contrast) {
          personalizedInstructions += `- 사용자가 선호하는 대비 수준: ${preferences.contrast}\n`
        }
        if (preferences.interactionMethod) {
          personalizedInstructions += `- 사용자가 선호하는 상호작용 방식: ${preferences.interactionMethod}\n`
        }
      }

      // 맞춤형 지침 추가
      messages.push({
        role: 'system',
        content: personalizedInstructions,
      })
    }

    // 사용자 질의 추가
    messages.push({
      role: 'user',
      content: query,
    })

    return messages
  }

  // AI 응답을 파싱하여 구조화된 응답으로 변환
  private parseAiResponse(aiResponse: string): BffResponse {
    try {
      // JSON 문자열을 객체로 파싱
      let jsonResponse

      // JSON 형식을 추출하기 위한 정규 표현식 패턴
      const jsonPattern = /\{[\s\S]*\}/
      const match = aiResponse.match(jsonPattern)

      if (match) {
        jsonResponse = JSON.parse(match[0])
      } else {
        throw new Error('JSON 형식을 찾을 수 없습니다')
      }

      // 마크다운 링크가 포함되어 있는지 확인하고 처리
      let answer = jsonResponse.answer || '응답을 처리할 수 없습니다.'

      // 응답에서 유효한 내부 경로 링크 확인 및 처리
      answer = this.processMarkdownLinks(answer)

      // UI 제안이 포함되어 있지 않은 경우 사용자 프로필 기반으로 기본 UI 설정
      let uiSuggestions = jsonResponse.uiSuggestions

      if (!uiSuggestions && this.userProfile) {
        uiSuggestions = this.generateUISuggestionsFromProfile(this.userProfile)
      } else if (!uiSuggestions) {
        uiSuggestions = {
          fontSize: '표준',
          contrast: '표준',
          simplicity: '표준',
          interactionMethod: '표준',
        }
      }

      return {
        answer: answer,
        recommendedPath: jsonResponse.recommendedPath || null,
        confidence: jsonResponse.confidence || 0,
        contentType: jsonResponse.contentType || 'text',
        uiSuggestions: uiSuggestions,
        hasLinks: this.containsMarkdownLinks(answer),
      }
    } catch (e) {
      // JSON 파싱 실패 시 원본 텍스트 반환
      console.error('Failed to parse AI response as JSON', e)

      // 마크다운 링크가 포함되어 있는지 확인하고 처리
      const processedResponse = this.processMarkdownLinks(aiResponse)

      // 기본 UI 제안 생성
      const uiSuggestions = this.userProfile
        ? this.generateUISuggestionsFromProfile(this.userProfile)
        : {
            fontSize: '표준',
            contrast: '표준',
            simplicity: '표준',
            interactionMethod: '표준',
          }

      return {
        answer: processedResponse,
        recommendedPath: null,
        confidence: 0,
        contentType: 'text',
        uiSuggestions: uiSuggestions,
        hasLinks: this.containsMarkdownLinks(processedResponse),
      }
    }
  }

  // 사용자 프로필 기반으로 UI 제안 생성
  private generateUISuggestionsFromProfile(profile: Record<string, unknown>): {
    fontSize: string
    contrast: string
    simplicity: string
    interactionMethod: string
  } {
    const age = profile.age as number | undefined
    const digitalProficiency = profile.digitalProficiency as string | undefined
    const preferences = profile.preferences as Record<string, string> | undefined

    // 기본값 설정
    let fontSize = '표준'
    let contrast = '표준'
    let simplicity = '표준'
    let interactionMethod = '표준'

    // 사용자가 선호도를 명시적으로 설정한 경우 먼저 적용
    if (preferences) {
      if (preferences.fontSize) fontSize = preferences.fontSize
      if (preferences.contrast) contrast = preferences.contrast
      if (preferences.simplicity) simplicity = preferences.simplicity
      if (preferences.interactionMethod) interactionMethod = preferences.interactionMethod
    }

    // 명시적 설정이 없는 경우 사용자 특성에 따라 자동 설정
    if (age !== undefined) {
      // 고령 사용자
      if (age >= 65) {
        if (fontSize === '표준') fontSize = '크게'
        if (contrast === '표준') contrast = '높음'
        if (simplicity === '표준') simplicity = '높음'
        if (interactionMethod === '표준') interactionMethod = '간편함'
      }
    }

    if (digitalProficiency) {
      // 디지털 역량이 낮은 사용자
      if (digitalProficiency === 'low') {
        if (simplicity === '표준') simplicity = '높음'
        if (interactionMethod === '표준') interactionMethod = '간편함'
      }
    }

    return {
      fontSize,
      contrast,
      simplicity,
      interactionMethod,
    }
  }

  // 문자열에 마크다운 링크가 포함되어 있는지 확인
  private containsMarkdownLinks(text: string): boolean {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/
    return linkPattern.test(text)
  }

  // 링크 텍스트를 사용자 특성에 맞게 강화해야 하는지 확인
  private shouldEnhanceLinkText(linkText: string): boolean {
    // 1. 사용자 프로필 기반 확인
    if (this.userProfile) {
      const age = this.userProfile.age as number
      const proficiency = this.userProfile.digitalProficiency as string

      // 고령 사용자(65세 이상) 또는 디지털 역량이 낮은 사용자에게 더 명확한 링크 텍스트 제공
      if ((age && age >= 65) || proficiency === 'low') {
        return true
      }

      // 사용자 링크 표시 선호도
      if (
        this.userProfile.preferences &&
        typeof this.userProfile.preferences === 'object' &&
        'interactionMethod' in this.userProfile.preferences &&
        this.userProfile.preferences.interactionMethod === '간편함'
      ) {
        return true
      }
    }

    // 2. 링크 텍스트 길이 확인 (너무 짧은 텍스트는 강화 필요)
    if (linkText.length < 5) {
      return true
    }

    // 3. 행동 유도 문구가 이미 포함되어 있는지 확인
    if (this.hasCallToAction(linkText)) {
      return false
    }

    // 기본적으로 고령 사용자나 디지털 역량이 낮은 사용자가 아니면 강화하지 않음
    return false
  }

  // HTML 응답에서 마크다운 링크 처리를 개선한 메서드
  private enhanceHtmlWithLinks(html: string): string {
    // 마크다운 링크 패턴
    const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

    // HTML에 마크다운 링크가 포함되어 있는지 확인하고 변환
    if (markdownLinkPattern.test(html)) {
      return this.convertMarkdownLinksToHtml(html)
    }

    return html
  }

  // AI 응답 처리 최적화 - 링크와 HTML 내용을 모두 처리
  public enhanceAIResponse(response: BffResponse): BffResponse {
    // 응답이 없는 경우 기본값 반환
    if (!response) return response

    // 응답 타입에 따라 처리
    switch (response.contentType) {
      case 'html':
        response.answer = this.enhanceHtmlWithLinks(response.answer)
        break
      case 'text':
      default:
        response.answer = this.processMarkdownLinks(response.answer)
        break
    }

    // 링크 포함 여부 갱신
    response.hasLinks = this.containsMarkdownLinks(response.answer)

    return response
  }

  // 마크다운 링크를 처리하고 유효한 경로인지 확인
  private processMarkdownLinks(text: string): string {
    // 마크다운 링크 패턴: [링크텍스트](URL)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

    // 웹사이트 경로 목록
    const validPaths = this.websiteStructure.pages.map((page) => page.path)

    return text.replace(linkPattern, (match, linkText, url) => {
      // 외부 링크 (http://, https://)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return match // 변경 없음
      }

      // 내부 경로 검증
      if (url.startsWith('/')) {
        const path = url.split('?')[0] // 쿼리 파라미터 제거

        // 유효한 경로인지 확인
        if (validPaths.includes(path)) {
          // 사용자 특성에 따라 링크 텍스트 강화
          if (this.shouldEnhanceLinkText(linkText)) {
            // 링크 텍스트가 이미 행동 유도 문구를 포함하고 있는지 확인
            if (!this.hasCallToAction(linkText)) {
              // 행동 유도 문구 추가
              linkText = this.enhanceLinkText(linkText, path)
            }
          }
          return `[${linkText}](${path})`
        } else {
          // 유사한 경로 찾기
          const similarPath = this.findSimilarPath(path)
          if (similarPath) {
            // 사용자 특성에 따라 링크 텍스트 강화
            if (this.shouldEnhanceLinkText(linkText)) {
              // 링크 텍스트가 이미 행동 유도 문구를 포함하고 있는지 확인
              if (!this.hasCallToAction(linkText)) {
                // 행동 유도 문구 추가
                linkText = this.enhanceLinkText(linkText, similarPath)
              }
            }
            return `[${linkText}](${similarPath})` // 유사한 경로로 수정
          }
        }
      }

      // 기본 반환 (유효하지 않은 경로는 홈으로 설정)
      return `[${linkText}](/)`
    })
  }

  // 링크 텍스트가 이미 행동 유도 문구를 포함하고 있는지 확인
  private hasCallToAction(linkText: string): boolean {
    const callToActionPhrases = [
      '클릭',
      '누르',
      '여기',
      '방문',
      '확인',
      '이동',
      '보기',
      '바로가기',
      '링크',
    ]
    const lowercaseText = linkText.toLowerCase()
    return callToActionPhrases.some((phrase) => lowercaseText.includes(phrase))
  }

  // 사용자 특성에 따라 링크 텍스트 강화
  private enhanceLinkText(linkText: string, path: string): string {
    // 페이지 타입에 따라 적절한 액션 문구 선택
    let actionText = '확인하기'

    // 페이지 경로에 따라 액션 문구 맞춤화
    if (path.includes('products')) {
      actionText = '상품 보기'
    } else if (path.includes('claim')) {
      actionText = '청구 방법 확인하기'
    } else if (path.includes('mypage')) {
      actionText = '내 정보 확인하기'
    } else if (path.includes('consultation')) {
      actionText = '상담 신청하기'
    } else if (path.includes('faq')) {
      actionText = 'FAQ 보기'
    }

    // 기존 링크 텍스트가 짧으면 완전히 대체, 길면 추가
    if (linkText.length < 10) {
      return `${linkText} ${actionText}`
    } else {
      return `${linkText} (${actionText})`
    }
  }

  // 유사한 경로 찾기
  private findSimilarPath(path: string): string | null {
    const normalizedPath = path.toLowerCase()

    // 1. 정확한 경로 매치 시도
    for (const page of this.websiteStructure.pages) {
      if (page.path.toLowerCase() === normalizedPath) {
        return page.path
      }
    }

    // 2. 경로 세그먼트 기반 키워드 매칭
    const pathSegments = normalizedPath.split('/').filter(Boolean)
    for (const segment of pathSegments) {
      if (!segment) continue

      // 키워드 일치 검색
      for (const page of this.websiteStructure.pages) {
        const keywordMatch = page.keywords.some(
          (kw) => kw.toLowerCase().includes(segment) || segment.includes(kw.toLowerCase()),
        )
        if (keywordMatch) {
          return page.path
        }
      }
    }

    // 3. 전체 페이지 제목과 설명에서 유사성 검색
    for (const page of this.websiteStructure.pages) {
      const titleMatch =
        page.title.toLowerCase().includes(normalizedPath) ||
        normalizedPath.includes(page.title.toLowerCase())
      const descMatch =
        page.description.toLowerCase().includes(normalizedPath) ||
        normalizedPath.includes(page.description.toLowerCase())

      if (titleMatch || descMatch) {
        return page.path
      }
    }

    // 4. 제품 데이터 검색
    for (const product of this.websiteStructure.products) {
      if (
        product.name.toLowerCase().includes(normalizedPath) ||
        normalizedPath.includes(product.name.toLowerCase()) ||
        product.description.toLowerCase().includes(normalizedPath)
      ) {
        return '/products' // 상품 관련 경로로 연결
      }
    }

    // 일치하는 항목이 없는 경우
    return null
  }

  // 개발용 모의 응답 생성 (API 키가 없을 때 사용)
  private generateMockResponse(query: string): BffResponse {
    const lowerQuery = query.toLowerCase()

    // 질의에 따른 모의 응답
    if (lowerQuery.includes('보험') && lowerQuery.includes('상품')) {
      return {
        answer:
          '저희 SecureLife에서는 다양한 보험 상품을 제공하고 있습니다. 생명보험, 건강보험, 자동차보험 등 고객님의 필요에 맞는 다양한 상품을 확인해보세요.',
        recommendedPath: '/products',
        confidence: 0.9,
        contentType: 'text',
        hasLinks: false,
      }
    } else if (lowerQuery.includes('청구') || lowerQuery.includes('보험금')) {
      return {
        answer:
          '보험금 청구는 온라인으로 간편하게 하실 수 있습니다. 필요한 서류를 준비하시고 [청구 페이지](/claim)를 방문해 주세요.',
        recommendedPath: '/claim',
        confidence: 0.85,
        contentType: 'text',
        hasLinks: true,
      }
    } else if (lowerQuery.includes('마이페이지') || lowerQuery.includes('내 정보')) {
      return {
        answer: '마이페이지에서 계약 정보, 청구 내역, 개인정보 등을 확인하실 수 있습니다.',
        recommendedPath: '/mypage',
        confidence: 0.8,
        contentType: 'text',
        hasLinks: false,
      }
    } else if (lowerQuery.includes('상담') || lowerQuery.includes('문의')) {
      return {
        answer:
          '상담 페이지에서 전문 상담사와 연결되어 궁금한 점을 해결하실 수 있습니다. [여기를 클릭하세요](/consultation).',
        recommendedPath: '/consultation',
        confidence: 0.75,
        contentType: 'text',
        hasLinks: true,
      }
    } else if (lowerQuery.includes('faq') || lowerQuery.includes('자주 묻는 질문')) {
      return {
        answer: 'FAQ 페이지에서 자주 묻는 질문과 답변을 확인하실 수 있습니다. [FAQ 바로가기](/faq)',
        recommendedPath: '/faq',
        confidence: 0.7,
        contentType: 'text',
        hasLinks: true,
      }
    } else {
      // 맞춤형 응답 (사용자 프로필 활용)
      if (this.userProfile && typeof this.userProfile.name === 'string') {
        return {
          answer: `${this.userProfile.name}님, 보험 관련하여 무엇을 도와드릴까요? 질문을 더 구체적으로 해주시면 더 정확한 답변을 드릴 수 있습니다.`,
          recommendedPath: null,
          confidence: 0.3,
          contentType: 'text',
          hasLinks: false,
        }
      }

      // 기본 응답
      return {
        answer:
          '구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다. 예를 들어, "보험 상품 추천해줘", "보험금 청구하는 방법 알려줘" 등의 질문을 해보세요.',
        recommendedPath: null,
        confidence: 0.2,
        contentType: 'text',
        hasLinks: false,
      }
    }
  }

  // 사용자 질문에 맞는 HTML 마크업 생성
  public async generateContentMarkup(query: string): Promise<string> {
    try {
      // API 키가 설정되지 않은 경우 개발용 응답 반환
      if (!this.apiKey) {
        console.warn('OpenAI API key not set in environment variables. Using mock HTML response.')
        return this.generateMockHtml(query)
      }

      // HTML 생성을 위한 프롬프트 구성
      const messages = [
        {
          role: 'system',
          content: `당신은 SecureLife 보험회사의 AI 어시스턴트입니다.
                  사용자가 요청한 보험 상품이나 서비스에 대한 정보를 HTML 형식으로 생성해주세요.
                  응답은 반드시 <div class="custom-content">으로 시작하여 </div>로 끝나야 합니다.
                  디자인은 clean하고 modern하게 작성해주세요.
                  제목(h2), 설명(p), 특징이나 혜택(ul), 그리고 액션 버튼(div class="action-buttons")을 포함해주세요.
                  버튼은 관련 페이지로 이동하는 링크를 제공해야 합니다(예: /products, /claim, /consultation 등).
                  
                  내부 페이지 링크를 제공할 때는 <a href="/경로">링크텍스트</a> 형식을 사용하세요.
                  모든 링크는 적절한 클래스를 포함해야 합니다: class="adaptive-link"`,
        },
      ]

      // 사용자 프로필이 있는 경우 추가
      if (this.userProfile) {
        messages.push({
          role: 'system',
          content: `사용자 정보: ${JSON.stringify(this.userProfile)}`,
        })
      }

      // 사용자 질의 추가
      messages.push({
        role: 'user',
        content: `다음에 대한 정보 페이지를 HTML로 만들어주세요: ${query}`,
      })

      // OpenAI API 호출
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('OpenAI API Error:', errorData)
        throw new Error(`OpenAI API 호출 중 오류 발생: ${response.status}`)
      }

      const responseData = await response.json()
      const htmlContent = responseData.choices[0].message.content.trim()

      // HTML 내용 추출
      const htmlMatch = htmlContent.match(/<div class="custom-content">[\s\S]*?<\/div>/i)
      if (htmlMatch) {
        // 마크다운 링크가 포함되어 있을 수 있으므로 이를 HTML 링크로 변환
        const html = htmlMatch[0]
        const processedHtml = this.convertMarkdownLinksToHtml(html)
        return processedHtml
      }

      // 마크다운 링크가 포함되어 있을 수 있으므로 변환 처리
      return this.convertMarkdownLinksToHtml(htmlContent)
    } catch (error) {
      console.error('Error generating HTML content:', error)
      return this.generateMockHtml(query)
    }
  }

  // 모의 HTML 콘텐츠 생성 (API 호출 실패 시)
  private generateMockHtml(query: string): string {
    const lowerQuery = query.toLowerCase()

    let mockHtml = ''

    if (lowerQuery.includes('암보험')) {
      mockHtml = `
        <div class="custom-content">
          <h2>암보험 안내</h2>
          <p>SecureLife의 암보험 상품은 암 진단 시 최대 1억원까지 보장됩니다.</p>
          <ul>
            <li>진단비 최대 1억원</li>
            <li>입원비 일당 최대 10만원</li>
            <li>수술비 300만원~1000만원</li>
          </ul>
          <div class="action-buttons">
            <a href="/products" class="adaptive-link">상품 보기</a>
            <a href="/consultation" class="adaptive-link">상담 신청</a>
          </div>
        </div>
      `
    } else if (lowerQuery.includes('자동차보험')) {
      mockHtml = `
        <div class="custom-content">
          <h2>자동차보험 안내</h2>
          <p>SecureLife 자동차보험은 다양한 특약과 함께 합리적인 보험료를 제공합니다.</p>
          <ul>
            <li>무사고 할인 최대 70%</li>
            <li>24시간 긴급출동 서비스</li>
            <li>대물/대인 무제한 보장 가능</li>
          </ul>
          <div class="action-buttons">
            <a href="/products" class="adaptive-link">상품 보기</a>
            <a href="/consultation" class="adaptive-link">상담 신청</a>
          </div>
        </div>
      `
    } else {
      mockHtml = `
        <div class="custom-content">
          <h2>맞춤형 보험 상품 안내</h2>
          <p>검색하신 내용에 맞는 보험 상품을 추천해 드립니다.</p>
          <p>원하시는 보험 종류를 더 구체적으로 알려주시면 상세한 안내를 드릴 수 있습니다.</p>
          <ul>
            <li>생명보험</li>
            <li>건강보험</li>
            <li>자동차보험</li>
            <li>재물보험</li>
          </ul>
          <div class="action-buttons">
            <a href="/products" class="adaptive-link">전체 상품 보기</a>
          </div>
        </div>
      `
    }

    // 마크다운 링크가 포함되어 있을 수 있으므로 이를 HTML 링크로 변환
    return this.convertMarkdownLinksToHtml(mockHtml)
  }

  // 마크다운 텍스트를 HTML로 변환하는 함수 추가
  public convertMarkdownLinksToHtml(text: string): string {
    if (!text) return ''

    // 마크다운 링크 패턴: [링크텍스트](URL)
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g

    // 마크다운 링크를 HTML <a> 태그로 변환
    return text.replace(linkPattern, (match, linkText, url) => {
      // 내부 경로인 경우 router-link를 사용하거나, 일반 <a> 태그로 변환
      if (url.startsWith('/')) {
        return `<a href="${url}" class="adaptive-link">${linkText}</a>`
      } else {
        // 외부 링크는 새 탭에서 열리도록 설정
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="adaptive-link">${linkText}</a>`
      }
    })
  }
}

// BFF 응답 인터페이스
export interface BffResponse {
  answer: string
  recommendedPath: string | null
  confidence: number
  contentType: string // 'text', 'json', 'html', 'error'
  uiSuggestions?: {
    fontSize: string // '표준', '크게', '매우 크게'
    contrast: string // '표준', '높음'
    simplicity: string // '표준', '높음'
    interactionMethod: string // '표준', '간편함'
  }
  hasLinks: boolean
}
