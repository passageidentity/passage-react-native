import * as React from 'react';
import { SafeAreaView } from 'react-native';

import {
  AppView,
  HostedView,
  MagicLinkView,
  OTPView,
  SocialView,
} from './testViews';

export default function App() {
  return (
    <SafeAreaView>
      <AppView />
      <HostedView />
      <OTPView />
      <MagicLinkView />
      <SocialView />
    </SafeAreaView>
  );
}
