import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  countryId: string;
  city: string;
  address1: string;
  zipPostalCode: string;
  phoneNumber: string;
}

export class AddAddressPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly countrySelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly zipInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#Address_FirstName');
    this.lastNameInput = page.locator('#Address_LastName');
    this.emailInput = page.locator('#Address_Email');
    this.countrySelect = page.locator('#Address_CountryId');
    this.cityInput = page.locator('#Address_City');
    this.address1Input = page.locator('#Address_Address1');
    this.zipInput = page.locator('#Address_ZipPostalCode');
    this.phoneInput = page.locator('#Address_PhoneNumber');
    this.saveButton = page.locator('.save-address-button');
  }

  async goto() {
    await super.goto('/customer/addressadd');
  }

  async fillAndSave(data: AddressData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.countrySelect.selectOption(data.countryId);
    await this.cityInput.fill(data.city);
    await this.address1Input.fill(data.address1);
    await this.zipInput.fill(data.zipPostalCode);
    await this.phoneInput.fill(data.phoneNumber);
    await this.saveButton.click();
  }
}
