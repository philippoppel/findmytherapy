/**
 * Jest Integration Test Setup
 * Loads test environment and configures Jest for integration tests
 */

import dotenv from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';
import { webcrypto } from 'crypto';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock Web APIs for Next.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock crypto.subtle for Web Crypto API (needed for JWT operations)
if (!global.crypto) {
  global.crypto = webcrypto as any;
}

// Set longer timeout for integration tests
jest.setTimeout(30000);
