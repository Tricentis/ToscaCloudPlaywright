import { test, expect } from '../../fixtures/test-options';
import { AccountInfoPage } from '../../pages/AccountInfoPage';

test('a registered user can edit their account info', async ({ page, registeredUser }) => {
  const accountInfo = new AccountInfoPage(page);
  await accountInfo.goto();

  await accountInfo.updateNames('Updated', 'Name');

  await accountInfo.goto();
  await expect(accountInfo.firstNameInput).toHaveValue('Updated');
  await expect(accountInfo.lastNameInput).toHaveValue('Name');
});
