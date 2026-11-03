import { test, expect } from '../../fixtures/test-options';
import { CategoryPage } from '../../pages/CategoryPage';

test('a visitor can add a product to the cart from a category list', async ({ page }) => {
  const category = new CategoryPage(page);
  await category.goto('/books');

  await category.addToCartButtonFor('Computing and Internet').click();

  await category.expectSuccessNotification('The product has been added to your shopping cart');
  await expect(category.cartQty).toHaveText('(1)');
});
