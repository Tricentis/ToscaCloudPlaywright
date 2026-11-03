import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddressesPage extends BasePage {
  readonly addNewButton: Locator;
  readonly addressItems: Locator;

  constructor(page: Page) {
    super(page);
    this.addNewButton = page.locator('.add-address-button');
    this.addressItems = page.locator('.address-item');
  }

  async goto() {
    await super.goto('/customer/addresses');
  }
}
