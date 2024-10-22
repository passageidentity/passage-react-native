const {
  AndroidConfig,
  withDangerousMod,
  withPlugins,
  withAndroidManifest,
  withEntitlementsPlist,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Declare native Complete dependencies
const completeAndroidVersion = '2.0.2';
const gradelDependency = `implementation 'id.passage.android:passage:${completeAndroidVersion}'`;
const completeIosVersion = '1.0.1';
const podDependency = `pod 'PassageSwift', '${completeIosVersion}'`;

// iOS: Add Passage Swift CocoaPod
function withIosPodfile(configuration) {
  return withDangerousMod(configuration, [
    'ios',
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );
      let podfileContents = fs.readFileSync(podfilePath, 'utf-8');
      if (!podfileContents.includes(podDependency)) {
        const targetIndex = podfileContents.lastIndexOf(`target '`);
        if (targetIndex !== -1) {
          const nextLineIndex = podfileContents.indexOf('\n', targetIndex);
          podfileContents =
            podfileContents.slice(0, nextLineIndex) +
            `  ${podDependency}\n` +
            podfileContents.slice(nextLineIndex);
        }
      }
      fs.writeFileSync(podfilePath, podfileContents);
      return config;
    },
  ]);
}

// iOS: Add Associated Domains Capability
function withIosAssociatedDomain(configuration) {
  const associatedDomain = process.env.ASSOCIATED_DOMAIN;
  if (!associatedDomain) {
    return configuration;
  }
  return withEntitlementsPlist(configuration, (config) => {
    const webCredEntitlement = `webcredentials:${associatedDomain}`;
    const appLinksEntitlement = `applinks:${associatedDomain}`;
    // Get existing associated domains if they exist
    const key = 'com.apple.developer.associated-domains';
    let domains = config.modResults[key] || [];
    // Add the new domain only if it's not already present
    if (!domains.includes(webCredEntitlement)) {
      domains.push(webCredEntitlement);
    }
    if (!domains.includes(appLinksEntitlement)) {
      domains.push(appLinksEntitlement);
    }
    config.modResults[key] = domains;
    return config;
  });
}

// Android: Add Passage Android Gradle Dependency
function withAndroidGradleDependency(configuration) {
  return withDangerousMod(configuration, [
    'android',
    (config) => {
      const buildGradlePath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'build.gradle'
      );
      let buildGradleContents = fs.readFileSync(buildGradlePath, 'utf-8');
      if (!buildGradleContents.includes(gradelDependency)) {
        const dependenciesIndex = buildGradleContents.indexOf('dependencies {');
        if (dependenciesIndex !== -1) {
          const nextLineIndex = buildGradleContents.indexOf(
            '\n',
            dependenciesIndex
          );
          buildGradleContents =
            buildGradleContents.slice(0, nextLineIndex + 1) +
            `    ${gradelDependency}\n` +
            buildGradleContents.slice(nextLineIndex + 1);
        }
      }
      fs.writeFileSync(buildGradlePath, buildGradleContents);
      return config;
    },
  ]);
}

// Android: Modify AndroidManifest.xml for asset_statements
function withAndroidAssociatedDomain(configuration) {
  const associatedDomain = process.env.ASSOCIATED_DOMAIN;
  if (!associatedDomain) {
    return configuration;
  }
  // Fetch the package name from build.gradle.
  const packageName = AndroidConfig.Package.getPackage(configuration);
  if (!packageName) {
    throw new Error('Could not retrieve the package name from build.gradle');
  }

  // Modify AndroidManifest.xml
  configuration = withAndroidManifest(configuration, async (config) => {
    const application = config.modResults.manifest.application[0];
    if (!application.hasOwnProperty('meta-data')) {
      application['meta-data'] = [];
    }
    const metaDataExists = application['meta-data'].some(
      (metaData) => metaData.$['android:name'] === 'asset_statements'
    );
    if (!metaDataExists) {
      application['meta-data'].push({
        $: {
          'android:name': 'asset_statements',
          'android:resource': '@string/asset_statements',
        },
      });
    }
    return config;
  });

  // Modify strings.xml
  configuration = withDangerousMod(configuration, [
    'android',
    (config) => {
      const stringsXmlPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/values/strings.xml'
      );
      if (!fs.existsSync(stringsXmlPath)) {
        throw new Error(`strings.xml not found at ${stringsXmlPath}`);
      }
      let stringsXmlContent = fs.readFileSync(stringsXmlPath, 'utf-8');
      // Check if the string already exists
      if (!stringsXmlContent.includes('<string name="asset_statements">')) {
        const newStrings = `<string name="passage_auth_origin">${associatedDomain}</string>
        <string name="asset_statements">[{"include": "https://@string/passage_auth_origin/.well-known/assetlinks.json"}]</string>`;
        // Insert the new strings before the closing </resources> tag
        stringsXmlContent = stringsXmlContent.replace(
          '</resources>',
          `${newStrings}\n</resources>`
        );
        fs.writeFileSync(stringsXmlPath, stringsXmlContent);
      }
      return config;
    },
  ]);
  return configuration;
}

// Combine all plugins into a single config plugin
const passageCompletePlugin = (configuration) => {
  return withPlugins(configuration, [
    withIosPodfile,
    withIosAssociatedDomain,
    withAndroidGradleDependency,
    withAndroidAssociatedDomain,
  ]);
};

export default passageCompletePlugin;