import {
  type ConfigPlugin,
  AndroidConfig,
  withAndroidManifest,
} from '@expo/config-plugins';
import type { ManifestIntentFilter } from '@expo/config-plugins/build/android/Manifest';

const getIntentFilter = (packageName: string): ManifestIntentFilter => {
  return {
    $: { 'android:autoVerify': 'true' },
    action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
    category: [
      { $: { 'android:name': 'android.intent.category.DEFAULT' } },
      { $: { 'android:name': 'android.intent.category.BROWSABLE' } },
    ],
    data: [
      { $: { 'android:scheme': 'http' } },
      { $: { 'android:scheme': 'https' } },
      { $: { 'android:host': '@string/passage_auth_origin' } },
      { $: { 'android:pathPrefix': `/android/${packageName}` } },
    ],
  };
};

const modifyAndroidManifest: ConfigPlugin = (configuration) => {
  console.log('Passage: Checking Android Manifest for required settings.');
  const packageName = AndroidConfig.Package.getPackage(configuration);
  if (!packageName) {
    console.warn(
      'Passage: Could not retrieve the package name from build.gradle. Skipping manifest modification'
    );
    return configuration;
  }
  return withAndroidManifest(configuration, async (config) => {
    const application = config.modResults.manifest.application?.[0];
    if (!application) {
      console.warn(
        'Passage: Could not retrieve manifest. Skipping manifest modification.'
      );
      return config;
    }
    if (!application['meta-data']) {
      application['meta-data'] = [];
    }
    const metaDataExists = application['meta-data'].some(
      (metaData) => metaData.$['android:name'] === 'asset_statements'
    );
    console.log('Passage: Checking Android Manifest for asset statements.');
    if (!metaDataExists) {
      console.log('Passage: Adding asset_statements meta-data...');
      application['meta-data'].push({
        $: {
          'android:name': 'asset_statements',
          'android:resource': '@string/asset_statements',
        },
      });
    }
    const newIntentFilter = getIntentFilter(packageName);
    const mainActivity = application.activity?.find(
      (activity) => activity.$['android:name'] === '.MainActivity'
    );
    console.log('Passage: Checking Android Manifest for intent filters.');
    if (!mainActivity) {
      console.warn(
        'Passage: Could not retrieve Main Activity xml. Skipping intent filter modification.'
      );
      return config;
    }
    if (!mainActivity['intent-filter']) {
      mainActivity['intent-filter'] = [];
    }
    const existingFilterIndex = mainActivity['intent-filter'].findIndex(
      (filter) =>
        filter.data?.some(
          (data) => data.$['android:pathPrefix'] === `/android/${packageName}`
        )
    );
    if (existingFilterIndex === -1) {
      console.log('Passage: Adding new intent filter.');
      mainActivity['intent-filter'].push(newIntentFilter);
    } else {
      console.log('Passage: Updating existing intent filter.');
      mainActivity['intent-filter'][existingFilterIndex] = newIntentFilter;
    }
    console.log('Passage: Android Manifest check complete.');
    return config;
  });
};

export default modifyAndroidManifest;
