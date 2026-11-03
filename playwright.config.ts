import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  fullyParallel: true,
  workers: 3,
  retries: 1,
  globalSetup: require.resolve('./global-setup'),
  reporter: [
    ['html'],
    ['blob', { outputDir: 'blob-report' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
