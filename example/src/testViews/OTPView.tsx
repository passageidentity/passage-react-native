import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';
import { failTest, passTest } from '../testUtils/helpers';
import {
  EXISTING_USER_EMAIL,
  OTPTest,
  PASSAGE_TEST_APP_ID,
} from '../../constants';
import MailosaurAPIClient from '../testUtils/MailosaurClient';

export const OTPView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);
  const mailosaurClient = new MailosaurAPIClient();

  const testOTPRegisterAndActivate = async () => {
    try {
      const email = mailosaurClient.getUniqueMailosaurEmailAddress();
      const otp = await passage.oneTimePasscode.register(email);
      const code = await mailosaurClient.waitForOneTimePasscode();
      if (!code) {
        throw new Error('Could not get OTP code from email.')
      }
      await passage.oneTimePasscode.activate(code, otp.otpId)
      passTest();
    } catch(error) {
      failTest(error);
    } finally {
      await passage.currentUser.logout();
    }
  };

  const testOTPLoginAndActivate = async () => {
    try {
      const otp = await passage.oneTimePasscode.login(EXISTING_USER_EMAIL);
      const code = await mailosaurClient.waitForOneTimePasscode();
      if (!code) {
        throw new Error('Could not get OTP code from email.')
      }
      await passage.oneTimePasscode.activate(code, otp.otpId)
      passTest();
    } catch(error) {
      failTest(error);
    } finally {
      await passage.currentUser.logout();
    }
  };

  return (
    <View>
      <Text onPress={testOTPRegisterAndActivate}>{OTPTest.RegisterAndActivate}</Text>
      <Text onPress={testOTPLoginAndActivate}>{OTPTest.LoginAndActivate}</Text>
    </View>
  );
  
};
