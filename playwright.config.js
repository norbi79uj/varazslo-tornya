import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "browser.spec.js",
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8000",
    viewport: { width: 1280, height: 1100 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: {
          executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
          args: ["--no-sandbox"],
        },
      },
    },
  ],
  webServer: {
    command: "python3 -m http.server 8000 --bind 127.0.0.1",
    url: "http://127.0.0.1:8000",
    reuseExistingServer: !process.env.CI,
  },
});
