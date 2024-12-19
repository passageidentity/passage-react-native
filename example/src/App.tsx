import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import {
  AppView,
  CurrentUserView,
  HostedView,
  MagicLinkView,
  OTPView,
  SocialView,
  TokenStoreView,
} from './testViews';
import { ViewName } from '../constants';

const views: Record<ViewName, React.FC> = {
  AppView: AppView,
  CurrentUserView: CurrentUserView,
  HostedView: HostedView,
  MagicLinkView: MagicLinkView,
  OTPView: OTPView,
  SocialView: SocialView,
  TokenStoreView: TokenStoreView,
};

const App = () => {
  const [visibleView, setVisibleView] = useState<ViewName | null>(null);
  return (
    <SafeAreaView>
      {Object.keys(views).map(viewName => (
        <Text
          key={viewName}
          onPress={() => setVisibleView(viewName as ViewName)}
        >
          {`Show ${viewName}`}
        </Text>
      ))}
      {visibleView && React.createElement(views[visibleView])}
    </SafeAreaView>
  );
};

export default App;
