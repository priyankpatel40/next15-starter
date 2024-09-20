import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Registration Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // Update fillRegistrationForm to accept optional parameters
  async function fillRegistrationForm(page, testInfo, customData = {}) {
    const name = customData.name || faker.person.fullName();
    const email = customData.email || faker.internet.email();
    const password =
      customData.password ||
      faker.internet.password({
        length: 12,
        pattern: /[A-Za-z0-9!@#$%^&*]/,
      });

    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    testInfo.annotations.push({
      type: 'Registration Data',
      description: `Name: ${name}, Email: ${email}, Password: ${password.replace(/./g, '*')}`,
    });

    return { name, email, password };
  }

  async function logPageState(page, testInfo) {
    testInfo.attach('screenshot', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
    testInfo.attach('html', {
      body: await page.content(),
      contentType: 'text/html',
    });
  }

  // Updated helper function for handling registration result
  async function handleRegistrationResult(page, testInfo, expectedMessage) {
    try {
      await page.waitForSelector(`text=${expectedMessage}`, { timeout: 10000 });
      const messageElement = page.locator(`text=${expectedMessage}`);
      const isVisible = await messageElement.isVisible();

      if (isVisible) {
        testInfo.annotations.push({
          type: 'Registration Result',
          description: 'Success - Expected message displayed',
        });
        testInfo.annotations.push({
          type: 'Message',
          description: expectedMessage,
        });
      } else {
        throw new Error('Expected message not visible');
      }
    } catch (error) {
      testInfo.annotations.push({ type: 'Registration Result', description: 'Failure' });
      testInfo.annotations.push({ type: 'Error', description: error.message });
      await logPageState(page, testInfo);
      throw error;
    }
  }

  test('should handle successful registration', async ({ page }, testInfo) => {
    await fillRegistrationForm(page, testInfo);
    await handleRegistrationResult(
      page,
      testInfo,
      'Confirmation email sent, please verify your account to start!',
    );
  });

  test('should show error for existing user', async ({ page }, testInfo) => {
    const customData = {
      name: 'Existing User',
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    };
    await fillRegistrationForm(page, testInfo, customData);
    await handleRegistrationResult(
      page,
      testInfo,
      "You're already registered with us! Please Sign in to continue !",
    );
  });

  test('should validate form fields', async ({ page }, testInfo) => {
    await page.click('button[type="submit"]');

    try {
      await expect(
        page.locator('text=Name with minimum 3 characters required'),
      ).toBeVisible();
      await expect(page.locator('text=Email is required')).toBeVisible();
      await expect(page.locator('text=Minimum 8 characters required')).toBeVisible();
      testInfo.annotations.push({ type: 'Validation Result', description: 'Success' });
    } catch (error) {
      testInfo.annotations.push({ type: 'Validation Result', description: 'Failure' });
      testInfo.annotations.push({ type: 'Error', description: error.message });
      await logPageState(page, testInfo);
      throw error;
    }
  });

  test('should navigate to login page', async ({ page }, testInfo) => {
    await page.click('text=Already have an account?');

    try {
      await expect(page).toHaveURL('/login');
      testInfo.annotations.push({ type: 'Navigation Result', description: 'Success' });
    } catch (error) {
      testInfo.annotations.push({ type: 'Navigation Result', description: 'Failure' });
      testInfo.annotations.push({ type: 'Error', description: error.message });
      await logPageState(page, testInfo);
      throw error;
    }
  });

  test('should display social registration options', async ({ page }, testInfo) => {
    try {
      await expect(page.locator('text=Signup with Google')).toBeVisible();
      await expect(page.locator('text=Signup with Github')).toBeVisible();
      testInfo.annotations.push({ type: 'Social Options', description: 'Visible' });
    } catch (error) {
      testInfo.annotations.push({ type: 'Social Options', description: 'Not Visible' });
      testInfo.annotations.push({ type: 'Error', description: error.message });
      await logPageState(page, testInfo);
      throw error;
    }
  });
});
