import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';

// Mock Web APIs for Next.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock crypto.subtle for Web Crypto API
if (!global.crypto) {
  global.crypto = webcrypto as any;
}

// Mock Request and Response for Next.js API routes
if (!global.Request) {
  global.Request = class Request {
    private _url: string;
    private _init?: RequestInit;

    constructor(url: string, init?: RequestInit) {
      this._url = url;
      this._init = init;
    }

    get url() {
      return this._url;
    }

    get method() {
      return this._init?.method || 'GET';
    }

    get headers() {
      return new Map();
    }

    get body() {
      return this._init?.body;
    }

    async json() {
      return this.body ? JSON.parse(this.body.toString()) : {};
    }
  } as any;
}

if (!global.Response) {
  global.Response = class Response {
    private _body: any;
    private _init?: ResponseInit;

    constructor(body: any, init?: ResponseInit) {
      this._body = body;
      this._init = init;
    }

    get status() {
      return this._init?.status || 200;
    }

    get headers() {
      return new Map();
    }

    async json() {
      if (this._body === undefined || this._body === null) {
        return null;
      }
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }

    static json(data: any, init?: ResponseInit) {
      const jsonBody = JSON.stringify(data);
      const response = new this(jsonBody, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
      });
      return response;
    }
  } as any;
}
