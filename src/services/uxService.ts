// UX 서비스 - 간소화된 응답 처리
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
      // 🚀 새로운 스마트 API 호출
      const params = new URLSearchParams({
        page_type: pageType,
        ...(userQuery && { user_query: userQuery }), // ✅ 올바른 parameter 이름
      })

      // ✅ GET 방식으로 변경 (백엔드와 일치)
      const response = await fetch(`${this.baseURL}/api/v1/ux/generate-ui?${params}`, {
        method: 'GET', // ✅ POST → GET 변경
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: UXResponse = await response.json()
      console.log('🤖 스마트 AI 응답:', data.ai_generated ? 'AI Agent 사용됨' : '일반 모드')
      return data
    } catch (error) {
      console.error('🚀 스마트 UX 생성 실패:', error)

      // 폴백 응답
      return {
        components: [
          {
            type: 'notice',
            id: 'error',
            title: '서비스 오류',
            content: '잠시 후 다시 시도해주세요.',
            style: 'padding: 2rem; background: #fff3cd; border-radius: 8px;',
            priority: 1,
          },
        ],
        ai_generated: false,
      }
    }
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
