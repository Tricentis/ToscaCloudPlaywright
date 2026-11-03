import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly updateCartButton: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly couponCodeInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponMessage: Locator;
  readonly emptyCartMessage: Locator;
  readonly checkoutAsGuestButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('tr.cart-item-row');
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
    this.couponCodeInput = page.locator('input[name="discountcouponcode"]');
    this.applyCouponButton = page.locator('input[name="applydiscountcouponcode"]');
    this.couponMessage = page.locator('.coupon-box .message');
    this.emptyCartMessage = page.locator('.order-summary-content', { hasText: 'is empty' });
    // Only shown to guests: a "Checkout as Guest / Register / Log in" interstitial.
    this.checkoutAsGuestButton = page.locator('.checkout-as-guest-button');
  }

  async goto() {
    await super.goto('/cart');
  }

  rowFor(productName: string): Locator {
    return this.cartRows.filter({ has: this.page.locator('.product-name', { hasText: productName }) });
  }

  async setQuantity(productName: string, quantity: number) {
    await this.rowFor(productName).locator('.qty-input').fill(String(quantity));
    await this.updateCartButton.click();
  }

  async removeItem(productName: string) {
    await this.rowFor(productName).locator('input[type="checkbox"]').check();
    await this.updateCartButton.click();
  }

  async applyCoupon(code: string) {
    await this.couponCodeInput.fill(code);
    await this.applyCouponButton.click();
  }

  async proceedToCheckout() {
    await this.termsCheckbox.check();
    await this.checkoutButton.click();
  }

  /** Only needed for guests: nopCommerce interposes a "Checkout as Guest / Register / Log in" page. */
  async continueAsGuest() {
    await this.checkoutAsGuestButton.click();
  }
}
