import { test, expect } from '../../fixtures/test-options';
import { ProductReviewsPage } from '../../pages/ProductReviewsPage';

test('a logged-in user can write and submit a product review', async ({ page, registeredUser }) => {
  const reviews = new ProductReviewsPage(page, 13);
  await reviews.goto();

  await reviews.submitReview('Great book', 'Really helped me learn the basics.');

  await expect(reviews.resultMessage).toHaveText('Product review is successfully added.');
});
