import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  readonly resultItems: Locator;

  constructor(page: Page) {
    super(page);
    this.resultItems = page.locator('.search-results .product-item');
  }

  productLink(name: string): Locator {
    return this.resultItems.locator('.product-title a', { hasText: name });
  }
}
