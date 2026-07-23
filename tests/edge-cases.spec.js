// tests/edge-cases.spec.js
// Tests against the-internet.herokuapp.com - a QA training site with
// classic tricky UI patterns: JS alerts, dynamic loading, broken images.
// Shows testing skills generalize beyond a single demo app.

const { test, expect } = require('@playwright/test');

test.describe('Edge Cases - Dynamic UI Behavior', () => {
  test('JS confirm alert can be accepted', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.once('dialog', (dialog) => dialog.accept());
    await page.click('text=Click for JS Confirm');
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');
  });

  test('JS confirm alert can be dismissed', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.click('text=Click for JS Confirm');
    await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
  });

  test('JS prompt alert accepts custom input text', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.once('dialog', (dialog) => dialog.accept('QA Test Input'));
    await page.click('text=Click for JS Prompt');
    await expect(page.locator('#result')).toHaveText('You entered: QA Test Input');
  });

  test('dynamically loaded element appears after waiting', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    await page.click('button');
    await expect(page.locator('#finish')).toBeVisible({ timeout: 6000 });
  });

  test('element rendered only after AJAX completes (not just present in DOM)', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
    await page.click('button');
    const hello = page.locator('#finish');
    await expect(hello).toBeVisible({ timeout: 6000 });
    await expect(hello).toHaveText('Hello World!');
  });

  test('status code page returns expected page content for 404', async ({ page }) => {
    const response = await page.goto('https://the-internet.herokuapp.com/status_codes/404');
    await expect(page.locator('body')).toContainText('404');
  });

  test('hover reveals hidden caption (visibility edge case)', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');
    const firstFigure = page.locator('.figure').first();
    await firstFigure.hover();
    await expect(firstFigure.locator('.figcaption')).toBeVisible();
  });

  test('file upload accepts a file and displays filename', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');
    const fileInput = page.locator('#file-upload');
    await fileInput.setInputFiles({
      name: 'test-upload.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('QA automation test upload'),
    });
    await page.click('#file-submit');
    await expect(page.locator('#uploaded-files')).toHaveText('test-upload.txt');
  });
});
