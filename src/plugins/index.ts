import { withPlugins } from '@expo/config-plugins';
import type { ExpoConfig } from '@expo/config-types';
import modifyIOSPodfile from './modifyIOSPodfile';
import modifyIOSEntitlementsPlist from './modifyIOSEntitlementsPlist';
import modifyAndroidGradleDependency from './modifyAndroidGradleDependency';
import modifyAndroidStringsXML from './modifyAndroidStringsXML';
import modifyAndroidManifest from './modifyAndroidManifest';

const passageCompletePlugin = (configuration: ExpoConfig) => {
  return withPlugins(configuration, [
    modifyIOSPodfile,
    modifyIOSEntitlementsPlist,
    modifyAndroidGradleDependency,
    modifyAndroidStringsXML,
    modifyAndroidManifest,
  ]);
};

export default passageCompletePlugin;
