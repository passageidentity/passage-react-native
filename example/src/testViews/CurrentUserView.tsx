import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';

import {
  CurrentUserTest,
  EXISTING_USER_EMAIL,
  EXISTING_USER_ID,
  EXISTING_USER_PASSKEY_ID,
  PASSAGE_TEST_APP_ID,
} from '../../constants';
import { failTest, passTest } from '../testUtils/helpers';
import MailosaurAPIClient from '../testUtils/MailosaurClient';

export const CurrentUserView = () => {

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

  const testUserInfo = async () => {
    try {
      await loginIfNeeded();
      const userInfo = await passage.currentUser.userInfo();
      if (userInfo.id === EXISTING_USER_ID) {
        passTest();
      } else {
        throw new Error('User id is incorrect');
      }
    } catch(error) {
      failTest(error);
    }
  };

  const testChangeEmail = async () => {
    try {
      await loginIfNeeded();
      const magicLink = await passage.currentUser.changeEmail(
        'authentigator+CHANGE_EMAIL@ncor7c1m.mailosaur.net'
      );
      console.log(magicLink);
      passTest();
    } catch(error) {
      failTest(error);
    }
  };

  const testChangePhone = async () => {
    try {
      await loginIfNeeded();
      const magicLink = await passage.currentUser.changePhone('+15125874725');
      console.log(magicLink);
      passTest();
    } catch(error) {
      failTest(error);
    }
  };
  
  const testListPasskeys = async () => {
    try {
      await loginIfNeeded();
      const passkeys = await passage.currentUser.passkeys();
      const passkeyIdIsCorrect = passkeys
      .find(passkey => passkey.id === EXISTING_USER_PASSKEY_ID);
      if (passkeys.length === 1 && passkeyIdIsCorrect) {
        passTest();
      } else {
        throw new Error('Unexpected passkeys value');
      }
    } catch(error) {
      failTest(error);
    }
  };

  const testEditPasskey = async () => {
    try {
      await loginIfNeeded();
      const newPasskeyName = `${Date.now()}_passkey`;
      const updatedPasskey = await passage.currentUser.editPasskey(
        EXISTING_USER_PASSKEY_ID,
        newPasskeyName
      );
      if (updatedPasskey.friendlyName === newPasskeyName) {
        passTest();
      } else {
        throw new Error('Wrong passkey friendly name');
      }
    } catch(error) {
      failTest(error);
    }
  };
  
  const testLogOut = async () => {
    try {
      await loginIfNeeded();
      await passage.currentUser.logout();
      const isAuthTokenValid = await passage.tokenStore.isAuthTokenValid();
      if (isAuthTokenValid) {
        throw new Error('Token is still valid');
      } else {
        passTest();
      }
    } catch(error) {
      failTest(error);
    }
  };

  return (
    <View>
      <Text onPress={testUserInfo}>{CurrentUserTest.UserInfo}</Text>
      <Text onPress={testChangeEmail}>{CurrentUserTest.ChangeEmail}</Text>
      <Text onPress={testChangePhone}>{CurrentUserTest.ChangePhone}</Text>
      <Text onPress={testListPasskeys}>{CurrentUserTest.ListPasskeys}</Text>
      <Text onPress={testEditPasskey}>{CurrentUserTest.EditPasskey}</Text>
      <Text onPress={testLogOut}>{CurrentUserTest.LogOut}</Text>
    </View>
  );
  
};
