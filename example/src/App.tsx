import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { multiply, registerWithPasskey } from 'passage-react-native';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
    
  }, []);

  const onPress = () => {
    registerWithPasskey("ricky.padilla+rn5@passage.id").then((authResult) => {
      console.log(authResult)
    });
  }

  return (
    <View style={styles.container}>
      <Text onPress={onPress}
      >Result: {result}</Text>
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
