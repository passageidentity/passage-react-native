import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';

import {
  TokenStoreTest,
  EXISTING_USER_EMAIL,
  PASSAGE_TEST_APP_ID,
} from '../../constants';
import { failTest, passTest } from '../testUtils/helpers';
import MailosaurAPIClient from '../testUtils/MailosaurClient';

export const TokenStoreView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);
  const mailosaurClient = new MailosaurAPIClient();

  const loginIfNeeded = async () => {
    const isAuthTokenValid = await passage.tokenStore.isAuthTokenValid();
    if (isAuthTokenValid) return;
    const otp = await passage.oneTimePasscode.login(EXISTING_USER_EMAIL);
    const code = await mailosaurClient.waitForOneTimePasscode();
    if (!code) {
      throw new Error('Could not get OTP code from email.');
    }
    await passage.oneTimePasscode.activate(code, otp.otpId);
  };

  const testTokenIsValid = async () => {
    try {
      await loginIfNeeded();
      const authToken = await passage.tokenStore.getValidAuthToken();
      if (authToken) {
        passTest();
      } else {
        throw new Error('Token is null, expected string');
      }
    } catch(error) {
      failTest(error);
    }
  };

  const testTokenIsInvalid = async () => {
    try {
      await loginIfNeeded();
      await passage.currentUser.logout();
      const authToken = await passage.tokenStore.getValidAuthToken();
      console.log(authToken);
      if (!authToken) {
        passTest();
      } else {
        throw new Error('Token is string, expected null');
      }
    } catch(error) {
      failTest(error);
    }
  };

  return (
    <View>
      <Text onPress={testTokenIsValid}>{TokenStoreTest.TokenIsValid}</Text>
      <Text onPress={testTokenIsInvalid}>{TokenStoreTest.TokenIsInvalid}</Text>
    </View>
  );
  
};
