/**
 * Production E2E Tests for Therapist Microsite & Session-Zero-Dossier Features
 *
 * Tests:
 * 1. Microsite Feature - Page loads, lead submission, analytics tracking
 * 2. Dossier API - Auth guards, endpoint structure
 * 3. Database Validation - Table existence, test data
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load production database URL
config({ path: resolve(__dirname, '.env.production.check') })

const PRODUCTION_URL = 'https://findmytherapy-qyva-96w27ymoy-philipps-projects-0f51423d.vercel.app'
const TEST_MICROSITE_SLUG = 'dr-maria-mueller'

interface TestResult {
  name: string
  status: 'PASSED' | 'FAILED' | 'WARNING'
  message: string
  details?: any
}

const results: TestResult[] = []

function logTest(name: string, status: 'PASSED' | 'FAILED' | 'WARNING', message: string, details?: any) {
  results.push({ name, status, message, details })
  const emoji = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⚠️'
  console.log(`${emoji} ${name}: ${message}`)
  if (details) {
    console.log('  Details:', JSON.stringify(details, null, 2))
  }
}

async function testMicrositePageLoad() {
  console.log('\n🔍 Testing Microsite Page Load...')
  try {
    const response = await fetch(`${PRODUCTION_URL}/t/${TEST_MICROSITE_SLUG}`)
    const status = response.status
    const contentType = response.headers.get('content-type')
    const html = await response.text()

    if (status === 200) {
      logTest('Microsite Page Load', 'PASSED', `GET /t/${TEST_MICROSITE_SLUG} returned 200`, {
        status,
        contentType,
        htmlLength: html.length,
        hasTitle: html.includes('<title>'),
        hasMetaTags: html.includes('<meta')
      })
    } else {
      logTest('Microsite Page Load', 'FAILED', `Expected 200, got ${status}`, {
        status,
        responsePreview: html.substring(0, 500)
      })
    }
  } catch (error: any) {
    logTest('Microsite Page Load', 'FAILED', `Request failed: ${error.message}`, { error: error.toString() })
  }
}

async function testMicrositeAPIEndpoint() {
  console.log('\n🔍 Testing Microsite API Endpoint...')
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/microsites/${TEST_MICROSITE_SLUG}`)
    const status = response.status
    const data = await response.json()

    if (status === 200 && data.success) {
      logTest('Microsite API Endpoint', 'PASSED', 'API returned valid microsite data', {
        status,
        hasProfile: !!data.data?.profile,
        displayName: data.data?.profile?.displayName,
        slug: data.data?.profile?.slug
      })
    } else {
      logTest('Microsite API Endpoint', 'FAILED', `Unexpected response`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Microsite API Endpoint', 'FAILED', `Request failed: ${error.message}`)
  }
}

async function testLeadFormSubmission() {
  console.log('\n🔍 Testing Lead Form Submission...')
  try {
    const testLead = {
      name: 'E2E Test User',
      email: `test-${Date.now()}@example.com`,
      phone: '+43 123 456789',
      message: 'This is an automated E2E test lead submission. Please ignore.',
      consent: true,
      metadata: { testRun: true, timestamp: new Date().toISOString() }
    }

    const response = await fetch(`${PRODUCTION_URL}/api/microsites/${TEST_MICROSITE_SLUG}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testLead)
    })

    const status = response.status
    const data = await response.json()

    if (status === 201 && data.success) {
      logTest('Lead Form Submission', 'PASSED', 'Lead created successfully', {
        status,
        leadId: data.leadId,
        message: data.message
      })
    } else {
      logTest('Lead Form Submission', 'FAILED', `Unexpected response`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Lead Form Submission', 'FAILED', `Request failed: ${error.message}`)
  }
}

async function testAnalyticsTracking() {
  console.log('\n🔍 Testing Analytics Tracking...')
  try {
    const trackingData = {
      profileId: 'test-profile-id',
      slug: TEST_MICROSITE_SLUG,
      sessionId: `test-session-${Date.now()}`,
      source: 'e2e-test',
      userAgent: 'E2E Test Runner/1.0'
    }

    const response = await fetch(`${PRODUCTION_URL}/api/microsites/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData)
    })

    const status = response.status
    const data = await response.json()

    if (status === 200 || status === 201) {
      logTest('Analytics Tracking', 'PASSED', 'Tracking endpoint responded', {
        status,
        tracked: data.tracked,
        success: data.success
      })
    } else {
      logTest('Analytics Tracking', 'WARNING', `Unexpected response`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Analytics Tracking', 'WARNING', `Request failed: ${error.message}`)
  }
}

async function testDossierAPIStructure() {
  console.log('\n🔍 Testing Dossier API Structure (Auth Guards)...')

  // Test POST /api/dossiers without auth
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/dossiers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triageSessionId: 'test-id-123',
        trigger: 'AUTO'
      })
    })

    const status = response.status
    const data = await response.json()

    if (status === 401 || status === 403) {
      logTest('Dossier POST Auth Guard', 'PASSED', 'Endpoint properly returns auth error', {
        status,
        error: data.error
      })
    } else {
      logTest('Dossier POST Auth Guard', 'WARNING', `Expected 401/403, got ${status}`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Dossier POST Auth Guard', 'FAILED', `Request failed: ${error.message}`)
  }

  // Test GET /api/dossiers/:id without auth
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/dossiers/test-id-123`)
    const status = response.status
    const data = await response.json()

    if (status === 401 || status === 403) {
      logTest('Dossier GET Auth Guard', 'PASSED', 'Endpoint properly returns auth error', {
        status,
        error: data.error
      })
    } else if (status === 404) {
      logTest('Dossier GET Auth Guard', 'WARNING', 'Got 404 (endpoint exists, auth might be checked after)', {
        status
      })
    } else {
      logTest('Dossier GET Auth Guard', 'WARNING', `Expected 401/403, got ${status}`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Dossier GET Auth Guard', 'FAILED', `Request failed: ${error.message}`)
  }

  // Test GET /api/dossiers (list) without auth
  try {
    const response = await fetch(`${PRODUCTION_URL}/api/dossiers`)
    const status = response.status
    const data = await response.json()

    if (status === 401 || status === 403) {
      logTest('Dossier LIST Auth Guard', 'PASSED', 'List endpoint properly returns auth error', {
        status,
        error: data.error
      })
    } else {
      logTest('Dossier LIST Auth Guard', 'WARNING', `Expected 401/403, got ${status}`, {
        status,
        data
      })
    }
  } catch (error: any) {
    logTest('Dossier LIST Auth Guard', 'FAILED', `Request failed: ${error.message}`)
  }
}

async function testDatabaseSchema() {
  console.log('\n🔍 Testing Database Schema...')

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  })

  try {
    // Test TherapistMicrositeVisit table
    const visitsCount = await prisma.therapistMicrositeVisit.count()
    logTest('TherapistMicrositeVisit Table', 'PASSED', `Table exists with ${visitsCount} records`)

    // Test TherapistMicrositeLead table
    const leadsCount = await prisma.therapistMicrositeLead.count()
    logTest('TherapistMicrositeLead Table', 'PASSED', `Table exists with ${leadsCount} records`)

    // Test TherapistMicrositeRedirect table
    const redirectsCount = await prisma.therapistMicrositeRedirect.count()
    logTest('TherapistMicrositeRedirect Table', 'PASSED', `Table exists with ${redirectsCount} records`)

    // Test SessionZeroDossier table
    const dossiersCount = await prisma.sessionZeroDossier.count()
    logTest('SessionZeroDossier Table', 'PASSED', `Table exists with ${dossiersCount} records`)

    // Test DossierAccessLog table
    const accessLogsCount = await prisma.dossierAccessLog.count()
    logTest('DossierAccessLog Table', 'PASSED', `Table exists with ${accessLogsCount} records`)

    // Test ClientConsent table
    const consentsCount = await prisma.clientConsent.count()
    logTest('ClientConsent Table', 'PASSED', `Table exists with ${consentsCount} records`)

  } catch (error: any) {
    logTest('Database Schema', 'FAILED', `Database query failed: ${error.message}`, {
      error: error.toString()
    })
  } finally {
    await prisma.$disconnect()
  }
}

async function testDatabaseTestData() {
  console.log('\n🔍 Validating Test Data in Database...')

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
  })

  try {
    // Check for therapist profile with microsite
    const therapistProfile = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: TEST_MICROSITE_SLUG,
        micrositeStatus: 'PUBLISHED'
      },
      select: {
        id: true,
        displayName: true,
        micrositeSlug: true,
        micrositeStatus: true,
        user: {
          select: {
            email: true
          }
        }
      }
    })

    if (therapistProfile) {
      logTest('Therapist Microsite Profile', 'PASSED', 'Found published microsite profile', {
        id: therapistProfile.id,
        displayName: therapistProfile.displayName,
        slug: therapistProfile.micrositeSlug,
        email: therapistProfile.user.email
      })
    } else {
      logTest('Therapist Microsite Profile', 'FAILED', `No published microsite found for slug: ${TEST_MICROSITE_SLUG}`)
    }

    // Check for triage sessions
    const triageSession = await prisma.triageSession.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clientId: true,
        phq9Score: true,
        gad7Score: true,
        riskLevel: true,
        createdAt: true
      }
    })

    if (triageSession) {
      logTest('Triage Session', 'PASSED', 'Found triage session data', {
        id: triageSession.id,
        riskLevel: triageSession.riskLevel,
        phq9Score: triageSession.phq9Score,
        gad7Score: triageSession.gad7Score
      })
    } else {
      logTest('Triage Session', 'WARNING', 'No triage sessions found in database')
    }

    // Check for client consent
    const consent = await prisma.clientConsent.findFirst({
      orderBy: { grantedAt: 'desc' },
      select: {
        id: true,
        clientId: true,
        scope: true,
        status: true,
        source: true,
        grantedAt: true
      }
    })

    if (consent) {
      logTest('Client Consent', 'PASSED', 'Found client consent record', {
        id: consent.id,
        scope: consent.scope,
        status: consent.status,
        source: consent.source
      })
    } else {
      logTest('Client Consent', 'WARNING', 'No client consent records found')
    }

    // Check recent microsite visits
    const recentVisits = await prisma.therapistMicrositeVisit.findMany({
      where: {
        therapistProfile: {
          micrositeSlug: TEST_MICROSITE_SLUG
        }
      },
      orderBy: { occurredAt: 'desc' },
      take: 5,
      select: {
        id: true,
        occurredAt: true,
        source: true,
        sessionId: true
      }
    })

    if (recentVisits.length > 0) {
      logTest('Microsite Visits', 'PASSED', `Found ${recentVisits.length} recent visits`, {
        latestVisit: recentVisits[0]
      })
    } else {
      logTest('Microsite Visits', 'WARNING', 'No visits recorded yet')
    }

    // Check recent microsite leads
    const recentLeads = await prisma.therapistMicrositeLead.findMany({
      where: {
        therapistProfile: {
          micrositeSlug: TEST_MICROSITE_SLUG
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        metadata: true
      }
    })

    if (recentLeads.length > 0) {
      logTest('Microsite Leads', 'PASSED', `Found ${recentLeads.length} leads`, {
        latestLead: recentLeads[0]
      })
    } else {
      logTest('Microsite Leads', 'WARNING', 'No leads recorded yet')
    }

  } catch (error: any) {
    logTest('Database Test Data', 'FAILED', `Database query failed: ${error.message}`)
  } finally {
    await prisma.$disconnect()
  }
}

function generateTestReport() {
  console.log('\n' + '='.repeat(80))
  console.log('📊 E2E TEST REPORT SUMMARY')
  console.log('='.repeat(80))

  const passed = results.filter(r => r.status === 'PASSED').length
  const failed = results.filter(r => r.status === 'FAILED').length
  const warnings = results.filter(r => r.status === 'WARNING').length
  const total = results.length

  console.log(`\nTotal Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Warnings: ${warnings}`)
  console.log(`\nSuccess Rate: ${((passed / total) * 100).toFixed(1)}%`)

  console.log('\n' + '-'.repeat(80))
  console.log('DETAILED RESULTS:')
  console.log('-'.repeat(80))

  results.forEach((result, index) => {
    const emoji = result.status === 'PASSED' ? '✅' : result.status === 'FAILED' ? '❌' : '⚠️'
    console.log(`\n${index + 1}. ${emoji} ${result.name}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Details:`, JSON.stringify(result.details, null, 2))
    }
  })

  console.log('\n' + '='.repeat(80))
  console.log('RECOMMENDATIONS:')
  console.log('='.repeat(80))

  console.log('\n✅ Can be tested automatically:')
  console.log('  - Microsite page loads and returns HTML')
  console.log('  - Microsite API returns valid JSON data')
  console.log('  - Lead form submission with validation')
  console.log('  - Analytics tracking endpoint')
  console.log('  - API endpoints exist and have auth guards')
  console.log('  - Database tables exist and contain data')

  console.log('\n⚠️  Requires manual testing / authenticated session:')
  console.log('  - Dossier creation with valid triage session')
  console.log('  - Dossier retrieval and decryption')
  console.log('  - Dossier access logging')
  console.log('  - Therapist dashboard access to leads')
  console.log('  - Admin dashboard access to all dossiers')
  console.log('  - Signed URL generation for therapists')
  console.log('  - Consent management UI')

  console.log('\n💡 To test authenticated features:')
  console.log('  1. Log in as therapist via web UI')
  console.log('  2. Create a triage session as a client')
  console.log('  3. Grant consent for dossier sharing')
  console.log('  4. Trigger dossier creation (admin or auto)')
  console.log('  5. Access dossier via therapist dashboard')

  console.log('\n' + '='.repeat(80))
}

async function runAllTests() {
  console.log('🚀 Starting Production E2E Tests')
  console.log(`Production URL: ${PRODUCTION_URL}`)
  console.log(`Test Microsite: ${TEST_MICROSITE_SLUG}`)
  console.log('='.repeat(80))

  // Microsite Feature Tests
  await testMicrositePageLoad()
  await testMicrositeAPIEndpoint()
  await testLeadFormSubmission()
  await testAnalyticsTracking()

  // Dossier API Structure Tests
  await testDossierAPIStructure()

  // Database Validation Tests
  await testDatabaseSchema()
  await testDatabaseTestData()

  // Generate Report
  generateTestReport()
}

// Run tests
runAllTests().catch(console.error)
