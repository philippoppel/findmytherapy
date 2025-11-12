// Mock for next/server
class MockNextRequest {
  constructor(url, init = {}) {
    this.url = url
    this.method = init.method || 'GET'
    this._body = init.body
    this._headers = new Map(Object.entries(init.headers || {}))
  }

  get headers() {
    return this._headers
  }

  async json() {
    if (typeof this._body === 'string') {
      return JSON.parse(this._body)
    }
    return this._body
  }

  async text() {
    if (typeof this._body === 'string') {
      return this._body
    }
    return JSON.stringify(this._body)
  }
}

class MockNextResponse extends Response {
  constructor(body, init = {}) {
    const actualBody = typeof body === 'string' ? body : JSON.stringify(body)
    super(actualBody, init)
    this._jsonBody = body
  }

  async json() {
    if (this._jsonBody !== undefined) {
      return this._jsonBody
    }
    const text = await super.text()
    return text ? JSON.parse(text) : null
  }

  static json(data, init = {}) {
    const response = new MockNextResponse(data, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
    return response
  }

  static next(init) {
    return new MockNextResponse(null, init)
  }

  static redirect(url, status = 307) {
    return new MockNextResponse(null, {
      status,
      headers: {
        Location: url,
      },
    })
  }

  static rewrite(url) {
    return new MockNextResponse(null, {
      headers: {
        'x-middleware-rewrite': url,
      },
    })
  }
}

module.exports = {
  __esModule: true,
  NextRequest: MockNextRequest,
  NextResponse: MockNextResponse,
}
