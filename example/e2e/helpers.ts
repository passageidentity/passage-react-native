/* eslint-disable */

import { CLOSE, SUCCESS, TEST_RESULT } from '../constants';

export const showTestView = async(viewName: string) => {
  // Find view button by view name
  await element(by.label(`Show ${viewName}`)).tap();
};

export const executeTest = async (buttonName: string) => {
  // Find test button by button name
  await element(by.label(buttonName)).tap();
  // Wait for test result alert to show
  await waitFor(element(by.text(TEST_RESULT)))
    .toBeVisible()
    .withTimeout(15000);
  // Verify that the alert contains the expected value
  await expect(element(by.text(SUCCESS)))
    .toBeVisible();
};

export const dismissAlert = async () => {
  // Dismiss alert by tapping close button
  await element(by.label(CLOSE)).atIndex(0).tap();
};
