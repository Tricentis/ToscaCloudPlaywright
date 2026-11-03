import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productName: Locator;
  readonly addToCompareButton: Locator;
  readonly addYourReviewLink: Locator;

  constructor(page: Page, private readonly productId: number) {
    super(page);
    this.productName = page.locator('.product-name h1');
    this.addToCompareButton = page.locator('.add-to-compare-list-button');
    this.addYourReviewLink = page.locator('.product-review-links a', { hasText: 'Add your review' });
  }

  get quantityInput(): Locator {
    return this.page.locator(`#addtocart_${this.productId}_EnteredQuantity`);
  }

  get addToCartButton(): Locator {
    return this.page.locator(`#add-to-cart-button-${this.productId}`);
  }

  async addToCart(quantity?: number) {
    if (quantity !== undefined) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }

  async addToCompareList() {
    await this.addToCompareButton.click();
  }

  async goToWriteReview() {
    await this.addYourReviewLink.click();
  }
}
