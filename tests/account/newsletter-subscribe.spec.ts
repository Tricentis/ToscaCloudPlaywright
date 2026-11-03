import { test, expect } from '../../fixtures/test-options';
import { BasePage } from '../../pages/BasePage';
import { uniqueEmail } from '../../fixtures/test-data';

test('a visitor can subscribe to the newsletter', async ({ page }) => {
  const home = new BasePage(page);
  await home.goto('/');

  await home.subscribeToNewsletter(uniqueEmail('newsletter'));

  await expect(home.newsletterResultBlock).toContainText('Thank you for signing up!');
});
