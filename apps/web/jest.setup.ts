import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Mock Web APIs for Next.js
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

// Mock Request and Response for Next.js API routes
if (!global.Request) {
  global.Request = class Request {
    private _url: string
    private _init?: RequestInit

    constructor(url: string, init?: RequestInit) {
      this._url = url
      this._init = init
    }

    get url() {
      return this._url
    }

    get method() {
      return this._init?.method || 'GET'
    }

    get headers() {
      return new Map()
    }

    get body() {
      return this._init?.body
    }

    async json() {
      return this.body ? JSON.parse(this.body.toString()) : {}
    }
  } as any
}

if (!global.Response) {
  global.Response = class Response {
    private _body: any
    private _init?: ResponseInit

    constructor(body: any, init?: ResponseInit) {
      this._body = body
      this._init = init
    }

    get status() {
      return this._init?.status || 200
    }

    get headers() {
      return new Map()
    }

    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body
    }
  } as any
}
