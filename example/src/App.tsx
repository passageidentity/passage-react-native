import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Passage from 'passage-react-native';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  const onPress = async () => {
    const authResult = await Passage.loginWithPasskey();
    const { authToken } = authResult;
    setResult(authToken);
  };

  return (
    <View style={styles.container}>
      <Text onPress={onPress}>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
