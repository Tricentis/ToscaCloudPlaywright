import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test('entering an invalid coupon code in the cart shows an error', async ({ page }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');
  await product.addToCart(1);
  await product.expectSuccessNotification('The product has been added to your shopping cart');

  const cart = new CartPage(page);
  await cart.goto();
  await cart.applyCoupon('INVALID-COUPON-CODE');

  await expect(cart.couponMessage).toHaveText("The coupon code you entered couldn't be applied to your order");
});
