/* eslint-disable playwright/no-conditional-in-test */
import { expect, type Page, test, type TestInfo } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  async function fillLoginForm(
    page: Page,
    email: string,
    password: string,
    testInfo: TestInfo,
  ) {
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Log login form data
    testInfo.annotations.push({
      type: 'Login Data',
      description: `Email: ${email}, Password: ${password.replace(/./g, '*')}`,
    });
  }

  async function logPageState(page: Page, testInfo: TestInfo) {
    testInfo.attach('screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    testInfo.attach('html', {
      body: await page.content(),
      contentType: 'text/html',
    });
  }

  test('should handle successful login for SA', async ({ page }, testInfo) => {
    const email = process.env.TEST_EMAIL ?? 'default@example.com';
    const password = process.env.TEST_PASSWORD ?? 'defaultpassword';

    await fillLoginForm(page, email, password, testInfo);

    try {
      await page.waitForURL('/profile-settings', { timeout: 10000 });
      await expect(page).toHaveURL('/profile-settings');
      testInfo.annotations.push({ type: 'Login Result', description: 'Success' });
    } catch (error) {
      testInfo.annotations.push({ type: 'Login Result', description: 'Failure' });
      testInfo.annotations.push({ type: 'Error', description: error.message });
      await logPageState(page, testInfo);
      throw error;
    }
  });

  test('should handle wrong credentials', async ({ page }, testInfo) => {
    const email = process.env.TEST_EMAIL ?? 'default@example.com';
    const password = 'wrongpassword';

    await fillLoginForm(page, email, password, testInfo);

    try {
      const errorLocator = page.locator('text=Invalid credentials!');

      // Wait for either the error message or a navigation
      const result = await Promise.race([
        errorLocator.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'error'),
        page.waitForURL('/login', { timeout: 5000 }).then(() => 'navigation'),
      ]);

      if (result === 'error') {
        const errorMessage = await errorLocator.textContent();
        testInfo.annotations.push({
          type: 'Login Result',
          description: 'Failed (Expected)',
        });
        testInfo.annotations.push({
          type: 'Error Message',
          description: errorMessage || 'No error message found',
        });
      } else {
        testInfo.annotations.push({
          type: 'Login Result',
          description: 'Unexpected Navigation',
        });
        testInfo.annotations.push({ type: 'Current URL', description: page.url() });
      }
    } catch (error) {
      testInfo.annotations.push({
        type: 'Login Result',
        description: 'Unexpected Behavior',
      });
      testInfo.annotations.push({ type: 'Error', description: error.message });

      // Log more details about the page state
      const pageContent = await page.content();
      testInfo.annotations.push({ type: 'Page Content', description: pageContent });

      const visibleText = await page.innerText('body');
      testInfo.annotations.push({ type: 'Visible Text', description: visibleText });

      await logPageState(page, testInfo);
      throw error;
    }

    // Ensure we're still on the login page
    await expect(page).toHaveURL(/\/login/);
  });
  test('should handle invalid credentials', async ({ page }, testInfo) => {
    const email = 'default@example.com';
    const password = 'wrongpassword';

    await fillLoginForm(page, email, password, testInfo);

    try {
      const errorLocator = page.locator('text=Email does not exist!');

      // Wait for either the error message or a navigation
      const result = await Promise.race([
        errorLocator.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'error'),
        page.waitForURL('/login', { timeout: 5000 }).then(() => 'navigation'),
      ]);

      if (result === 'error') {
        const errorMessage = await errorLocator.textContent();
        testInfo.annotations.push({
          type: 'Login Result',
          description: 'Failed (Expected)',
        });
        testInfo.annotations.push({
          type: 'Error Message',
          description: errorMessage || 'No error message found',
        });
      } else {
        testInfo.annotations.push({
          type: 'Login Result',
          description: 'Unexpected Navigation',
        });
        testInfo.annotations.push({ type: 'Current URL', description: page.url() });
      }
    } catch (error) {
      testInfo.annotations.push({
        type: 'Login Result',
        description: 'Unexpected Behavior',
      });
      testInfo.annotations.push({ type: 'Error', description: error.message });

      // Log more details about the page state
      const pageContent = await page.content();
      testInfo.annotations.push({ type: 'Page Content', description: pageContent });

      const visibleText = await page.innerText('body');
      testInfo.annotations.push({ type: 'Visible Text', description: visibleText });

      await logPageState(page, testInfo);
      throw error;
    }

    // Ensure we're still on the login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle two-factor authentication', async ({ page }) => {
    await page.fill('input[name="email"]', 'twoFactor@example.com');
    await page.fill('input[name="password"]', 'password123');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Two Factor Code')).toBeVisible();

    await page.fill('input[name="code"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/profile-settings');
  });

  test('should display social login options', async ({ page }) => {
    await expect(page.locator('text=Login with Google')).toBeVisible();
    await expect(page.locator('text=Login with Github')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.click("text=Don't have an account?");
    await expect(page).toHaveURL('/register');
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL('/reset');
  });
});
