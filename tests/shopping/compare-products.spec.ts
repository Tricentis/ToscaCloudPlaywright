import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';
import { CompareProductsPage } from '../../pages/CompareProductsPage';

test('a visitor can add a product to the comparison list and view it', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');

  await product.addToCompareList();

  const compare = new CompareProductsPage(page);
  await expect(compare.table).toBeVisible();
  await expect(compare.productNameRow).toContainText('Computing and Internet');
});
