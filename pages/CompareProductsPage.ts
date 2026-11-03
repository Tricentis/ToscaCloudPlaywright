import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CompareProductsPage extends BasePage {
  readonly table: Locator;
  readonly productNameRow: Locator;
  readonly clearListLink: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.locator('.compare-products-table');
    this.productNameRow = page.locator('tr.product-name');
    this.clearListLink = page.locator('.clear-list');
  }

  async goto() {
    await super.goto('/compareproducts');
  }
}
