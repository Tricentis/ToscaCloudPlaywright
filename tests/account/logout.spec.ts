import { test, expect } from '../../fixtures/test-options';

test('a logged-in user can log out', async ({ page, registeredUser }) => {
  // registeredUser fixture leaves the user logged in.
  const logoutLink = page.locator('a.ico-logout');
  await logoutLink.click();

  await expect(page.locator('a.ico-login')).toBeVisible();
  await expect(page.locator('a.ico-logout')).toHaveCount(0);
});
