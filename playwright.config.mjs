import { defineConfig } from '@playwright/test';
const PORT = 8791;
export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '*.spec.mjs',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    viewport: { width: 420, height: 900 },
    serviceWorkers: 'block',
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  },
  webServer: { command: `node tests/e2e/server.mjs ${PORT}`, url: `http://localhost:${PORT}/`, reuseExistingServer: !process.env.CI },
});
