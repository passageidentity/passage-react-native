import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';
import { testAlert } from '../helpers';
import {
  ERROR,
  EXISTING_USER_EMAIL,
  FAILURE,
  PASSAGE_TEST_APP_ID,
  SUCCESS,
} from '../../constants';

export const AppView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);

  const onPressInfo = async () => {
    const appInfo = await passage.app.info();
    testAlert(appInfo.id);
  };

  const onPressUserExistsExistingUser = async () => {
    const user = await passage.app.userExists(EXISTING_USER_EMAIL);
    testAlert(user?.id || '');
  };

  const onPressUserExistsNoUser = async () => {
    const userEmail = 'fakeuser@passage.id';
    const user = await passage.app.userExists(userEmail);
    testAlert(user ? FAILURE : SUCCESS);
  };

  const onPressCreateUserNoUser = async () => {
    const userEmail = `authentigator+${Date.now().toString()}@passage.id`;
    const newUser = await passage.app.createUser(userEmail);
    testAlert(newUser?.email === userEmail ? SUCCESS : FAILURE);
  };

  const onPressCreateUserExistingUser = async () => {
    try {
      await passage.app.createUser(EXISTING_USER_EMAIL);
      testAlert(FAILURE);
    } catch {
      testAlert(ERROR);
    }
  };

  return (
    <View>
      <Text onPress={onPressInfo}>passage.app.info</Text>
      <Text onPress={onPressUserExistsExistingUser}>passage.app.userExists existing_user</Text>
      <Text onPress={onPressUserExistsNoUser}>passage.app.userExists no_user</Text>
      <Text onPress={onPressCreateUserNoUser}>passage.app.createUser no_user</Text>
      <Text onPress={onPressCreateUserExistingUser}>passage.app.createUser existing_user</Text>
    </View>
  );
  
};
