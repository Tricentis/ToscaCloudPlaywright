import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductReviewsPage extends BasePage {
  readonly titleInput: Locator;
  readonly reviewTextInput: Locator;
  readonly excellentRatingRadio: Locator;
  readonly submitButton: Locator;
  readonly resultMessage: Locator;

  constructor(page: Page, private readonly productId: number) {
    super(page);
    this.titleInput = page.locator('#AddProductReview_Title');
    this.reviewTextInput = page.locator('#AddProductReview_ReviewText');
    this.excellentRatingRadio = page.locator('#addproductrating_5');
    this.submitButton = page.locator('.write-product-review-button');
    this.resultMessage = page.locator('.page-body > .result');
  }

  async goto() {
    await super.goto(`/productreviews/${this.productId}`);
  }

  async submitReview(title: string, text: string) {
    await this.titleInput.fill(title);
    await this.reviewTextInput.fill(text);
    await this.excellentRatingRadio.check();
    await this.submitButton.click();
  }
}
