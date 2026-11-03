import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';

test('a visitor can add a product to the cart from the detail page with a quantity', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');

  await product.addToCart(3);

  await product.expectSuccessNotification('The product has been added to your shopping cart');
  await expect(product.cartQty).toHaveText('(3)');
});
