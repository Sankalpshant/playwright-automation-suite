// tests/login.spec.js
// Covers: functional login, negative auth, locked-out user, boundary/edge inputs.

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('Login', () => {
  test('valid standard_user can log in', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('invalid password shows error message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', 'wrong_password');
    await expect(login.errorMessage).toBeVisible();
    expect(await login.getErrorText()).toContain('Username and password do not match');
  });

  test('locked_out_user is blocked with specific error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('locked_out_user', 'secret_sauce');
    expect(await login.getErrorText()).toContain('locked out');
  });

  test('empty username field shows validation error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('', 'secret_sauce');
    expect(await login.getErrorText()).toContain('Username is required');
  });

  test('empty password field shows validation error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('standard_user', '');
    expect(await login.getErrorText()).toContain('Password is required');
  });

  test('both fields empty shows username-required error first', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('', '');
    expect(await login.getErrorText()).toContain('Username is required');
  });

  test('SQL-injection-style input is rejected, not executed', async ({ page }) => {
    // Boundary/security-adjacent case: make sure junk input just fails
    // auth cleanly instead of doing something unexpected.
    const login = new LoginPage(page);
    await login.goto();
    await login.login("' OR '1'='1", "' OR '1'='1");
    expect(await login.getErrorText()).toContain('do not match');
  });

  test('username with leading/trailing whitespace fails (no auto-trim)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('  standard_user  ', 'secret_sauce');
    await expect(login.errorMessage).toBeVisible();
  });

  test('problem_user can still log in despite known UI bugs', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('problem_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('performance_glitch_user logs in within acceptable timeout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/, { timeout: 10000 });
  });
});
