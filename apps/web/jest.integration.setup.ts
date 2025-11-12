/**
 * Jest Integration Test Setup
 * Loads test environment and configures Jest for integration tests
 */

import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Extend Jest matchers
import '@testing-library/jest-dom'

// Set longer timeout for integration tests
jest.setTimeout(30000)
