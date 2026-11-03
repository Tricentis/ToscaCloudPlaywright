import { test, expect } from '../../fixtures/test-options';
import { AddressesPage } from '../../pages/AddressesPage';
import { AddAddressPage } from '../../pages/AddAddressPage';
import { US_ADDRESS } from '../../fixtures/test-data';

test('a registered user can add a new address', async ({ page, registeredUser }) => {
  const addresses = new AddressesPage(page);
  await addresses.goto();
  await addresses.addNewButton.click();

  const addAddress = new AddAddressPage(page);
  await addAddress.fillAndSave({
    firstName: registeredUser.firstName,
    lastName: registeredUser.lastName,
    email: registeredUser.email,
    ...US_ADDRESS,
  });

  const newAddress = addresses.addressItems.filter({ hasText: US_ADDRESS.address1 });
  await expect(newAddress).toBeVisible();
});
