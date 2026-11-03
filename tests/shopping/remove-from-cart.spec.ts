import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('a user can remove a product from the cart', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');
  await product.addToCart(1);
  await product.expectSuccessNotification('The product has been added to your shopping cart');

  const cart = new CartPage(page);
  await cart.goto();
  await cart.removeItem('Computing and Internet');

  await expect(cart.emptyCartMessage).toBeVisible();
});
