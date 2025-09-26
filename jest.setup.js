require("@testing-library/jest-dom");
global.fetch = require("cross-fetch");

// Polyfill for TextEncoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Response and Request for Next.js API routes
global.Response = class Response {
  constructor(body, options = {}) {
    this._body = body;
    this._status = options.status || 200;
    this._headers = options.headers || {};
  }

  async json() {
    return JSON.parse(this._body);
  }

  get status() {
    return this._status;
  }

  get headers() {
    return this._headers;
  }
};

global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = options.headers || {};
    this.body = options.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

// Mock NextRequest and NextResponse
jest.mock("next/server", () => ({
  NextRequest: class NextRequest extends Request {
    constructor(input, init) {
      super(input, init);
    }
  },
  NextResponse: {
    json: (data, options = {}) =>
      new Response(JSON.stringify(data), {
        status: options.status || 200,
        headers: { "Content-Type": "application/json", ...options.headers },
      }),
  },
}));
