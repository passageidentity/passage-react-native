import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';
import { failTest, passTest } from '../testUtils/helpers';
import {
  MAGIC_LINK_USER_EMAIL,
  MagicLinkTest,
  MAGIC_LINK_TEST_APP_ID,
} from '../../constants';
import MailosaurAPIClient from '../testUtils/MailosaurClient';

export const MagicLinkView = () => {

  const passage = new Passage(MAGIC_LINK_TEST_APP_ID);
  const mailosaurClient = new MailosaurAPIClient();

  const testMagicLinkRegisterAndActivate = async () => {
    try {
      const email = mailosaurClient.getUniqueMailosaurEmailAddress();
      await passage.magicLink.register(email);
      const magicLink = await mailosaurClient.waitForMagicLink();
      if (!magicLink) {
        throw new Error('Could not get MagicLink code from email.')
      }
      await passage.magicLink.activate(magicLink);
      passTest();
    } catch(error) {
      failTest(error);
    } finally {
      await passage.currentUser.logout();
    }
  };

  const testMagicLinkLoginAndActivate = async () => {
    try {
      await passage.magicLink.login(MAGIC_LINK_USER_EMAIL);
      const magicLink = await mailosaurClient.waitForMagicLink();
      if (!magicLink) {
        throw new Error('Could not get MagicLink code from email.')
      }
      await passage.magicLink.activate(magicLink);
      passTest();
    } catch(error) {
      failTest(error);
    } finally {
      await passage.currentUser.logout();
    }
  };

  return (
    <View>
      <Text onPress={testMagicLinkRegisterAndActivate}>{MagicLinkTest.RegisterAndActivate}</Text>
      <Text onPress={testMagicLinkLoginAndActivate}>{MagicLinkTest.LoginAndActivate}</Text>
    </View>
  );
  
};
