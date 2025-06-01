// UX 서비스 - 확장된 AI 시스템 대응
interface UIComponent {
  type: string
  id: string
  title?: string
  content: string
  style?: string
  priority: number
  data?: Record<string, any>
}

interface UXResponse {
  components: UIComponent[]
  total_products?: number
  generated_at?: string
  ai_generated: boolean
}

class UXService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  async generateUI(pageType: string, userQuery?: string): Promise<UXResponse> {
    try {
      // 🤖 확장된 AI Agent API 사용
      if (userQuery && userQuery.trim()) {
        return await this.generateSmartUI(userQuery)
      }

      // 기본 UI 생성 (유저 질문이 없는 경우)
      const params = new URLSearchParams({
        page_type: pageType,
      })

      const response = await fetch(`${this.baseURL}/api/v1/ux/generate-ui?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: UXResponse = await response.json()
      return data
    } catch (error) {
      console.error('🚀 UX 생성 실패:', error)
      return this.getFallbackResponse()
    }
  }

  // 🤖 확장된 AI Agent API 호출
  async generateSmartUI(userQuery: string): Promise<UXResponse> {
    try {
      const params = new URLSearchParams({
        query: userQuery,
      })

      const response = await fetch(`${this.baseURL}/api/v1/ux/generate-ui-smart?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: UXResponse = await response.json()
      return data
    } catch (error) {
      console.error('🤖 AI Agent 호출 실패:', error)
      return this.getFallbackResponse()
    }
  }

  // 폴백 응답 생성
  private getFallbackResponse(): UXResponse {
    return {
      components: [
        {
          type: 'notice',
          id: 'error',
          title: '서비스 일시 중단',
          content: `
            <div style="
              background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
              padding: 20px;
              border-radius: 15px;
              color: #333;
              text-align: center;
              box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            ">
              <h3 style="margin: 0 0 10px 0;">🤖 AI 서비스 일시 중단</h3>
              <p style="margin: 0;">현재 AI 기능을 이용할 수 없습니다. 잠시 후 다시 시도해 주세요.</p>
            </div>
          `,
          style: 'margin: 20px 0;',
          priority: 1,
        },
      ],
      ai_generated: false,
    }
  }

  // 🔍 검색 전용 메서드 추가
  async searchInsurance(query: string): Promise<UXResponse> {
    return await this.generateSmartUI(query)
  }

  // 컴포넌트에서 HTML 추출
  extractContent(components: UIComponent[]): string {
    return components
      .sort((a, b) => a.priority - b.priority)
      .map((comp) => comp.content)
      .join('\n')
  }

  // 특정 타입의 컴포넌트만 필터링
  filterComponentsByType(components: UIComponent[], type: string): UIComponent[] {
    return components.filter((comp) => comp.type === type)
  }

  // 스타일과 함께 렌더링
  renderComponent(component: UIComponent): string {
    const style = component.style || ''
    return `<div style="${style}" data-component-id="${component.id}">
      ${component.title ? `<h2>${component.title}</h2>` : ''}
      ${component.content}
    </div>`
  }
}

export const uxService = new UXService()
export type { UXResponse, UIComponent }
