declare global {
  interface Window {
    klartheraAnalytics?: {
      events: Array<{ event: string; payload: Record<string, unknown>; timestamp: number }>
      push: (event: string, payload: Record<string, unknown>) => void
    }
  }
}

type AnalyticsPayload = Record<string, unknown>

export function track(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') {
    return
  }

  const analytics = window.klartheraAnalytics

  if (analytics?.push) {
    analytics.push(event, payload)
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics:fallback]', event, payload)
  }
}
