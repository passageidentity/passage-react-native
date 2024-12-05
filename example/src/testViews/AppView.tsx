import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';
import { failTest, passTest, testAlert } from '../helpers';
import {
  ERROR,
  EXISTING_USER_EMAIL,
  FAILURE,
  PASSAGE_TEST_APP_ID,
  AppTest,
} from '../../constants';
import MailosaurAPIClient from '../MailosaurClient';

export const AppView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);

  const getAppInfo = async () => {
    try {
      const appInfo = await passage.app.info();
      if (appInfo.id === PASSAGE_TEST_APP_ID) {
        passTest();
      } else {
        failTest();
      }
    } catch(error) {
      failTest(error);
    }
  };

  const userExists = async () => {
    try {
      const user = await passage.app.userExists(EXISTING_USER_EMAIL);
      if (user) {
        passTest();
      } else {
        failTest();
      }
    } catch(error) {
      failTest(error);
    }
  };

  const userDoesNotExist = async () => {
    try {
      const userEmail = 'fakeuser@passage.id';
      const user = await passage.app.userExists(userEmail);
      if (user) {
        failTest();
      } else {
        passTest();
      }
    } catch (error) {
      failTest(error);
    }
  };

  const createUser = async () => {
    try {
      const mailosaurClient = new MailosaurAPIClient();
      const email = mailosaurClient.getUniqueMailosaurEmailAddress();
      const newUser = await passage.app.createUser(email);
      if (newUser) {
        passTest();
      } else {
        failTest();
      }
    } catch (error) {
      failTest(error);
    }
  };

  const createUserExists = async () => {
    try {
      const newUser = await passage.app.createUser(EXISTING_USER_EMAIL);
      failTest();
    } catch {
      passTest();
    }
  };

  return (
    <View>
      <Text onPress={getAppInfo}>{AppTest.GetAppInfo}</Text>
      <Text onPress={userExists}>{AppTest.UserExists}</Text>
      <Text onPress={userDoesNotExist}>{AppTest.UserDoesNotExist}</Text>
      <Text onPress={createUser}>{AppTest.CreateUser}</Text>
      <Text onPress={createUserExists}>{AppTest.CreateUserExists}</Text>
    </View>
  );
  
};
