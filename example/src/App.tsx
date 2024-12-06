import * as React from 'react';
import { SafeAreaView } from 'react-native';

import { AppView, MagicLinkView, OTPView } from './testViews';

export default function App() {
  return (
    <SafeAreaView>
      <AppView />
      <OTPView />
      <MagicLinkView />
    </SafeAreaView>
  );
}
