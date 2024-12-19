import { Alert } from 'react-native';
import { CLOSE, FAILURE, SUCCESS, TEST_RESULT } from '../../constants';

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

export const passTest = () => {
  testAlert(SUCCESS);
};

export const failTest = (error: any = null) => {
  error && console.error(error);
  testAlert(FAILURE);
};
