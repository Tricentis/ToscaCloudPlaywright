import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderHistoryPage extends BasePage {
  readonly orderItems: Locator;

  constructor(page: Page) {
    super(page);
    this.orderItems = page.locator('.order-item');
  }

  async goto() {
    await super.goto('/customer/orders');
  }

  orderWithNumber(orderNumber: string): Locator {
    return this.orderItems.filter({ hasText: `Order Number: ${orderNumber}` });
  }
}
