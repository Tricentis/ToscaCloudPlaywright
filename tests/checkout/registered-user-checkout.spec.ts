import { test, expect } from '../../fixtures/test-options';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { US_ADDRESS } from '../../fixtures/test-data';

test('a registered user can complete a purchase end to end', async ({ page, registeredUser }) => {
  const product = new ProductPage(page, 13);
  await product.goto('/computing-and-internet');
  await product.addToCart(1);
  await product.expectSuccessNotification('The product has been added to your shopping cart');

  const cart = new CartPage(page);
  await cart.goto();
  await cart.proceedToCheckout();

  const checkout = new CheckoutPage(page);
  await checkout.fillBillingAddress({
    firstName: registeredUser.firstName,
    lastName: registeredUser.lastName,
    email: registeredUser.email,
    ...US_ADDRESS,
  });
  await checkout.continueShipping();
  await checkout.continueShippingMethod();
  await checkout.continuePaymentMethod();
  await checkout.continuePaymentInfo();
  await checkout.confirmOrder();

  await checkout.expectOrderCompleted();
  await expect(checkout.orderNumberText).toContainText('Order number:');
});
