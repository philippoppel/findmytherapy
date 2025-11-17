import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local for database connection
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/e2e/**/*.spec.ts', '**/visual/**/*.spec.ts'],
  testIgnore: ['**/integration/**', '**/fixtures/**', '**/utils/**'],
  timeout: 45_000, // Reduced from 60s
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0, // Reduced from 2 to 1
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
    colorScheme: 'light',
    screenshot: 'only-on-failure',
  },
  projects: process.env.CI
    ? [
        // In CI, only run chromium to save time and resources
        {
          name: 'chromium-desktop',
          use: { ...devices['Desktop Chrome'] },
        },
      ]
    : [
        // Locally, run all browsers for comprehensive testing
        {
          name: 'chromium-desktop',
          use: { ...devices['Desktop Chrome'] },
        },
        {
          name: 'mobile-chrome',
          use: { ...devices['Pixel 5'] },
        },
        {
          name: 'mobile-safari',
          use: { ...devices['iPhone 13'] },
        },
        {
          name: 'tablet',
          use: { ...devices['iPad Pro'] },
        },
        {
          name: 'firefox-desktop',
          use: { ...devices['Desktop Firefox'] },
        },
        {
          name: 'webkit-desktop',
          use: { ...devices['Desktop Safari'] },
        },
      ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'pnpm --filter web dev',
        url: BASE_URL,
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
});
