import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('.login-page #Email');
    this.passwordInput = page.locator('.login-page #Password');
    this.rememberMeCheckbox = page.locator('.login-page #RememberMe');
    this.loginButton = page.locator('.login-page .login-button');
    this.validationErrors = page.locator('.login-page .validation-summary-errors');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
