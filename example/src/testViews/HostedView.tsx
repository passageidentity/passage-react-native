import * as React from 'react';
import { View, Text } from 'react-native';
import { Passage } from '@passageidentity/passage-react-native';
import { HostedTest, PASSAGE_TEST_APP_ID } from '../../constants';

export const HostedView = () => {

  const passage = new Passage(PASSAGE_TEST_APP_ID);

  const testHostedAuthorizeStart = async () => {
    try {
      await passage.hosted.authorize();
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text onPress={testHostedAuthorizeStart}>{HostedTest.AuthorizeStart}</Text>
    </View>
  );
  
};
