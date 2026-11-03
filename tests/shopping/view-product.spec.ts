import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';

test('a visitor can view a product detail page', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');

  await expect(product.productName).toHaveText('Computing and Internet');
  await expect(product.addToCartButton).toBeVisible();
  await expect(product.addToCompareButton).toBeVisible();
});
