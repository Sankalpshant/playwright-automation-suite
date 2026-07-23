// pages/InventoryPage.js
// Page Object for the product listing page after login.

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');
  }

  async isLoaded() {
    return this.pageTitle.isVisible();
  }

  async getItemCount() {
    return this.inventoryItems.count();
  }

  async addFirstItemToCart() {
    await this.addToCartButtons.first().click();
  }

  // Returns the action button (Add to Cart / Remove) scoped to the FIRST
  // product card specifically. Unlike addToCartButtons.first(), this stays
  // correct even after the button's id/text changes from "add-to-cart-x"
  // to "remove-x" post-click, because it's scoped by position, not id.
  firstItemActionButton() {
    return this.inventoryItems.first().locator('button');
  }

  async getCartCount() {
    // returns 0 if badge isn't present (empty cart)
    const visible = await this.cartBadge.isVisible().catch(() => false);
    if (!visible) return 0;
    return parseInt(await this.cartBadge.textContent(), 10);
  }

  async sortBy(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getItemPrices() {
    const priceLocators = this.page.locator('.inventory_item_price');
    const texts = await priceLocators.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }
}

module.exports = { InventoryPage };
