import * as React from 'react';
import { SafeAreaView } from 'react-native';

import {
  AppView,
  CurrentUserView,
  HostedView,
  MagicLinkView,
  OTPView,
  SocialView,
  TokenStoreView,
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
      <TokenStoreView />
    </SafeAreaView>
  );
}
