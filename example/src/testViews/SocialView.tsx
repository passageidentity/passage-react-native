import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage, SocialConnection } from '@passageidentity/passage-react-native';
import { SocialTest, PASSAGE_TEST_APP_ID } from '../../constants';

export const SocialView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);

  const testAuthorizeStart = async () => {
    try {
      await passage.social.authorize(SocialConnection.Github);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text onPress={testAuthorizeStart}>{SocialTest.AuthorizeStart}</Text>
    </View>
  );
  
};
