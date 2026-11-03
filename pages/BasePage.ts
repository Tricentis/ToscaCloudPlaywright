import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly cartQty: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly barNotification: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubscribeButton: Locator;
  readonly newsletterResultBlock: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator('a.ico-login');
    this.registerLink = page.locator('a.ico-register');
    this.logoutLink = page.locator('a.ico-logout');
    this.cartLink = page.locator('a.ico-cart');
    this.cartQty = page.locator('.cart-qty');
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.locator('input.search-box-button');
    this.barNotification = page.locator('#bar-notification');
    this.newsletterEmailInput = page.locator('#newsletter-email');
    this.newsletterSubscribeButton = page.locator('#newsletter-subscribe-button');
    this.newsletterResultBlock = page.locator('#newsletter-result-block');
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async search(term: string) {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }

  async openCategory(name: string) {
    await this.page.locator('ul.top-menu > li > a', { hasText: name }).click();
  }

  async expectSuccessNotification(text: string | RegExp) {
    const notification = this.barNotification.filter({ hasText: text });
    await expect(notification).toBeVisible();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async subscribeToNewsletter(email: string) {
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubscribeButton.click();
  }
}
