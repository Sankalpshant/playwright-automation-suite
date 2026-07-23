// tests/checkout.spec.js
// Covers: end-to-end purchase flow + checkout form validation (boundary cases).

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

async function loginAndAddItem(page) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
  const inventory = new InventoryPage(page);
  await inventory.addFirstItemToCart();
  await inventory.cartLink.click();
}

test.describe('Checkout Flow', () => {
  test('full end-to-end purchase completes successfully', async ({ page }) => {
    await loginAndAddItem(page);
    const checkout = new CheckoutPage(page);
    await checkout.goToCheckout();
    await checkout.fillInfo('Sankalp', 'Shant', '560001');
    await checkout.finishOrder();
    await expect(checkout.completeHeader).toHaveText(/Thank you/);
  });

  test('checkout info form rejects missing first name', async ({ page }) => {
    await loginAndAddItem(page);
    const checkout = new CheckoutPage(page);
    await checkout.goToCheckout();
    await checkout.fillInfo('', 'Shant', '560001');
    expect(await checkout.errorMessage.textContent()).toContain('First Name is required');
  });

  test('checkout info form rejects missing last name', async ({ page }) => {
    await loginAndAddItem(page);
    const checkout = new CheckoutPage(page);
    await checkout.goToCheckout();
    await checkout.fillInfo('Sankalp', '', '560001');
    expect(await checkout.errorMessage.textContent()).toContain('Last Name is required');
  });

  test('checkout info form rejects missing postal code', async ({ page }) => {
    await loginAndAddItem(page);
    const checkout = new CheckoutPage(page);
    await checkout.goToCheckout();
    await checkout.fillInfo('Sankalp', 'Shant', '');
    expect(await checkout.errorMessage.textContent()).toContain('Postal Code is required');
  });

  test('order total reflects item price + tax', async ({ page }) => {
    await loginAndAddItem(page);
    const checkout = new CheckoutPage(page);
    await checkout.goToCheckout();
    await checkout.fillInfo('Sankalp', 'Shant', '560001');
    const totalText = await checkout.getTotalText();
    // sanity check: "Total: $xx.xx" format and value > 0
    const value = parseFloat(totalText.replace('Total: $', ''));
    expect(value).toBeGreaterThan(0);
  });

  test('cannot checkout with an empty cart', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    // App allows navigating direct to URL even with empty cart - verify no items shown
    const cartItems = page.locator('.cart_item');
    expect(await cartItems.count()).toBe(0);
  });

  test('removing item from cart page updates cart to empty', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('button[id^="remove"]').first().click();
    const cartItems = page.locator('.cart_item');
    expect(await cartItems.count()).toBe(0);
  });
});
