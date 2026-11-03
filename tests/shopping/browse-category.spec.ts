import { test, expect } from '../../fixtures/test-options';
import { BasePage } from '../../pages/BasePage';
import { CategoryPage } from '../../pages/CategoryPage';

test('a visitor can browse a category into a subcategory', async ({ page }) => {
  const home = new BasePage(page);
  await home.goto('/');
  await home.openCategory('Computers');

  const computers = new CategoryPage(page);
  await expect(computers.pageTitle).toHaveText('Computers');
  await computers.subCategoryLink('Desktops').click();

  const desktops = new CategoryPage(page);
  await expect(desktops.pageTitle).toHaveText('Desktops');
  await expect(desktops.productItems.first()).toBeVisible();
});
