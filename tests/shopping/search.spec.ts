import { test, expect } from '../../fixtures/test-options';
import { BasePage } from '../../pages/BasePage';
import { SearchResultsPage } from '../../pages/SearchResultsPage';

test('a visitor can search for a product by keyword', async ({ page }) => {
  const home = new BasePage(page);
  await home.goto('/');

  await home.search('computer');

  const results = new SearchResultsPage(page);
  await expect(results.resultItems.first()).toBeVisible();
  await expect(results.productLink('Build your own computer')).toBeVisible();
});
