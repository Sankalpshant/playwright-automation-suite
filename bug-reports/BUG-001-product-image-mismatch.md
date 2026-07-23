# BUG-001: Product images are mismatched for `problem_user`

**Site:** SauceDemo (https://www.saucedemo.com)
**Severity:** Medium
**Priority:** P2
**Environment:** Chromium (Playwright), Desktop

## Summary
When logging in as `problem_user`, all product images on the inventory page render as the same identical image, instead of each product showing its own distinct image.

## Steps to Reproduce
1. Go to https://www.saucedemo.com/
2. Log in with username `problem_user`, password `secret_sauce`
3. Observe the inventory page product grid

## Expected Result
Each of the 6 products displays a unique image matching its listing (e.g., red shirt shows a red t-shirt image).

## Actual Result
All 6 products display the identical image (dog food bag image duplicated across all listings).

## Reproduction Rate
100% — happens every time with this user account.

## Notes
Does not occur with `standard_user`. Suggests an account-specific data/asset mapping issue, likely seeded intentionally in this app for QA practice, but treated here as a real defect for reporting practice.
