# BUG-002: "Name (A to Z)" sort does not sort alphabetically for `problem_user`

**Site:** SauceDemo (https://www.saucedemo.com)
**Severity:** Medium
**Priority:** P2
**Environment:** Chromium (Playwright), Desktop

## Steps to Reproduce
1. Log in as `problem_user` / `secret_sauce`
2. On the inventory page, open the sort dropdown
3. Select "Name (A to Z)"
4. Read the resulting product name order top to bottom

## Expected Result
Product names should be sorted alphabetically, A → Z.

## Actual Result
Product order remains unchanged / unsorted — same order as default view, not alphabetized.

## Reproduction Rate
100%, consistent across repeated attempts.

## Impact
Low functional impact but directly breaks a core listed feature (sorting), which would erode user trust in filtering/sorting features generally.
