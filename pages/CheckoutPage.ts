import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingAddressData {
  firstName: string;
  lastName: string;
  email: string;
  countryId: string;
  city: string;
  address1: string;
  zipPostalCode: string;
  phoneNumber: string;
}

export class CheckoutPage extends BasePage {
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingEmail: Locator;
  readonly billingCountry: Locator;
  readonly billingCity: Locator;
  readonly billingAddress1: Locator;
  readonly billingZip: Locator;
  readonly billingPhone: Locator;
  readonly billingContinueButton: Locator;

  readonly shippingContinueButton: Locator;
  readonly shippingMethodContinueButton: Locator;
  readonly paymentMethodContinueButton: Locator;
  readonly paymentInfoContinueButton: Locator;
  readonly confirmOrderButton: Locator;

  readonly orderCompletedTitle: Locator;
  readonly orderNumberText: Locator;

  constructor(page: Page) {
    super(page);
    this.billingFirstName = page.locator('#BillingNewAddress_FirstName');
    this.billingLastName = page.locator('#BillingNewAddress_LastName');
    this.billingEmail = page.locator('#BillingNewAddress_Email');
    this.billingCountry = page.locator('#BillingNewAddress_CountryId');
    this.billingCity = page.locator('#BillingNewAddress_City');
    this.billingAddress1 = page.locator('#BillingNewAddress_Address1');
    this.billingZip = page.locator('#BillingNewAddress_ZipPostalCode');
    this.billingPhone = page.locator('#BillingNewAddress_PhoneNumber');
    this.billingContinueButton = page.locator('#billing-buttons-container .new-address-next-step-button');

    this.shippingContinueButton = page.locator('#shipping-buttons-container .new-address-next-step-button');
    this.shippingMethodContinueButton = page.locator('#shipping-method-buttons-container .shipping-method-next-step-button');
    this.paymentMethodContinueButton = page.locator('#payment-method-buttons-container .payment-method-next-step-button');
    this.paymentInfoContinueButton = page.locator('#payment-info-buttons-container .payment-info-next-step-button');
    this.confirmOrderButton = page.locator('#confirm-order-buttons-container .confirm-order-next-step-button');

    this.orderCompletedTitle = page.locator('.order-completed .title strong');
    this.orderNumberText = page.locator('.order-completed .details li').filter({ hasText: 'Order number' });
  }

  async goto() {
    await super.goto('/onepagecheckout');
  }

  async fillBillingAddress(data: BillingAddressData) {
    // A registered user's billing form is pre-filled from their account; clear before writing.
    await this.billingFirstName.fill(data.firstName);
    await this.billingLastName.fill(data.lastName);
    await this.billingEmail.fill(data.email);
    await this.billingCountry.selectOption(data.countryId);
    await this.billingCity.fill(data.city);
    await this.billingAddress1.fill(data.address1);
    await this.billingZip.fill(data.zipPostalCode);
    await this.billingPhone.fill(data.phoneNumber);
    await this.billingContinueButton.click();
  }

  async continueShipping() {
    await this.shippingContinueButton.click();
  }

  async continueShippingMethod() {
    await this.shippingMethodContinueButton.click();
  }

  async continuePaymentMethod() {
    await this.paymentMethodContinueButton.click();
  }

  async continuePaymentInfo() {
    await this.paymentInfoContinueButton.click();
  }

  async confirmOrder() {
    await this.confirmOrderButton.click();
  }

  async expectOrderCompleted() {
    await expect(this.orderCompletedTitle).toHaveText('Your order has been successfully processed!');
  }
}
