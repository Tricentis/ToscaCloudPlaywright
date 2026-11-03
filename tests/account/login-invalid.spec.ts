import { test, expect } from '../../fixtures/test-options';
import { LoginPage } from '../../pages/LoginPage';

test('logging in with invalid credentials shows an error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login('nonexistent.user@example.com', 'WrongPassword123!');

  await expect(loginPage.validationErrors).toContainText('No customer account found');
  await expect(loginPage.loginLink).toBeVisible();
});
