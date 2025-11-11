#!/usr/bin/env node

/**
 * Authenticated API Testing Script
 * Tests Dossier APIs with real authentication
 */

const BASE_URL = 'https://findmytherapy-qyva-96w27ymoy-philipps-projects-0f51423d.vercel.app';

const CREDENTIALS = {
  admin: {
    email: 'dr.mueller@example.com',
    password: 'Therapist123!',
  },
};

// Store cookies
let sessionCookie = null;

/**
 * Helper to make authenticated requests
 */
async function fetchWithAuth(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (sessionCookie) {
    headers['Cookie'] = sessionCookie;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Capture cookies from response
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    sessionCookie = setCookie.split(';')[0];
  }

  return response;
}

/**
 * Test 1: Login and get session
 */
async function testLogin() {
  console.log('\n🔐 Test 1: Login with Credentials');
  console.log('=====================================');

  try {
    // First, get the login page to get CSRF token
    const loginPageResponse = await fetch(`${BASE_URL}/login`);
    const loginPageHtml = await loginPageResponse.text();

    // Try to extract CSRF token from HTML
    const csrfMatch = loginPageHtml.match(/name="csrfToken"\s+value="([^"]+)"/);
    const csrfToken = csrfMatch ? csrfMatch[1] : '';

    console.log(`CSRF Token: ${csrfToken ? '✅ Found' : '❌ Not found'}`);

    // Attempt login via NextAuth credentials provider
    const loginResponse = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: CREDENTIALS.admin.email,
        password: CREDENTIALS.admin.password,
        csrfToken: csrfToken,
        callbackUrl: '/dashboard',
        json: 'true',
      }).toString(),
      redirect: 'manual',
    });

    const setCookie = loginResponse.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie;
      console.log('✅ Session cookie received');
    }

    console.log(`Status: ${loginResponse.status}`);
    console.log(`Redirect: ${loginResponse.headers.get('location') || 'none'}`);

    // Check session
    const sessionResponse = await fetchWithAuth(`${BASE_URL}/api/auth/session`);
    const session = await sessionResponse.json();

    if (session && session.user) {
      console.log('✅ Login successful!');
      console.log(`   User: ${session.user.email}`);
      console.log(`   Role: ${session.user.role || 'N/A'}`);
      return { success: true, session };
    } else {
      console.log('❌ Login failed - no session');
      console.log('Session response:', session);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Test 2: Get Triage Session for Dossier Creation
 */
async function getTriageSession() {
  console.log('\n📋 Test 2: Find Triage Session for Dossier');
  console.log('============================================');

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgres://519377ae28a0ad2e00ad359452f55f9968be68a152c3db664b89a47fd1e6c4ed:sk_yEDNjXtstT8H9Mf2Tyq_6@db.prisma.io:5432/postgres?sslmode=require',
      },
    },
  });

  try {
    const triageSession = await prisma.triageSession.findFirst({
      where: {
        riskLevel: { not: null },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        clientId: true,
        phq9Score: true,
        gad7Score: true,
        riskLevel: true,
      },
    });

    if (triageSession) {
      console.log('✅ Found triage session:');
      console.log(`   ID: ${triageSession.id}`);
      console.log(`   Client ID: ${triageSession.clientId}`);
      console.log(`   PHQ-9: ${triageSession.phq9Score}`);
      console.log(`   GAD-7: ${triageSession.gad7Score}`);
      console.log(`   Risk: ${triageSession.riskLevel}`);
      await prisma.$disconnect();
      return triageSession;
    } else {
      console.log('❌ No triage session found');
      await prisma.$disconnect();
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    return null;
  }
}

/**
 * Test 3: Get Therapist Profile
 */
async function getTherapistProfile() {
  console.log('\n👨‍⚕️ Test 3: Find Therapist Profile');
  console.log('====================================');

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgres://519377ae28a0ad2e00ad359452f55f9968be68a152c3db664b89a47fd1e6c4ed:sk_yEDNjXtstT8H9Mf2Tyq_6@db.prisma.io:5432/postgres?sslmode=require',
      },
    },
  });

  try {
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        status: 'VERIFIED',
      },
      select: {
        id: true,
        displayName: true,
        userId: true,
      },
    });

    if (profile) {
      console.log('✅ Found therapist profile:');
      console.log(`   ID: ${profile.id}`);
      console.log(`   Name: ${profile.displayName}`);
      console.log(`   User ID: ${profile.userId}`);
      await prisma.$disconnect();
      return profile;
    } else {
      console.log('❌ No verified therapist profile found');
      await prisma.$disconnect();
      return null;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    return null;
  }
}

/**
 * Test 4: Create Dossier (authenticated)
 */
async function testCreateDossier(triageSession, therapistProfile) {
  console.log('\n📝 Test 4: Create Dossier (Authenticated)');
  console.log('===========================================');

  if (!sessionCookie) {
    console.log('❌ No session cookie - skipping');
    return null;
  }

  if (!triageSession || !therapistProfile) {
    console.log('❌ Missing triage session or therapist profile - skipping');
    return null;
  }

  try {
    const payload = {
      triageSessionId: triageSession.id,
      recommendedTherapistIds: [therapistProfile.id],
      trigger: 'ADMIN',
    };

    console.log('Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetchWithAuth(`${BASE_URL}/api/dossiers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const status = response.status;
    console.log(`Status: ${status}`);

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (status === 201) {
      console.log('✅ Dossier created successfully!');
      console.log(`   Dossier ID: ${data.data?.dossierId}`);
      console.log(`   Risk Level: ${data.data?.riskLevel}`);
      console.log(`   Expires At: ${data.data?.expiresAt}`);
      return data.data;
    } else if (status === 401 || status === 403) {
      console.log('❌ Authentication/Authorization failed');
      console.log('   This is expected if the session is not properly established');
      return null;
    } else {
      console.log(`⚠️ Unexpected status: ${status}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating dossier:', error.message);
    return null;
  }
}

/**
 * Test 5: List Dossiers (authenticated)
 */
async function testListDossiers() {
  console.log('\n📋 Test 5: List Dossiers (Authenticated)');
  console.log('=========================================');

  if (!sessionCookie) {
    console.log('❌ No session cookie - skipping');
    return;
  }

  try {
    const response = await fetchWithAuth(`${BASE_URL}/api/dossiers`);
    const status = response.status;
    console.log(`Status: ${status}`);

    const data = await response.json();

    if (status === 200) {
      console.log('✅ Dossiers retrieved successfully!');
      console.log(`   Count: ${data.data?.length || 0}`);
      if (data.data && data.data.length > 0) {
        console.log('   First dossier:', {
          id: data.data[0].id,
          riskLevel: data.data[0].riskLevel,
          createdAt: data.data[0].createdAt,
        });
      }
    } else if (status === 401 || status === 403) {
      console.log('❌ Authentication/Authorization failed');
      console.log('Response:', data);
    } else {
      console.log(`⚠️ Unexpected status: ${status}`);
      console.log('Response:', data);
    }
  } catch (error) {
    console.error('❌ Error listing dossiers:', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  🧪 Authenticated API Testing Suite       ║');
  console.log('╚════════════════════════════════════════════╝');

  // Test 1: Login
  const loginResult = await testLogin();

  if (!loginResult.success) {
    console.log('\n⚠️ Cannot proceed without authentication');
    console.log('\n📝 MANUAL TESTING REQUIRED:');
    console.log('   1. Open browser to:', `${BASE_URL}/login`);
    console.log('   2. Login with: dr.mueller@example.com / Therapist123!');
    console.log('   3. Open browser console');
    console.log('   4. Test dossier creation with:');
    console.log('      ```javascript');
    console.log('      fetch("/api/dossiers", {');
    console.log('        method: "POST",');
    console.log('        headers: {"Content-Type": "application/json"},');
    console.log('        body: JSON.stringify({');
    console.log('          triageSessionId: "<triage-id>",');
    console.log('          recommendedTherapistIds: ["<therapist-id>"],');
    console.log('          trigger: "ADMIN"');
    console.log('        })');
    console.log('      }).then(r => r.json()).then(console.log);');
    console.log('      ```');
    return;
  }

  // Test 2 & 3: Get data for dossier creation
  const triageSession = await getTriageSession();
  const therapistProfile = await getTherapistProfile();

  // Test 4: Create dossier
  await testCreateDossier(triageSession, therapistProfile);

  // Test 5: List dossiers
  await testListDossiers();

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  ✅ Testing Complete                       ║');
  console.log('╚════════════════════════════════════════════╝\n');
}

// Run tests
runTests().catch(console.error);
