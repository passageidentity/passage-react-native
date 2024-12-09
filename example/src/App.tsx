import * as React from 'react';
import { SafeAreaView } from 'react-native';

import {
  AppView,
  CurrentUserView,
  HostedView,
  MagicLinkView,
  OTPView,
  SocialView,
} from './testViews';

export default function App() {
  return (
    <SafeAreaView>
      <AppView />
      <CurrentUserView />
      <HostedView />
      <OTPView />
      <MagicLinkView />
      <SocialView />
    </SafeAreaView>
  );
}
