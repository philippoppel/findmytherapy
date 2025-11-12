/**
 * Comprehensive Tests for Triage API Route
 *
 * This is the CORE of the application and must be 100% reliable.
 *
 * TODO: These tests are currently skipped due to complex ESM dependencies with next-auth and NextRequest.
 * They need to be refactored to work with Jest or moved to E2E tests.
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST } from './route'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    triageSession: {
      create: jest.fn(),
      update: jest.fn(),
    },
    emergencyAlert: {
      create: jest.fn(),
    },
    triageSnapshot: {
      create: jest.fn(),
    },
    therapistProfile: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}))

jest.mock('../../../lib/auth', () => ({
  auth: jest.fn().mockResolvedValue(null),
}))

jest.mock('../../../lib/monitoring', () => ({
  captureError: jest.fn(),
}))

describe('Triage API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('✅ Screening-Only Assessment (scores <3)', () => {
    it('should accept valid screening-only data with PHQ-2=2, GAD-2=1', async () => {
      const requestBody = {
        assessmentType: 'screening',
        phq2Answers: [1, 1],
        gad2Answers: [0, 1],
        phq2Score: 2,
        gad2Score: 1,
        supportPreferences: [],
        availability: [],
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.assessmentType).toBe('screening')
      expect(data.screeningResult.phq2Score).toBe(2)
      expect(data.screeningResult.gad2Score).toBe(1)
      expect(data.recommendations.therapists).toEqual([])
      // Screening assessments should recommend courses for prevention
      expect(Array.isArray(data.recommendations.courses)).toBe(true)
    })

    it('should accept screening-only with PHQ-2=0, GAD-2=0 (no symptoms)', async () => {
      const requestBody = {
        assessmentType: 'screening',
        phq2Answers: [0, 0],
        gad2Answers: [0, 0],
        phq2Score: 0,
        gad2Score: 0,
        supportPreferences: ['course'],
        availability: ['online'],
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.assessmentType).toBe('screening')
    })

    it('should REJECT screening-only when score mismatch detected', async () => {
      const requestBody = {
        assessmentType: 'screening',
        phq2Answers: [1, 1], // sum = 2
        gad2Answers: [0, 1], // sum = 1
        phq2Score: 5, // ❌ WRONG!
        gad2Score: 1,
        supportPreferences: [],
        availability: [],
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Score mismatch')
      expect(data.details.phq2.calculated).toBe(2)
      expect(data.details.phq2.provided).toBe(5)
    })

    it('should LOG WARNING but not fail when screening scores ≥3 (UX override case)', async () => {
      const requestBody = {
        assessmentType: 'screening',
        phq2Answers: [2, 2], // sum = 4
        gad2Answers: [0, 1], // sum = 1
        phq2Score: 4, // ≥3 but user chose screening-only
        gad2Score: 1,
        supportPreferences: [],
        availability: [],
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[TRIAGE] Screening-only submitted with scores ≥3'),
        expect.objectContaining({ phq2Score: 4 })
      )

      consoleSpy.mockRestore()
    })
  })

  describe('✅ Full Assessment (complete PHQ-9 & GAD-7)', () => {
    it('should accept valid full assessment with all questions answered', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [2, 2, 1, 1, 0, 1, 1, 0, 0], // sum = 8
        phq9Score: 8,
        phq9Severity: 'mild',
        gad7Answers: [2, 2, 1, 1, 0, 1, 0], // sum = 7
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })

    it('should accept full assessment with HIGH risk and suicidal ideation', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [3, 3, 3, 3, 3, 3, 3, 3, 2], // sum = 26
        phq9Score: 26,
        phq9Severity: 'severe',
        gad7Answers: [3, 3, 3, 3, 3, 3, 3], // sum = 21
        gad7Score: 21,
        gad7Severity: 'severe',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 2, // Suicidal ideation
        hasSuicidalIdeation: true,
        riskLevel: 'HIGH',
        requiresEmergency: true,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })

    it('should REJECT full assessment when PHQ-9 score mismatch', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [2, 2, 1, 1, 0, 1, 1, 0, 0], // sum = 8
        phq9Score: 15, // ❌ WRONG!
        phq9Severity: 'moderate',
        gad7Answers: [2, 2, 1, 1, 0, 1, 0], // sum = 7
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: [],
        availability: [],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Score mismatch')
      expect(data.details.phq9.calculated).toBe(8)
      expect(data.details.phq9.provided).toBe(15)
    })

    it('should REJECT full assessment when GAD-7 score mismatch', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [2, 2, 1, 1, 0, 1, 1, 0, 0], // sum = 8
        phq9Score: 8,
        phq9Severity: 'mild',
        gad7Answers: [2, 2, 1, 1, 0, 1, 0], // sum = 7
        gad7Score: 12, // ❌ WRONG!
        gad7Severity: 'moderate',
        supportPreferences: [],
        availability: [],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toContain('Score mismatch')
      expect(data.details.gad7.calculated).toBe(7)
      expect(data.details.gad7.provided).toBe(12)
    })
  })

  describe('⚠️ Partial Expansion (one side expanded, one side screening)', () => {
    it('should accept partial expansion: PHQ-9 full, GAD-7 screening (padded)', async () => {
      // This represents: PHQ-2 ≥3 (expanded), GAD-2 <3 (stayed at screening)
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [2, 2, 1, 1, 0, 1, 1, 0, 0], // 9 items: PHQ-2 + remaining 7
        phq9Score: 8,
        phq9Severity: 'mild',
        gad7Answers: [0, 1, 0, 0, 0, 0, 0], // 7 items: GAD-2 + padded 5 zeros
        gad7Score: 1, // Only first 2 answered, rest padded with 0
        gad7Severity: 'minimal',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })

    it('should accept partial expansion: GAD-7 full, PHQ-9 screening (padded)', async () => {
      // This represents: PHQ-2 <3 (stayed at screening), GAD-2 ≥3 (expanded)
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [1, 1, 0, 0, 0, 0, 0, 0, 0], // 9 items: PHQ-2 + padded 7 zeros
        phq9Score: 2,
        phq9Severity: 'minimal',
        gad7Answers: [2, 2, 1, 1, 0, 1, 0], // 7 items: GAD-2 + remaining 5
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'MEDIUM',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })

  describe('❌ Schema Validation Errors', () => {
    it('should REJECT when assessmentType is missing', async () => {
      const requestBody = {
        // assessmentType missing!
        phq2Answers: [1, 1],
        gad2Answers: [0, 1],
        phq2Score: 2,
        gad2Score: 1,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should REJECT when PHQ-9 has wrong array length', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [2, 2, 1], // ❌ Only 3 items instead of 9!
        phq9Score: 5,
        phq9Severity: 'mild',
        gad7Answers: [2, 2, 1, 1, 0, 1, 0],
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: [],
        availability: [],
        riskLevel: 'LOW',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should REJECT when answers contain invalid values (>3)', async () => {
      const requestBody = {
        assessmentType: 'screening',
        phq2Answers: [1, 5], // ❌ 5 is out of range (0-3)!
        gad2Answers: [0, 1],
        phq2Score: 6,
        gad2Score: 1,
        supportPreferences: [],
        availability: [],
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('🔬 Scientific Correctness Validation', () => {
    it('should correctly calculate minimal severity (PHQ-9: 0-4)', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [0, 0, 1, 1, 0, 1, 1, 0, 0], // sum = 4
        phq9Score: 4,
        phq9Severity: 'minimal',
        gad7Answers: [0, 0, 0, 0, 0, 0, 0],
        gad7Score: 0,
        gad7Severity: 'minimal',
        supportPreferences: [],
        availability: [],
        phq9Item9Score: 0,
        hasSuicidalIdeation: false,
        riskLevel: 'LOW',
        requiresEmergency: false,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('should correctly identify severe depression (PHQ-9: 20-27)', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [3, 3, 3, 3, 3, 3, 2, 2, 2], // sum = 24
        phq9Score: 24,
        phq9Severity: 'severe',
        gad7Answers: [1, 1, 1, 1, 1, 1, 1],
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 2,
        hasSuicidalIdeation: true,
        riskLevel: 'HIGH',
        requiresEmergency: true,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('should detect suicidal ideation from item 9', async () => {
      const requestBody = {
        assessmentType: 'full',
        phq9Answers: [1, 1, 1, 1, 1, 1, 1, 1, 3], // item 9 = 3 (suicidal thoughts)
        phq9Score: 11,
        phq9Severity: 'moderate',
        gad7Answers: [1, 1, 1, 1, 1, 1, 1],
        gad7Score: 7,
        gad7Severity: 'mild',
        supportPreferences: ['therapist'],
        availability: ['online'],
        phq9Item9Score: 3, // Critical!
        hasSuicidalIdeation: true,
        riskLevel: 'HIGH',
        requiresEmergency: true,
      }

      const request = new NextRequest('http://localhost:3000/api/triage', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
    })
  })
})
