import { Alert } from 'react-native';
import { CLOSE, TEST_RESULT } from '../constants';

export const testAlert = (testValue: string) => {
  Alert.alert(
    TEST_RESULT,
    testValue,
    [
      {
        text: CLOSE,
        style: 'cancel',
      },
    ]
  );
};
