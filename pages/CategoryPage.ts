import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly subCategoryItems: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.page-title h1');
    this.subCategoryItems = page.locator('.sub-category-grid .sub-category-item');
    this.productItems = page.locator('.product-grid .product-item');
  }

  subCategoryLink(name: string): Locator {
    return this.subCategoryItems.locator('a', { hasText: name });
  }

  productLink(name: string): Locator {
    return this.productItems.locator('.product-title a', { hasText: name });
  }

  addToCartButtonFor(name: string): Locator {
    return this.productItems
      .filter({ has: this.page.locator('.product-title a', { hasText: name }) })
      .locator('.product-box-add-to-cart-button');
  }
}
