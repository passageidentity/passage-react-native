import * as React from 'react';
import { SafeAreaView } from 'react-native';

import { AppView, OTPView } from './testViews';

export default function App() {
  return (
    <SafeAreaView>
      <AppView />
      <OTPView />
    </SafeAreaView>
  );
}
