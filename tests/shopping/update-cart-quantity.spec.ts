import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('a user can update a product quantity in the cart', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');
  await product.addToCart(1);
  await product.expectSuccessNotification('The product has been added to your shopping cart');

  const cart = new CartPage(page);
  await cart.goto();
  await cart.setQuantity('Computing and Internet', 4);

  await expect(cart.rowFor('Computing and Internet').locator('.qty-input')).toHaveValue('4');
  await expect(cart.rowFor('Computing and Internet').locator('.product-subtotal')).toHaveText('40.00');
});
