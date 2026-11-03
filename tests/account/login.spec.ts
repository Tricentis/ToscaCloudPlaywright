import { test, expect } from '../../fixtures/test-options';
import { LoginPage } from '../../pages/LoginPage';

test('a registered user can log in with valid credentials', async ({ page, registeredUser }) => {
  // registeredUser fixture registers and logs the user in; log out first to test login explicitly.
  const loginPage = new LoginPage(page);
  await loginPage.logoutLink.click();

  await loginPage.goto();
  await loginPage.login(registeredUser.email, registeredUser.password);

  await expect(loginPage.logoutLink).toBeVisible();
  await expect(loginPage.loginLink).toHaveCount(0);
});
