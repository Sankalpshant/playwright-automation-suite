// tests/inventory.spec.js
// Covers: product listing, sorting, cart badge state.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');

async function loginAsStandardUser(page) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login('standard_user', 'secret_sauce');
}

test.describe('Inventory / Product Listing', () => {
  test('all 6 products are displayed after login', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    expect(await inventory.getItemCount()).toBe(6);
  });

  test('cart badge is hidden when cart is empty', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    expect(await inventory.getCartCount()).toBe(0);
  });

  test('cart badge increments when item is added', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.addFirstItemToCart();
    expect(await inventory.getCartCount()).toBe(1);
  });

  test('adding same item twice does not double-count (button becomes Remove)', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    const button = inventory.firstItemActionButton();
    await button.click(); // Add to Cart
    expect(await inventory.getCartCount()).toBe(1);
    await button.click(); // same physical button, now labeled Remove
    expect(await inventory.getCartCount()).toBe(0);
  });

  test('sort Price Low to High orders items ascending', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sort Price High to Low orders items descending', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.sortBy('hilo');
    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('sort Name A to Z orders items alphabetically', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.sortBy('az');
    const names = await page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('clicking cart icon navigates to cart page', async ({ page }) => {
    await loginAsStandardUser(page);
    const inventory = new InventoryPage(page);
    await inventory.cartLink.click();
    await expect(page).toHaveURL(/cart.html/);
  });
});
