import { test, expect } from '../../fixtures/test-options';
import { RegisterPage } from '../../pages/RegisterPage';
import { uniqueEmail, STRONG_PASSWORD } from '../../fixtures/test-data';

test('a visitor can register a new account', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.goto();

  await registerPage.register({
    firstName: 'PW',
    lastName: 'Test',
    email: uniqueEmail(),
    password: STRONG_PASSWORD,
  });

  await expect(registerPage.resultMessage).toHaveText('Your registration completed');
  await expect(registerPage.logoutLink).toBeVisible();
});
