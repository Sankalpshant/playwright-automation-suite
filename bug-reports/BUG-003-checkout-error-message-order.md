# BUG-003: Checkout form shows only first validation error, not all invalid fields

**Site:** SauceDemo (https://www.saucedemo.com)
**Severity:** Low
**Priority:** P3
**Environment:** Chromium (Playwright), Desktop

## Summary
When submitting the checkout info form with multiple fields blank (e.g., First Name AND Last Name both empty), the form only shows an error for the first missing field, not a consolidated list of all invalid fields.

## Steps to Reproduce
1. Log in as `standard_user` / `secret_sauce`
2. Add an item to cart, go to Checkout
3. Leave First Name and Last Name both blank, fill Postal Code
4. Click Continue

## Expected Result
Either: (a) all invalid fields are highlighted with a combined error message, or (b) at minimum the error message clarifies "and X more field(s) required."

## Actual Result
Only "Error: First Name is required" is shown. User must fix and resubmit repeatedly to discover the Last Name field is also required.

## Reproduction Rate
100%

## Impact
UX friction rather than a functional blocker — user eventually completes the form, but through unnecessary trial and error. Worth flagging as a UX improvement in addition to a bug.
